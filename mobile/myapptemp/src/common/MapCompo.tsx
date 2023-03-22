import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Button } from "react-native";
import { api, util } from "common-library";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

export default function App() {
  const [text, setText] = useState("");
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
            setText(
              `Location in background (${util.strUtil.isTrue(
                "True"
              )}):${JSON.stringify(location.coords)}`
            );
          }
        }
      });
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
      // The distance in meters that must occur
      // between last reported location and the current location
      // before deferred locations are reported.
      deferredUpdatesDistance: 100,
      // Minimum time interval in milliseconds
      // that must pass since last reported location before all later locations are reported in a batched update
      deferredUpdatesInterval: 5000,
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tacking stopped");
    }
  };

  return (
    <View>
      <Text>MAP</Text>
      <Text>{text}</Text>
      <Button title="Start" onPress={startBackgroundUpdate} color="green" />
      <Button title="Stop" onPress={stopBackgroundUpdate} color="red" />
      {/* <MapView style={styles.map}>
        <Marker
          title="YIKES, Inc."
          description="Web Design and Development"
          coordinate={{ latitude: 39.969183, longitude: -75.133308 }}
        />
      </MapView> */}
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
