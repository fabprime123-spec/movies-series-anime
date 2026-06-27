const appJson = require("./app.json")

module.exports = {
  expo: {
    ...appJson.expo,
    scheme: "fabprime",
    ios: {
      ...appJson.expo.ios,
      bundleIdentifier: "com.fabprime.moviesseries",
    },
    android: {
      ...appJson.expo.android,
    },
    plugins: [
      "expo-font",
    ],
  },
}