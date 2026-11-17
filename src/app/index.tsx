import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { useTripsViewModel } from "@/presentation/viewModels/useTripsViewModel";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, HelperText, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripsScreen() {
  const { t } = useTranslation();
  const { trips, isLoading, isRefreshing, hasLoadError, refreshTrips } =
    useTripsViewModel();

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
              refreshing={isRefreshing}
              onRefresh={refreshTrips}
            />
          }
          contentContainerStyle={
            trips.length === 0 ? styles.emptyList : undefined
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator color="#A78BFA" />
            ) : hasLoadError ? (
              <HelperText type="error" visible style={styles.status}>
                {t("trips.loadError")}
              </HelperText>
            ) : (
              <Text variant="bodyMedium" style={styles.status}>
                {t("trips.empty")}
              </Text>
            )
          }
          ListHeaderComponent={
            hasLoadError && trips.length > 0 ? (
              <HelperText type="error" visible>
                {t("trips.loadError")}
              </HelperText>
            ) : undefined
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`${item.destination} · ${item.startDate.toLocaleDateString()} – ${item.endDate.toLocaleDateString()}`}
              left={(props) => (
                <List.Icon {...props} icon="map-marker-outline" />
              )}
              style={styles.listItem}
            />
          )}
          style={styles.list}
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
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  status: {
    marginTop: 24,
  },
});
