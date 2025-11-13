import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, Text, StyleSheet, Linking } from "react-native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import { store, persistor } from "./src/store";
import { useAuth } from "./src/hooks/useAuth";
import { supabase } from "./src/config/supabase";
import colors from "./src/constants/colors";

const RootNavigation = () => {
  const { user, session, initialized } = useAuth();
  const navigationRef = useRef<any>(null);

  console.log("🔍 RootNavigation - Auth state:", {
    user: !!user,
    session: !!session,
    initialized,
    isAuthenticated: !!(user && session),
  });

  // Handle deep links for password reset
  useEffect(() => {
    // Handle initial URL (when app is opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Handle Supabase auth state changes (for password reset)
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        // Navigate to reset password screen
        if (navigationRef.current) {
          navigationRef.current.navigate('ResetPassword', {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            type: 'recovery',
          });
        }
      }
    });

    return () => {
      subscription.remove();
      authSubscription.unsubscribe();
    };
  }, []);

  const handleDeepLink = (url: string) => {
    console.log('🔗 Deep link received:', url);
    
    // Parse the URL
    if (url.startsWith('harakapay://reset-password') || url.includes('reset-password')) {
      // Extract tokens from URL if present
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let type: string | null = null;

      // Parse query parameters manually (URL constructor may not work in React Native)
      const parts = url.split('?');
      if (parts.length > 1) {
        const params = parts[1].split('&');
        params.forEach((param) => {
          const [key, value] = param.split('=');
          if (key === 'access_token') accessToken = decodeURIComponent(value);
          if (key === 'refresh_token') refreshToken = decodeURIComponent(value);
          if (key === 'type') type = decodeURIComponent(value);
        });
      }

      // Navigate to reset password screen
      if (navigationRef.current) {
        navigationRef.current.navigate('ResetPassword', {
          access_token: accessToken,
          refresh_token: refreshToken,
          type: type || 'recovery',
        });
      }
    }
  };

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

  // Configure linking for deep links
  const linking = {
    prefixes: ['harakapay://'],
    config: {
      screens: {
        ResetPassword: {
          path: 'reset-password',
          parse: {
            access_token: (access_token: string) => access_token,
            refresh_token: (refresh_token: string) => refresh_token,
            type: (type: string) => type,
          },
        },
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
