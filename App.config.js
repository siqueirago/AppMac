
require('dotenv').config();

export default ({ config }) => {
  console.log("No app.config.js, process.env.GOOGLE_APPS_SCRIPT_URL é:", process.env.GOOGLE_APPS_SCRIPT_URL);
  return {

    name: "Gerenciamento Escolar",
    slug: "app-gerenciamento-escolar",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },

    extra: {
      googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL,
    },
  };
};
