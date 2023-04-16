import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
// import MapView, { Marker } from "react-native-maps";
import { WebView } from 'react-native-webview';

import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
// import { PROVIDER_GOOGLE } from "react-native-maps";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

import * as Rest from "../rest/api";
import { A } from '@expo/html-elements';

import axios, { AxiosError,  AxiosResponse, InternalAxiosRequestConfig } from "axios";

// let MAPVIEW: MapView | null = null;

export default function Component() {
  const [timeText, setTimeText] = useState("テスト");
  const [logText, setLogText] = useState(axios.defaults.baseURL);
  const [comment, setComment] = useState("");
  const [loc, setLoc] = useState<LocationObject | null>(null);

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();

    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const url = `${config.baseURL}${config.url}`;
        setLogText(`REQ:Method=${config.method} Url=${url} Body=${JSON.stringify(config.data)}`);
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

  const getInfo = React.useCallback(
    async () => {
      let location = await Location.getCurrentPositionAsync({});
      setTimeText(new Date(location.timestamp).toISOString());
      setLoc(location);
    },
    []
  );

  const linkStr = `https://www.google.com/maps/search/?api=1&query=${loc?.coords.latitude}%2C${loc?.coords.longitude}`;
  const linkToMap = (
    <A href={linkStr} style={{
      borderWidth:1,
      borderColor: "black"
      }}>
      <Text>[{timeText}]</Text>
      LAT:{loc?.coords.latitude}, LON:{loc?.coords.longitude} (alt:{loc?.coords.altitude})
    </A>
  );

  const sendInfo = React.useCallback(
    async () => {
      if(!loc){
        return;
      }
      // 型の差異(null -> undefined)を吸収する
      const coords = loc.coords as any;
      const locToCreate: Rest.MarkerCreateBody = {
        timestamp: loc.timestamp,
      };
      Object.keys(coords).forEach((key) => {
        (locToCreate as any)[key] =
          coords[key] == null ? undefined : coords[key];
      });
      if(comment){
        locToCreate.comment = {
          comment
        }
      }

      const res = await Rest.markerCreate(locToCreate);
      setComment("");
      setLoc(null);
    },
    [loc, comment]
  );


  // const marker = loc ? (
  //   <Marker coordinate={loc?.coords!} />
  // ) : <></>;

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.getInfo]}
          onPress={getInfo}>
          <Text style={styles.text}>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.sendInfo]}
          onPress={sendInfo}>
          <Text style={styles.text}>SEND</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infos}>
        {linkToMap}
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

      <View style={styles.map}>
        {/* <MapView
          provider={PROVIDER_GOOGLE}
        >
          {marker}
        </MapView>   */}
        <WebView
          style={styles.infos}
          source={{ uri: linkStr }}
        />
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
  map: {
    backgroundColor: "gray",
    flex: 7,
    margin: -5
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

