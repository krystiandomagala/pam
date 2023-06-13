import {
  View,
  Text,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { Queue } from "./Queue";
import { useRoute } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const openWeatherKey = "295b34dcad40dad42c4d5dcb4745a1ae";

const recentLocations = new Queue(14);

const Weather = () => {
  const route = useRoute();
  const [locationRoute, setLocationRoute] = useState(false);
  const isFocused = useIsFocused(false);
  const [showSearch, toggleSearch] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("metric");
  const [isLoading, setIsLoading] = useState(true);

  const url = `https://api.openweathermap.org/data/2.5/forecast?&lang=pl&appid=${openWeatherKey}&units=${unit}`;

  const loadUnit = async () => {
    setIsLoading(true);
    try {
      const unitFromStorage = await AsyncStorage.getItem("unit");
      if (unitFromStorage) {
        setUnit(unitFromStorage);
      }
      else
        setUnit("metric");
        
      console.log("unit: ", unitFromStorage);

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);


  };

  const handleSearch = (value) => {
    loadLocation(value);
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const loadLocation = async (city) => {
    setRefreshing(true);

    const response = await fetch(`${url}&q=${city}`);
    const data = await response.json();

    if (response.ok) {
      setForecast(data);
      setValue("");
      Keyboard.dismiss();
      recentLocations.enqueue(data);
      recentLocations.loadQueue();
    }

    setRefreshing(false);
  };
  const loadLocationsFromParams = async (city_id) => {
    setRefreshing(true);

    const response = await fetch(`${url}&id=${city_id}`);
    const data = await response.json();

    if (response.ok) {
      setForecast(data);
      setValue("");
      Keyboard.dismiss();
      recentLocations.enqueue(data);
      recentLocations.loadQueue();
    }

    setRefreshing(false);
  };
  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      await Location.requestBackgroundPermissionsAsync();
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccurancy: false,
    });

    const response = await fetch(
      `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    const data = await response.json();

    if (!response.ok) Alert.alert("Error", "Something went wrong");
    else setForecast(data);

    recentLocations.enqueue(data);
    recentLocations.loadQueue();

    setRefreshing(false);
  };

  useEffect(() => {
    if (route.params === undefined) setLocationRoute(true);
    else setLocationRoute(route.params);
  });

  useEffect(() => {
    loadUnit();

    if (locationRoute) loadLocationsFromParams(route.params);
    else loadForecast();

    setLocationRoute(false);
  }, [isFocused]);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  setBackground(forecast);

  const weather = forecast.list[0];
  const currentLocation = forecast.city;

  global.currentLocation = currentLocation;
  global.weather = weather;

  let forecastData = {
    forecastData: forecast.list,
    timezone: forecast.city.timezone,
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={setBackground(forecast)}
      start={{ x: 0.7, y: 0 }}
    >
      <SafeAreaView style={{ marginTop: 80 }}>
        <ScrollView
          style={{ zIndex: -1 }}
          refreshControl={
            <RefreshControl
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              refreshing={refreshing}
              onRefresh={() => loadForecast()}
            />
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              margin: 20,
            }}
          >
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onChangeText={handleTextDebounce}
              onFocus={() => toggleSearch(!showSearch)}
              onBlur={() => toggleSearch(false)}
              style={styles.input}
              placeholder="Szukaj miasta"
              keyboardType="default"
            />
            <Pressable>
              <MaterialIcons
                onPress={() => loadForecast()}
                name="my-location"
                size={28}
                style={styles.button}
              ></MaterialIcons>
            </Pressable>
          </View>

          { unit ?
          <View>
          <Text style={styles.coords}>
            {getDMS(currentLocation.coord.lat, "lat")}
            &nbsp;
            {getDMS(currentLocation.coord.lon, "lon")}
          </Text>
          <Text style={styles.title}>{currentLocation.name}</Text>
          <View style={styles.currentWeather}>
            <Text style={styles.weatherDesc}>
              {weather.weather[0].description}
            </Text>
            <Image
              style={styles.largeIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
              }}
            />
            <Text style={styles.currentTemp}>
              {Math.floor(weather.main.temp)}°
            </Text>
            <Text style={styles.feelsLikeTemp}>
              Odczuwalne {Math.floor(weather.main.feels_like)}°
            </Text>
          </View>

          <HourlyWeather {...forecastData} />
          <DailyWeather forecastData={forecast.list} /> 
          </View> : null
          }
        </ScrollView>
      </SafeAreaView> 
    </LinearGradient>
  );
};

export default Weather;

function getDMS(dd, longOrLat) {
  let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
    ? dd < 0
      ? "W"
      : "E"
    : dd < 0
    ? "S"
    : "N";

  const absDD = Math.abs(dd);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(
    2
  );

  let dmsArray = [degrees, minutes, seconds, hemisphere];
  return `${dmsArray[0]}°${dmsArray[1]}'${dmsArray[2]}" ${dmsArray[3]}`;
}
function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}
function setBackground(forecastData) {
  const backgroundSet = [
    ["#A4E4FF", "#329DFF", "#2E539B"],
    ["#E7E7E7", "#9F9F9F", "#414141"],
    ["#2F333C", "#193367"],
  ];

  const sunset = new Date(
    getDate(forecastData.city.sunset, forecastData.city.timezone)
  );
  const sunrise = new Date(
    getDate(forecastData.city.sunrise, forecastData.city.timezone)
  );
  const now = new Date(
    getDate(forecastData.list[0].dt, forecastData.city.timezone)
  );

  const weatherConditions = [
    "Thunderstorm",
    "Drizzle",
    "Rain",
    "Snow",
    "Mist",
    "Clouds",
  ];

  if (now >= sunrise && now <= sunset) {
    if (weatherConditions.includes(forecastData.list[0].weather[0].main))
      return backgroundSet[1];

    return backgroundSet[0];
  }

  return backgroundSet[2];
}
function getDate(dt, timezone) {
  const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
  const utc_milliseconds = utc_seconds * 1000;
  const local_date = new Date(utc_milliseconds).toUTCString();
  return local_date;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locItem: {
    padding: 10,
    zIndex: 1,
  },
  borderClass: {
    borderBottomColor: "#d5d5d5",
    borderBottomWidth: 1,
  },
  bar: {
    zIndex: 1,
    backgroundColor: "#fefefe",
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    top: 60,
    position: "absolute",
    marginHorizontal: 20,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    color: "#FEFEFE",
    backgroundColor: "rgba(37, 37, 37, 0.25)",
    fontSize: 18,
    marginRight: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 10,
  },
  coords: {
    marginTop: 30,
    textAlign: "center",
    color: "#FEFEFE",
    fontWeight: "300",
    fontSize: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "medium",
    color: "#FEFEFE",
    textShadowColor: "rgba(37, 37, 37, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
  currentWeather: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  weatherDesc: {
    fontSize: 12,
    textTransform: "capitalize",
    color: "#FEFEFE",
    textShadowColor: "rgba(37, 37, 37, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  feelsLikeTemp: {
    color: "#FEFEFE",
    fontWeight: "300",
    fontSize: 12,
    textShadowColor: "rgba(37, 37, 37, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FEFEFE",
    textShadowColor: "rgba(37, 37, 37, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
  largeIcon: {
    width: 150,
    height: 100,
  },
  button: {
    backgroundColor: "rgba(37, 37, 37, 0.25)",
    color: "#474747",
    padding: 7,
    borderRadius: 22,
    overflow: "hidden",
  },
});
