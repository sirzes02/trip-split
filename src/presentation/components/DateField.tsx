import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, View } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";

interface DateFieldProps {
  label: string;
  value: Date | null;
  minimumDate?: Date;
  required?: boolean;
  error?: string | null;
  onChange: (date: Date) => void;
}

function toCalendarDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function DateField({
  label,
  value,
  minimumDate,
  required = false,
  error,
  onChange,
}: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleValueChange(
    _event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) {
    if (Platform.OS === "android") {
      setIsOpen(false);
    }

    onChange(toCalendarDate(selectedDate));
  }

  const picker = (
    <DateTimePicker
      value={toCalendarDate(value ?? minimumDate ?? new Date())}
      minimumDate={minimumDate ? toCalendarDate(minimumDate) : undefined}
      mode="date"
      display={Platform.OS === "ios" ? "compact" : "default"}
      onValueChange={handleValueChange}
      onDismiss={() => setIsOpen(false)}
    />
  );

  return (
    <View>
      <Text variant="labelLarge">{required ? `${label} *` : label}</Text>

      {Platform.OS === "ios" ? (
        picker
      ) : (
        <>
          <Button
            mode="outlined"
            icon="calendar"
            onPress={() => setIsOpen(true)}
            contentStyle={{ justifyContent: "flex-start" }}
          >
            {value ? value.toLocaleDateString() : "Select date"}
          </Button>
          {isOpen && picker}
        </>
      )}
      {error && (
        <HelperText type="error" visible>
          {error}
        </HelperText>
      )}
    </View>
  );
}
