import { StyleSheet } from "react-native";
import Weather from "./src/Weather";
import About from "./src/About";
import Locations from "./src/Locations";
import Settings from "./src/Settings";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";

const Drawer = createDrawerNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Pogoda">
        <Drawer.Screen
          name="Pogoda"
          component={Weather}
          options={{
            headerTransparent: true,
            headerTintColor: "#fefefe",
          }}
        />
        <Drawer.Screen name="O aplikacji" component={About} />
        <Drawer.Screen 
          name="Lokacje" 
          component={Locations}
        
           />
        <Drawer.Screen name="Ustawienia" component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
