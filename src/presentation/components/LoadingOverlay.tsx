import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        dismissableBackButton={false}
        style={styles.modal}
        contentContainerStyle={styles.content}
      >
        <View style={styles.innerContent}>
          <ActivityIndicator size="large" color={colors.accent} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 220,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 24,
    backgroundColor: colors.loadingSurface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  innerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  message: {
    color: colors.loadingText,
    fontSize: typography.fontSizes.body,
    fontWeight: typography.fontWeights.medium,
    textAlign: "center",
  },
});
