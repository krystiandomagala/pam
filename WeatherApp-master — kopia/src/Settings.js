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
} from "react-native";
import React, { useEffect, useState } from "react";
import { RadioButton,Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const [unit, setUnit] = useState('metric'); // Domyślna jednostka pogodowa
  const navigation = useNavigation()

  useEffect(() => {
    // Wczytanie jednostki z AsyncStorage przy zamontowaniu komponentu
    getUnitFromAsyncStorage();
  }, []);

  const getUnitFromAsyncStorage = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem('unit');
      if (savedUnit !== null) {
        setUnit(savedUnit); // Ustawienie wczytanej jednostki jako aktualną
      }
    } catch (error) {
      console.log('Błąd podczas pobierania jednostki z AsyncStorage:', error);
    }
  };

  const saveUnitToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('unit', unit);
      setUnit(unit); // Ustawienie wybranej jednostki jako aktualną
      console.log('Jednostka została zapisana w AsyncStorage:', unit);
    } catch (error) {
      console.log('Błąd podczas zapisywania jednostki w AsyncStorage:', error);
    }
    
    navigation.navigate("Pogoda")
  };

  return (
    <View style={styles.container}>
    <View>
    <Text style={styles.header}>Jednostki pomiaru</Text>
    <RadioButton.Group onValueChange={unit => setUnit(unit)} value={unit}>
      <RadioButton.Item label="Metryczne" value="metric" color="#006ADC"/>
      <RadioButton.Item label="Imperialne" value="imperial" color="#006ADC"/>
    </RadioButton.Group>
    </View>

    <Button mode="contained" buttonColor= "#006ADC" onPress={saveUnitToAsyncStorage}>
      Zapisz
    </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent:"space-between"
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#252525",
    marginBottom: 15,
    marginTop: 25,
  },
  disclaimer: {
    fontSize: 12,
    marginHorizontal: 15
  }
});

export default Settings;
