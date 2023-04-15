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

import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
// import { PROVIDER_GOOGLE } from "react-native-maps";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

import * as Rest from "../rest/api";
import { A } from '@expo/html-elements';

// let MAPVIEW: MapView | null = null;

export default function Component() {
  const [timeText, setTimeText] = useState("テスト");
  const [comment, setComment] = useState("テスト");
  const [loc, setLoc] = useState<LocationObject | null>(null);

  const [gpsOn, setGpsOn] = useState(false);

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
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
    <A href={linkStr}>
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

      Rest.markerCreate(locToCreate);
      setComment("");
      setLoc(null);
    },
    [loc, comment]
  );


  // const marker = (
  //   <Marker coordinate={{ latitude: 35.645736, longitude: 139.747575 }} />
  // );
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.getInfo]}
          onPress={getInfo}>
          <Text style={styles.text}>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.sendInfo, enabled(!loc)]}
          onPress={sendInfo}>
          <Text style={styles.text}>SEND</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infos}>
        <Text>[{timeText}]</Text>
        {linkToMap}
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

      {/* <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={(map) => {
            MAPVIEW = map;
          }}
        >
          {marker}
        </MapView>   */}
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
  // map: {
  //   flex: 10,
  // },
  buttons: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
  },
  infos: {
    flex: 1,
  },
  inputs: {
    flex: 5,
    margin: 5,
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
  }
});

