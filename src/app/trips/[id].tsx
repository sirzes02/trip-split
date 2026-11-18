import { dependencies } from "@/di/DependencyContainer";
import type { Trip } from "@/domain/models/Trip";
import { LoadingOverlay } from "@/presentation/components/LoadingOverlay";
import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { typography } from "@/theme/typography";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripDetailsScreen() {
  const { t } = useTranslation();
  const { id, name } = useLocalSearchParams<{
    id: string;
    name?: string;
  }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<"loading" | "deleting" | null>(
    "loading",
  );

  const deleteLock = useRef(false);

  const loadTrip = useCallback(async () => {
    setIsLoading("loading");

    try {
      setTrip(await dependencies.getTrip.execute(id));
    } catch (error) {
      console.error("Failed to load trip.", error);
      setTrip(null);
    } finally {
      setIsLoading(null);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadTrip();
    }, [loadTrip]),
  );

  const deleteTrip = () => {
    if (!trip) {
      return;
    }

    Alert.alert(t("trips.deleteTitle"), t("trips.deleteConfirmation"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          if (deleteLock.current) {
            return;
          }

          deleteLock.current = true;
          setIsLoading("deleting");

          try {
            await dependencies.deleteTrip.execute(id);
          } catch (error) {
            console.error("Failed to delete trip.", error);
          } finally {
            deleteLock.current = false;
            setIsLoading(null);
            router.back();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={trip?.name ?? name ?? t("trips.tripDetails")}
        titleVariant="secondary"
        actionIcon={trip ? "trash-can-outline" : undefined}
        onAction={trip ? deleteTrip : undefined}
      />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {trip ? (
            <>
              <Text variant="titleMedium">{t("createTrip.destination")}</Text>
              <Text variant="bodyLarge" style={styles.value}>
                {trip.destination}
              </Text>

              <Text variant="titleMedium">{t("createTrip.startDate")}</Text>
              <Text variant="bodyLarge" style={styles.value}>
                {trip.startDate.toLocaleDateString()}
              </Text>

              <Text variant="titleMedium">{t("createTrip.endDate")}</Text>
              <Text variant="bodyLarge" style={styles.value}>
                {trip.endDate.toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text variant="bodyMedium">{t("trips.tripNotFound")}</Text>
          )}
        </ScrollView>
      </SafeAreaView>

      <LoadingOverlay
        visible={isLoading != null}
        message={
          isLoading === "deleting"
            ? t("loading.deleting")
            : isLoading
              ? t("loading.loading")
              : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  value: {
    marginBottom: 16,
    fontSize: typography.fontSizes.body,
  },
});
