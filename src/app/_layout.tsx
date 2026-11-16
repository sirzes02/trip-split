import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import i18n from "@/components/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
