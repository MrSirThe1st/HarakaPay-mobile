import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import { store, persistor } from "./src/store";
import { useAuth } from "./src/hooks/useAuth";
import colors from "./src/constants/colors";

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background, // Very dark blue
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary, // Light gray-blue
  },
});
