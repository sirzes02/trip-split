import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

interface ScreenHeaderProps {
  title: string;
  titleVariant?: "main" | "secondary";
  showBack?: boolean;
  actionIcon?: string;
  onAction?: () => void;
}

export function ScreenHeader({
  title,
  titleVariant = "main",
  showBack = true,
  actionIcon,
  onAction,
}: ScreenHeaderProps) {
  const isSecondaryTitle = titleVariant === "secondary";
  const titleTextStyle = isSecondaryTitle
    ? styles.titleSecondary
    : styles.titleMain;

  return (
    <Appbar.Header mode={isSecondaryTitle ? "center-aligned" : "small"}>
      {showBack && <Appbar.BackAction onPress={() => router.back()} />}
      <Appbar.Content title={title} titleStyle={titleTextStyle} />
      {actionIcon && onAction && (
        <Appbar.Action icon={actionIcon} onPress={onAction} />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  titleMain: {
    fontSize: 26,
    fontWeight: "700",
  },
  titleSecondary: {
    fontSize: 22,
    fontWeight: "400",
  },
});
