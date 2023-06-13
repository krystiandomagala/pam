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
import React, { useEffect, useState } from "react";

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Autorzy</Text>
      <Text style={styles.paragraph}>
        Autorami aplikacji są Krystian Domagała lraz Jakub Brandys, studenci z
        grupy <Text style={{ fontWeight: "700" }}>lab1/3/PROG</Text>.
      </Text>
      <Text style={styles.header}>Opis</Text>
      <Text style={styles.paragraph2}>
        Aplikacja 
          <Text style={{ fontWeight: "700" }}> Pogoda</Text> umożliwia
        przeglądanie danych pogodowych z
          <Text style={{ fontWeight: "700" }}> OpenWeatherMap</Text> w prosty i
        przejrzysty sposób. Projekt posiada funkcjonalności takie jak:

      </Text>
      <FlatList style={{marginTop: 15}}
            data={[
              { key: `wyszukiwanie lokalizacji poprzez nazwę miejscowości,` },
              { key: `wgląd do 24 godzinnej prognozy pogody (z 3 godzinnym skokiem przez ograniczenia darmowej wersji API)`},
              { key: "przeglądanie prognozy na najbliższe 4 dni, " },
              { key: "zmianę jednostek w ustawieniach." },
            ]}
            renderItem={({ item }) => {
              return (
                <View style={{ marginTop: 0, }}>
                  <Text style={{ fontSize: 14 , color: "#252525", paddingTop: 5, paddingRight: 10, paddingLeft: 10, paddingBottom: 5, lineHeight: 18}}>➜ {item.key}</Text>
                </View>
              );
            }}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#252525",
    marginBottom: 15,
    marginTop: 25,
  },
  paragraph: {
    color: "#252525",
    lineHeight: 22,
  },
  paragraph2: {
    color: "#252525",
    lineHeight: 22
  },
});

export default About;
