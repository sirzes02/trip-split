import { ScreenHeader } from "@/components/ScreenHeader";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripsScreen() {
  return (
    <View>
      <ScreenHeader
        title="Mis viajes"
        showBack={false}
        actionIcon="plus"
        onAction={() => router.push("/trips/new")}
      />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.content}>
        {/* Lista de viajes */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
