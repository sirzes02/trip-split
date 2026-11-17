import { dependencies } from "@/di/DependencyContainer";
import type { Trip } from "@/domain/models/Trip";
import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Icon, List, Text } from "react-native-paper";
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
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <Text variant="bodyMedium" style={styles.status}>
              {t("trips.empty")}
            </Text>
          }
          renderItem={({ item }) => (
            <List.Item
              title={`${item.destination} - ${item.name}`}
              description={
                <View style={styles.listTitle}>
                  <Icon size={20} source={"calendar-account-outline"} />
                  <Text style={styles.listDates}>
                    {item.startDate.toLocaleDateString()} –{" "}
                    {item.endDate.toLocaleDateString()}
                  </Text>
                </View>
              }
              left={(props) => (
                <List.Icon
                  {...props}
                  style={styles.listIconLeft}
                  icon="map-marker-outline"
                  color={colors.accent}
                />
              )}
              right={(props) => (
                <>
                  <View style={styles.listMoneyView}>
                    <Text style={styles.listMoneyText}>$300.000</Text>
                    <Text style={styles.listMoneyDescription}>Por recibir</Text>
                  </View>
                  <List.Icon
                    {...props}
                    style={styles.listIconRight}
                    icon="chevron-right"
                  />
                </>
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
  listTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  listDates: {
    fontSize: typography.fontSizes.caption,
    marginLeft: 3,
  },
  listIconLeft: {
    alignSelf: "center",
  },
  listMoneyView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.successBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 0,
  },
  listMoneyText: {
    fontSize: typography.fontSizes.amount,
    fontWeight: typography.fontWeights.medium,
  },
  listMoneyDescription: {
    fontSize: typography.fontSizes.caption,
    color: colors.success,
  },
  listIconRight: {
    margin: 0,
  },
});
