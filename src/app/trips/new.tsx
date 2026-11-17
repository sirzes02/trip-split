import { MAX_TRIP_TEXT_LENGTH } from "@/domain/validation/tripFieldValidation";
import { DateField } from "@/presentation/components/DateField";
import { FormTextField } from "@/presentation/components/FormTextField";
import { LoadingOverlay } from "@/presentation/components/LoadingOverlay";
import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { useCreateTripViewModel } from "@/presentation/viewModels/useCreateTripViewModel";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, HelperText } from "react-native-paper";

export default function NewTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const viewModel = useCreateTripViewModel();

  function handleStartDateChange(date: Date) {
    viewModel.setStartDate(date);

    if (viewModel.endDate < date) {
      viewModel.setEndDate(date);
    }
  }

  async function handleCreateTrip() {
    const trip = await viewModel.createTrip();

    if (trip) {
      router.back();
    }
  }

  return (
    <View>
      <ScreenHeader title={t("trips.newTrip")} titleVariant="secondary" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <FormTextField
          label={t("createTrip.name")}
          placeholder={t("createTrip.namePlaceholder")}
          value={viewModel.name}
          maxLength={MAX_TRIP_TEXT_LENGTH}
          required
          error={
            viewModel.nameError ? t(`createTrip.${viewModel.nameError}`) : null
          }
          onChangeText={viewModel.setName}
        />

        <FormTextField
          label={t("createTrip.destination")}
          placeholder={t("createTrip.destinationPlaceholder")}
          value={viewModel.destination}
          maxLength={MAX_TRIP_TEXT_LENGTH}
          required
          error={
            viewModel.destinationError
              ? t(`createTrip.${viewModel.destinationError}`)
              : null
          }
          onChangeText={viewModel.setDestination}
        />

        <DateField
          label={t("createTrip.startDate")}
          value={viewModel.startDate}
          onChange={handleStartDateChange}
        />

        <DateField
          label={t("createTrip.endDate")}
          value={viewModel.endDate}
          minimumDate={viewModel.startDate}
          error={
            viewModel.endDateError
              ? t(`createTrip.${viewModel.endDateError}`)
              : null
          }
          onChange={viewModel.setEndDate}
        />

        {viewModel.error && (
          <HelperText type="error" visible>
            {t(`createTrip.${viewModel.error}`)}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleCreateTrip}
          disabled={viewModel.isLoading}
        >
          {viewModel.isLoading
            ? t("createTrip.creating")
            : t("createTrip.create")}
        </Button>
      </ScrollView>

      <LoadingOverlay
        visible={viewModel.isLoading}
        message={
          viewModel.loadingOperation
            ? t(`loading.${viewModel.loadingOperation}`)
            : undefined
        }
      />
    </View>
  );
}
