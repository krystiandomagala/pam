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
  FlatList,
  LogBox 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
const DailyWeather = (forecastData) => {
  let weatherList = getTemperaturesByDay(forecastData.forecastData);
  
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.weatherDescription}>4-DNIOWA PROGNOZA POGODY</Text>
      </View>
      <FlatList
      scrollEnabled={false}
        data={Object.entries(weatherList).slice(0,4).map(([day, temperatures]) => ({
          day,
          highestTemp: temperatures.highestTemp,
          lowestTemp: temperatures.lowestTemp,
          icon: temperatures.icon,
          currentTemp: temperatures.currentTemp,
        }))}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={styles.hourly}>
            <Text style={{ fontSize: 14, color: "#FEFEFE", width: 50 }}>
              {item.day}
            </Text>
            <Image
              style={styles.smallIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${item.icon}@4x.png`,
              }}
            ></Image>
            <View style={styles.minMaxTemp}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#FEFEFE",
                  width: 42,
                  textAlign: "right",
                }}
              >
                {Math.floor(item.lowestTemp)}°
              </Text>
              <LinearGradient
                style={styles.graph}
                colors={["#EA5555", "#E7DB76", "#2FDFB5"]}
                start={{ x: 0.9, y: 0 }}
              >
                {displayDot(item)}

              </LinearGradient>
              <Text style={{ fontSize: 14, color: "#FEFEFE", width: 42 }}>
                {Math.floor(item.highestTemp)}°
              </Text>
            </View>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

function displayDot(item) {

  if (item.currentTemp !== undefined) {

    const pixelStep = 90 / (item.highestTemp - item.lowestTemp)

    let offsetX = 0

    if(pixelStep != Infinity)
       offsetX = pixelStep * (item.currentTemp - item.lowestTemp) - 4

    return (<View style={[styles.dot, { left: offsetX }]}></View>)
  }
  return null
}

function getTemperaturesByDay(forecastData) {
  const days = ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."];
  const result = {};

  forecastData.forEach((data) => {
    const date = new Date(data.dt * 1000);
    const dayOfWeek = days[date.getUTCDay()];

    if (!result[dayOfWeek]) {
      result[dayOfWeek] = {
        highestTemp: -Infinity,
        lowestTemp: Infinity,
        icon: data.weather[0].icon,
        iconCounts: {},
      };
    }

    if (data.main.temp > result[dayOfWeek].highestTemp) {
      result[dayOfWeek].highestTemp = data.main.temp;
    }

    if (data.main.temp < result[dayOfWeek].lowestTemp) {
      result[dayOfWeek].lowestTemp = data.main.temp;
    }

    if (!data.weather[0].icon.endsWith("n")) {
      const icon = data.weather[0].icon;
      if (result[dayOfWeek].iconCounts[icon]) {
        result[dayOfWeek].iconCounts[icon]++;
      } else {
        result[dayOfWeek].iconCounts[icon] = 1;
      }
    }
  });

  const res = result[Object.keys(result)[0]];

  res.currentTemp = forecastData[0].main.temp;

  delete result[Object.keys(result)[0]];
  const obj = Object.assign({ Dziś: res }, result);

  for (const day in result) {
    const iconCounts = result[day].iconCounts;
    let maxCount = 0;
    let mostFrequentIcon = "";
    for (const icon in iconCounts) {
      if (iconCounts[icon] > maxCount) {
        maxCount = iconCounts[icon];
        mostFrequentIcon = icon;
      }
    }
    result[day].icon = mostFrequentIcon;
  }

  return obj;
}

export default DailyWeather;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.17)",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
  },
  dot: {
    borderColor: "#FEFEFE",
    backgroundColor: "#aaa",
    borderWidth: 2,
    borderRadius: 4,
    width: 8,
    height: 8,
    top: -2.25,
    position: "relative",
    zIndex: 20,
  },
  weatherDescription: {
    fontSize: 12,
    color: "#FEFEFE",
    fontWeight: "200",
  },
  hourly: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#FEFEFE",
    borderTopWidth: 0.5,
    paddingBottom: 5,
    paddingTop: 10,
    marginTop: 10,
  },
  smallIcon: {
    width: 60,
    height: 50,
  },
  graph: {
    height: 4,
    width: 90,
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    zIndex: 10,
    overflow:"visible"
  },
  minMaxTemp: {
    flexDirection: "row",
    alignItems: "center",
  },
});

