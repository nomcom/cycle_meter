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

const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";
let LOC_CALLBACK_ASYNC: ((location: LocationObject) => Promise<void>) | null =
  null;
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
      if (LOC_CALLBACK_ASYNC) {
        await LOC_CALLBACK_ASYNC(location);
      }
    }
  }
});

// Component
export default function Component() {
  const [text, setText] = useState("");
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

  LOC_CALLBACK_ASYNC = React.useCallback(
    async (location: LocationObject) => {
      setCurPos(location);
      setText(
        text +
          `[${new Date().toISOString()}]LOCATION(${location.coords.latitude}, ${
            location.coords.longitude
          })<br>`
      );

      // REST通信
      if (saveMarker) {
        // 型の差異(null -> undefined)を吸収する
        const coords = location.coords as any;
        const nullToUndef: Rest.MarkerCreateBody = {
          timestamp: location.timestamp,
        };
        Object.keys(coords).forEach((key) => {
          (nullToUndef as any)[key] =
            coords[key] == null ? undefined : coords[key];
        });
        try {
          const resp = await Rest.markerCreate(nullToUndef);
          console.info(
            `ID:${resp.data.name} created by ${JSON.stringify(nullToUndef)}`
          );
        } catch (e) {
          console.error("Rest Error", e);
        }
      }

      if (followMarker) {
        MAPVIEW?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    },
    [followMarker, text]
  );

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      setText(
        text + `[${new Date().toISOString()}]location tracking denied<br>`
      );
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      setText(text + `[${new Date().toISOString()}]Task is not defined<br>`);
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      setText(
        text + `[${new Date().toISOString()}]Already started, going to stop<br>`
      );
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }

    setGpsOn(true);

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "GPS_Logger",
        notificationBody: "バックグラウンドでGPS取得中",
        notificationColor: "#fff",
        // Boolean value whether to destroy the foreground service if the app is killed.
        // killServiceOnDestroy: true,
      },
      // The distance in meters that must occur
      // between last reported location and the current location
      // before deferred locations are reported.
      deferredUpdatesDistance: 100,
      // Minimum time interval in milliseconds
      // that must pass since last reported location before all later locations are reported in a batched update
      // deferredUpdatesInterval: 5000,
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    setGpsOn(false);

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setText(
        text + `[${new Date().toISOString()}]Location tracking stopped<br>`
      );
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

        <View style={styles.checks}>
          <BouncyCheckbox
            size={20}
            fillColor="green"
            style={[styles.buttonBase]}
            onPress={() => setSaveMarker(!saveMarker)}
            disableBuiltInState
            isChecked={saveMarker}
          />

          <BouncyCheckbox
            size={20}
            fillColor="blue"
            style={[styles.buttonBase]}
            onPress={() => setFollowMarker(!followMarker)}
            disableBuiltInState
            isChecked={followMarker}
          />
        </View>
      </View>

      {/* <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={(map) => {
          MAPVIEW = map;
        }}
      >
        {marker}
      </MapView> */}
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
