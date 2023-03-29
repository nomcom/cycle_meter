import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Axios from "axios";
Axios.defaults.baseURL = "https://cycle-54ee5-default-rtdb.firebaseio.com/";

import MapCompo from "./src/common/MapCompo";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapCompo></MapCompo>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
