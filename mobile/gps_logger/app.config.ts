module.exports = {
  expo: {
    name: "gps_logger",
    slug: "gps_logger",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_BACKGROUND_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
      ],
      package: "com.nomurast.myapptemp",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLEMAP_ANDROID_API_KEY,
        },
      },
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "5fa0eab4-ce91-4018-8a35-8bc4c68ecda1",
      },
    },
  },
};
