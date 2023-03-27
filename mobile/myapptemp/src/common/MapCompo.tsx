import React, { useState, useEffect } from "react";
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

const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";
let LOC_CALLBACKS: ((location: LocationObject) => void)[] = [];
let MAPVIEW: MapView | null = null;

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data as any;
    const location = locations[0];
    if (location) {
      console.log("Location in background", location.coords);
      LOC_CALLBACKS.forEach((f) => f(location));
    }
  }
});

// Component
export default function App() {
  const [text, setText] = useState("");
  const [gpsOn, setGpsOn] = useState(false);
  const [curPos, setCurPos] = useState<LocationObject | null>(null);

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
  }, []);

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started, going to stop");
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }

    setGpsOn(true);
    LOC_CALLBACKS = [];
    LOC_CALLBACKS.push((location) => {
      setCurPos(location);
      const d = new Date(location.timestamp);
      setText(
        `LAST DATE[${d}]\n` +
          `Location in background:${JSON.stringify(location.coords)}`
      );

      MAPVIEW?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    });

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
        // Boolean value whether to destroy the foreground service if the app is killed.
        // killServiceOnDestroy: true,
      },
      // The distance in meters that must occur
      // between last reported location and the current location
      // before deferred locations are reported.
      // deferredUpdatesDistance: 100,
      // Minimum time interval in milliseconds
      // that must pass since last reported location before all later locations are reported in a batched update
      deferredUpdatesInterval: 5000,
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    setGpsOn(false);
    LOC_CALLBACKS = [];

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tracking stopped");
    }
  };

  const marker = curPos == null ? null : <Marker coordinate={curPos.coords} />;

  return (
    <View style={styles.container}>
      <Text>{text}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.start, enabled(!gpsOn)]}
          onPress={startBackgroundUpdate}
        >
          <Text style={styles.text}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonBase, styles.stop, enabled(gpsOn)]}
          onPress={stopBackgroundUpdate}
        >
          <Text style={styles.text}>Stop</Text>
        </TouchableOpacity>
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
    gap: 10,
    margin: 5,
  },
  buttonBase: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    backgroundColor: "green",
  },
  stop: {
    backgroundColor: "red",
  },
});
