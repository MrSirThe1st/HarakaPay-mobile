import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, Text } from "react-native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import { store, persistor } from "./src/store";
import { useAuth } from "./src/hooks/useAuth";

const RootNavigation = () => {
  const { user, session, initialized } = useAuth();

  console.log("🔍 RootNavigation - Auth state:", {
    user: !!user,
    session: !!session,
    initialized,
    isAuthenticated: !!(user && session),
  });

  // Show loading while auth is initializing
  if (!initialized) {
    console.log("⏳ Auth not initialized yet, showing loading...");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isAuthenticated = !!user && !!session;
  console.log("🎯 Navigation decision:", isAuthenticated ? "Main App" : "Auth");

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
                Loading app...
              </Text>
            </View>
          }
          persistor={persistor}
        >
          <RootNavigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
