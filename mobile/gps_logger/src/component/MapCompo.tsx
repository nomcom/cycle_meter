import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { WebView } from 'react-native-webview';

import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
// import * as TaskManager from "expo-task-manager";
// import BouncyCheckbox from "react-native-bouncy-checkbox";

import * as Rest from "../common/rest/api";
import { A } from "@expo/html-elements";

import { storage } from "../../firebaseConfig";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ref, uploadBytes } from "firebase/storage";

export default function Component() {
  const [timeText, setTimeText] = useState("テスト");
  const [logText, setLogText] = useState(axios.defaults.baseURL);
  const [comment, setComment] = useState("");
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [imageDataUrl, setImage] = useState<string | null>(null);
  const [cameraStatus, requestCameraPermissions] =
    ImagePicker.useCameraPermissions();

  // ************* 初期化処理 *************
  useEffect(() => {
    // Request permissions right after starting the app
    const requestPermissions = async () => {
      // Location
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();

      // Camera
      if (!cameraStatus?.granted) requestCameraPermissions();
    };
    requestPermissions();

    // REST通信ログ出力
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

  // ************* イベント関係 *************
  // 情報取得
  const getInfo = React.useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({});
    setTimeText(new Date(location.timestamp).toISOString());
    setLoc(location);
  }, []);

  // 情報送信
  const sendInfo = React.useCallback(async () => {
    if (!loc) {
      return;
    }

    // 送信用データの基本を生成
    // 型の差異(null -> undefined)を吸収する
    const coords = loc.coords as any;
    const locToCreate: Rest.MarkerCreateBody = {
      timestamp: loc.timestamp,
    };
    Object.keys(coords).forEach((key) => {
      (locToCreate as any)[key] = coords[key] == null ? undefined : coords[key];
    });

    // 送信用画像がある場合
    if (imageDataUrl) {
      // Firebase Strogeに保存
      const blob = await fetch(imageDataUrl).then((r) => r.blob());
      const imageUrl = `marker/${loc.timestamp}`;
      const storageRef = ref(storage, imageUrl);
      console.log(`@@@TRY UPLOAD:${imageUrl}`);
      const snapshot = await uploadBytes(storageRef, blob);
      console.log(`IMAGE UPLOADED:${JSON.stringify(snapshot)}`);

      // Firebase StrogeのURLをIDとして送信
      locToCreate.imageId = imageUrl as any;
    }

    // 送信用コメントがある場合
    if (comment) {
      locToCreate.comment = {
        comment,
      };
    }

    // 送信
    const res = await Rest.markerCreate(locToCreate);

    // 送信用データをクリア
    setComment("");
    setLoc(null);
    setImage(null);
  }, [loc, comment]);

  // 画像取得
  const getPict = React.useCallback(async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // aspect: [4, 3],
      exif: true,
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

  // ************* 画面要素関係 *************
  // Google Map Web画面用リンクテキスト
  const linkStr = `https://www.google.com/maps/search/?api=1&query=${loc?.coords.latitude}%2C${loc?.coords.longitude}`;
  // 最新取得情報
  const newestInfo = (
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

  // Google Map Marker
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
        {newestInfo}
        <Image
          source={{ uri: imageDataUrl ? imageDataUrl : undefined }}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 5,
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
    margin: -5,
  },
  map: {
    width: "100%",
    height: "100%",
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
    borderWidth: 1,
    borderColor: "black",
  },
  log: {
    color: "gray",
    fontSize: 5,
  },
});
