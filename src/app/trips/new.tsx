import { dependencies } from "@/di/DependencyContainer";
import {
  ALLOWED_TRIP_TEXT,
  MAX_TRIP_TEXT_LENGTH,
} from "@/domain/errors/RepositoryError";
import type { Trip } from "@/domain/models/Trip";
import { DateField } from "@/presentation/components/DateField";
import { FormTextField } from "@/presentation/components/FormTextField";
import { LoadingOverlay } from "@/presentation/components/LoadingOverlay";
import { ScreenHeader } from "@/presentation/components/ScreenHeader";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";

type CreateTripFieldError =
  | "required"
  | "invalidDates"
  | "textTooLong"
  | "invalidCharacters";

interface CreateTripForm {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

interface CreateTripFormErrors {
  name: CreateTripFieldError | null;
  destination: CreateTripFieldError | null;
  endDate: CreateTripFieldError | null;
}

export default function NewTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [form, setForm] = useState<CreateTripForm>(() => ({
    name: "",
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
  }));
  const [fieldErrors, setFieldErrors] = useState<CreateTripFormErrors>({
    name: "required",
    destination: "required",
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const operationLock = useRef(false);

  useEffect(() => {
    setFieldErrors({
      name: getTextError(form.name),
      destination: getTextError(form.destination),
      endDate: form.endDate >= form.startDate ? null : "invalidDates",
    });
  }, [form]);

  function getTextError(value: string): CreateTripFieldError | null {
    if (!value.trim()) {
      return "required";
    }

    if (Array.from(value).length > MAX_TRIP_TEXT_LENGTH) {
      return "textTooLong";
    }

    if (!ALLOWED_TRIP_TEXT.test(value)) {
      return "invalidCharacters";
    }

    return null;
  }

  async function handleCreateTrip() {
    if (operationLock.current) {
      return;
    }

    operationLock.current = true;
    setIsLoading(true);

    let trip: Trip | null = null;
    try {
      trip = await dependencies.createTrip.execute({
        name: form.name.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      });
    } catch (caughtError) {
      console.error("Failed to create trip.", caughtError);
    } finally {
      operationLock.current = false;
      setIsLoading(false);
    }

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
          value={form.name}
          maxLength={MAX_TRIP_TEXT_LENGTH}
          required
          error={fieldErrors.name ? t(`createTrip.${fieldErrors.name}`) : null}
          onChangeText={(name) => setForm((current) => ({ ...current, name }))}
        />

        <FormTextField
          label={t("createTrip.destination")}
          placeholder={t("createTrip.destinationPlaceholder")}
          value={form.destination}
          maxLength={MAX_TRIP_TEXT_LENGTH}
          required
          error={
            fieldErrors.destination
              ? t(`createTrip.${fieldErrors.destination}`)
              : null
          }
          onChangeText={(destination) =>
            setForm((current) => ({ ...current, destination }))
          }
        />

        <DateField
          label={t("createTrip.startDate")}
          value={form.startDate}
          onChange={(date) =>
            setForm((current) => ({
              ...current,
              startDate: date,
            }))
          }
        />

        <DateField
          label={t("createTrip.endDate")}
          value={form.endDate}
          minimumDate={form.startDate}
          error={
            fieldErrors.endDate ? t(`createTrip.${fieldErrors.endDate}`) : null
          }
          onChange={(endDate) =>
            setForm((current) => ({ ...current, endDate }))
          }
        />

        <Button
          mode="contained"
          onPress={handleCreateTrip}
          disabled={
            isLoading ||
            !Object.values(fieldErrors).every(
              (fieldError) => fieldError === null,
            )
          }
        >
          {isLoading ? t("createTrip.creating") : t("createTrip.create")}
        </Button>
      </ScrollView>

      <LoadingOverlay
        visible={isLoading}
        message={isLoading ? t("loading.creating") : undefined}
      />
    </View>
  );
}
