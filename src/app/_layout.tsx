import { initializeDatabase } from "@/data/local/database/initializeDatabase";
import i18n from "@/i18n";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(
    null,
  );

  const isDark = colorScheme === "dark";
  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: paperTheme.colors.background,
      card: paperTheme.colors.background,
    },
  };

  useEffect(() => {
    async function initialize() {
      try {
        await initializeDatabase();
        setIsDatabaseReady(true);
      } catch (error) {
        setInitializationError(
          error instanceof Error
            ? error
            : new Error("Database initialization failed"),
        );
      }
    }

    initialize();
  }, []);

  if (initializationError) {
    throw initializationError;
  }

  if (!isDatabaseReady) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <PaperProvider theme={paperTheme}>
        <I18nextProvider i18n={i18n}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="trips/new" />
          </Stack>
        </I18nextProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
