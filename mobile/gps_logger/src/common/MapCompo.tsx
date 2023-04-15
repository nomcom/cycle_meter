import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import * as Rest from "../rest/api";

let MAPVIEW: MapView | null = null;

export default function Component() {
  const [text, setText] = useState("テスト");
  const [gpsOn, setGpsOn] = useState(false);
  const [curPos, setCurPos] = useState<LocationObject | null>(null);
  const [followMarker, setFollowMarker] = useState(false);
  const [saveMarker, setSaveMarker] = useState(true);

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
  }, []);

  const marker = (
    <Marker coordinate={{ latitude: 35.645736, longitude: 139.747575 }} />
  );
  return (
    <View style={styles.container}> 
        <Text>{text}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.start, enabled(!gpsOn)]}
            // onPress={startBackgroundUpdate}
          >
            <Text style={styles.text}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonBase, styles.stop, enabled(gpsOn)]}
            // onPress={stopBackgroundUpdate}
          >
            <Text style={styles.text}>Stop</Text>
          </TouchableOpacity>

          <View style={styles.checks}>
            <BouncyCheckbox
              size={20}
              fillColor="green"
              style={[styles.buttonBase]}
              // onPress={() => setSaveMarker(!saveMarker)}
              disableBuiltInState
              // isChecked={saveMarker}
            />

            <BouncyCheckbox
              size={20}
              fillColor="blue"
              style={[styles.buttonBase]}
              // onPress={() => setFollowMarker(!followMarker)}
              disableBuiltInState
              // isChecked={followMarker}
            />
          </View>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={(map) => {
            MAPVIEW = map;
          }}
        >
          {marker}
        </MapView>  
    </View>
  );
}

// Styles
const enabled = (isEnabled: boolean): ViewStyle | undefined => {
  if (!isEnabled) {
    return {
      backgroundColor: "gray",
    };
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  map: {
    flex: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
  },
  checks: {
    flex: 1,
    margin: 5,
  },
  buttonBase: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    flex: 3,
    backgroundColor: "green",
  },
  stop: {
    flex: 3,
    backgroundColor: "red",
  },
});

