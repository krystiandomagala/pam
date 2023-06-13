import {
  View,
  Text,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";


const openWeatherKey = "295b34dcad40dad42c4d5dcb4745a1ae";

let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&lang=pl&appid=${openWeatherKey}`;

const LocationTab = (data) => {
  const navigation = useNavigation();

  const weatherData = Object.assign(data.data)
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLocation = async (city_id) => {
    setRefreshing(true);

    const response = await fetch(`${url}&id=${city_id}`);
    const data = await response.json();

    if (response.ok) {
      setForecast(data)
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadLocation(weatherData.city.id);
  }, []);

  if (!forecast) {
    return (null);
  }
  else
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Pogoda", weatherData.city.id)}>
    <LinearGradient 
      style={styles.container}
      colors={setBackground(forecast)}
      start={{ x: 1, y: -1.7 }}
    >
      <View style={{justifyContent: 'center', alignItems:"flex-start",flexDirection: "column"}}>
        <Text style={styles.location}>{forecast.city.name}</Text>
        <Text style={styles.info}>{forecast.list[0].weather[0].description}</Text>
      </View>
      <View style={{justifyContent: 'center', alignItems:"center",flexDirection: "row"}}>
            <Image
              style={styles.icon}
              source={{
                uri: `http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@4x.png`,
              }}
            ></Image>
        <Text style={styles.degrees}>{Math.floor(forecast.list[0].main.temp)}°</Text>
      </View>
    </LinearGradient>
    </TouchableOpacity>
  );
};

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
    justifyContent:'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: "#329DFF",
    borderRadius: 12,
    flexDirection: 'row'
  },
  location: {
    fontSize: 18,
    color: "#FEFEFE",
    fontWeight: "600",
  },
  hour: {
    color: "#fefefe",
    fontSize: 12,
    marginBottom: 10,
  },
  info: {
    color: "#FEFEFE",
    fontSize: 12,
    textTransform: "capitalize"
  },
  degrees: {
    fontSize: 40,
    color: '#fefefe',
    marginLeft: 10,
    width: 70
  },
  icon:{
    width: 70,
    height: 60
  }
});

export default LocationTab;
