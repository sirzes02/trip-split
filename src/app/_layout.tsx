import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

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
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="trips/new" />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}
