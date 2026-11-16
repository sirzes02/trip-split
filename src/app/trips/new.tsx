import { ScreenHeader } from "@/components/ScreenHeader";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTripScreen() {
  return (
    <View>
      <ScreenHeader title="Nuevo viaje" titleVariant="secondary" />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.content}>
        {/* Formulario de nuevo viaje */}
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
