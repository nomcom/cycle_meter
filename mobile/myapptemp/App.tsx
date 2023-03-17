import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapCompo from "./src/common/MapCompo";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>アプリ作成!</Text>
      <StatusBar style="auto" />
      <MapCompo></MapCompo>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
