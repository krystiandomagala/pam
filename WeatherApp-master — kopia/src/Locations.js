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
  TextInput,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import LocationTab from "./LocationTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';

const Locations = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused(false);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false)
      try {
        const storedData = await AsyncStorage.getItem('queue');
          const parsedData = JSON.parse(storedData);
          setData(parsedData.reverse());
          setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(true)
    };

    if(isFocused)
    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView>
      {
        isLoading && isFocused ? data.map((item, index) => (
          <LocationTab key={index} data={item} />)) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  header: {
    fontSize: 24,
  },

});

export default Locations;
