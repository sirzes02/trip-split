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
          <ActivityIndicator size="large" color="#A78BFA" />
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
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    shadowColor: "#000",
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
    color: "#2C2F36",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
