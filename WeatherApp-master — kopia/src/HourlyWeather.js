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
} from "react-native";

const HourlyWeather = (forecastData) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.weatherDescription}>
          24-GODZINNA PROGNOZA POGODY
        </Text>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, marginBottom: 10 }}
        horizontal
        data={forecastData.forecastData.slice(0, 9)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(hour) => {
          const weather = hour.item;
          var dt = new Date(getDate(hour.item.dt, forecastData.timezone));
          return (
            <View style={styles.hourly}>
              <Text style={{ fontSize: 12, color: "#FEFEFE" }}>
                {dt.toLocaleTimeString().replace(/:\d{2}/, "")}
              </Text>
              <Image
                style={styles.smallIcon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
                }}
              />
              <Text style={{ fontSize: 14, color: "#FEFEFE" }}>
                {Math.round(weather.main.temp)}°
              </Text>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};

export default HourlyWeather;

function getDate(dt, timezone) {
  const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
  const utc_milliseconds = utc_seconds * 1000;
  const local_date = new Date(utc_milliseconds).toUTCString();
  return local_date;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.17)",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
  },
  weatherDescription: {
    fontSize: 12,
    color: "#FEFEFE",
    fontWeight: "200",
    borderBottomColor: "#FEFEFE",
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  hourly: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  smallIcon: {
    width: 55,
    height: 50,
  },
});
