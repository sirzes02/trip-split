import { dependencies } from "@/di/DependencyContainer";
import type { Trip } from "@/domain/models/Trip";
import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripsScreen() {
  const { t } = useTranslation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);

    try {
      const loadedTrips = await dependencies.getTrips.execute();
      setTrips(loadedTrips);
    } catch (error) {
      console.error("Failed to load trips from the local database.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTrips();

      return () => {
        setIsLoading(false);
      };
    }, [loadTrips]),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("navigation.myTrips")}
        showBack={false}
        actionIcon="plus"
        onAction={() => router.push("/trips/new")}
      />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.content}>
        <FlatList
          data={trips}
          keyExtractor={(trip) => trip.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadTrips}
              tintColor="#A78BFA"
            />
          }
          ListEmptyComponent={
            <Text variant="bodyMedium" style={styles.status}>
              {t("trips.empty")}
            </Text>
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`${item.destination} · ${item.startDate.toLocaleDateString()} – ${item.endDate.toLocaleDateString()}`}
              left={(props) => (
                <List.Icon {...props} icon="map-marker-outline" />
              )}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  status: {
    marginTop: 24,
  },
});
