import { ScreenHeader } from "@/components/ScreenHeader";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripsScreen() {
  const { t } = useTranslation();

  return (
    <View>
      <ScreenHeader
        title={t("navigation.myTrips")}
        showBack={false}
        actionIcon="plus"
        onAction={() => router.push("/trips/new")}
      />

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={styles.content}
      ></SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
