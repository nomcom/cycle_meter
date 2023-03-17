import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>MAP</Text>
      <MapView style={styles.map}>
        <Marker
          title="YIKES, Inc."
          description="Web Design and Development"
          coordinate={{ latitude: 39.969183, longitude: -75.133308 }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  map: {
    width: "100%",
    height: "50%",
  },
});
