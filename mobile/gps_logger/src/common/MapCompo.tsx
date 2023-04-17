import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { WebView } from 'react-native-webview';

import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
// import * as TaskManager from "expo-task-manager";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

import * as Rest from "../rest/api";
import { A } from "@expo/html-elements";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// let MAPVIEW: MapView | null = null;

export default function Component() {
  const [timeText, setTimeText] = useState("テスト");
  const [logText, setLogText] = useState(axios.defaults.baseURL);
  const [comment, setComment] = useState("");
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cameraStatus, requestCameraPermissions] =
    ImagePicker.useCameraPermissions();

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      // Location
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();

      // Camera
      if (!cameraStatus?.granted) requestCameraPermissions();
    };
    requestPermissions();

    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const url = `${config.baseURL}${config.url}`;
      setLogText(
        `REQ:Method=${config.method} Url=${url} Body=${JSON.stringify(
          config.data
        )}`
      );
      return config;
    });
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        const status = response.status;
        setLogText(`RES:Method=Success: Status=${status}`);
        return response;
      },
      (error: AxiosError) => {
        const status = error.response!.status;
        setLogText(`RES:Error: Status=${status}`);
      }
    );
  }, []);

  const getInfo = React.useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({});
    setTimeText(new Date(location.timestamp).toISOString());
    setLoc(location);
  }, []);

  const linkStr = `https://www.google.com/maps/search/?api=1&query=${loc?.coords.latitude}%2C${loc?.coords.longitude}`;
  const linkToMap = (
    <A
      href={linkStr}
      style={{
        borderWidth: 1,
        borderColor: "black",
      }}
    >
      <Text>[{timeText}]</Text>
      LAT:{loc?.coords.latitude}, LON:{loc?.coords.longitude} (alt:
      {loc?.coords.altitude})
    </A>
  );

  const sendInfo = React.useCallback(async () => {
    if (!loc) {
      return;
    }
    // 型の差異(null -> undefined)を吸収する
    const coords = loc.coords as any;
    const locToCreate: Rest.MarkerCreateBody = {
      timestamp: loc.timestamp,
    };
    Object.keys(coords).forEach((key) => {
      (locToCreate as any)[key] = coords[key] == null ? undefined : coords[key];
    });
    if (comment) {
      locToCreate.comment = {
        comment,
      };
    }

    const res = await Rest.markerCreate(locToCreate);
    setComment("");
    setLoc(null);
    setImage(null);
  }, [loc, comment]);

  const getPict = React.useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.assets[0].uri;
    let filename = localUri.split("/").pop()!;

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    setImage(result.assets[0].uri);
  }, []);

  const marker = loc ? <Marker coordinate={loc?.coords!} /> : <></>;

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.getInfo]}
          onPress={getInfo}
        >
          <Text style={styles.text}>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.sendInfo]}
          onPress={sendInfo}
        >
          <Text style={styles.text}>SEND</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.getPict]}
          onPress={getPict}
        >
          <Text style={styles.text}>PICT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infos}>
        {linkToMap}
        <Image
          source={{ uri: image ? image : undefined }}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.log}>{logText}</Text>
      </View>

      <View style={styles.inputs}>
        <TextInput
          placeholder="コメント"
          multiline={true}
          style={[styles.textArea]}
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE}>
          {marker}
        </MapView>
        {/* <WebView
          style={styles.infos}
          source={{ uri: linkStr }}
        /> */}
      </View>
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
    padding: 5
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
  },
  infos: {
    flex: 1,
  },
  inputs: {
    flex: 3,
    margin: 3,
  },
  mapContainer: {
    backgroundColor: "gray",
    flex: 7,
    margin: -5
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonBase: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  getInfo: {
    flex: 3,
    backgroundColor: "green",
  },
  sendInfo: {
    flex: 3,
    backgroundColor: "blue",
  },
  getPict: {
    flex: 3,
    backgroundColor: "red",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  textArea: {
    flex: 1,
    borderWidth:1,
    borderColor: "black"
  },
  log: {
    color: "gray",
    fontSize: 5,
  }
});

