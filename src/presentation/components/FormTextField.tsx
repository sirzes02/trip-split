import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

interface FormTextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  maxLength: number;
  required?: boolean;
  error?: string | null;
  onChangeText: (value: string) => void;
}

export function FormTextField({
  label,
  placeholder,
  value,
  maxLength,
  required = false,
  error,
  onChangeText,
}: FormTextFieldProps) {
  return (
    <View>
      <TextInput
        mode="outlined"
        label={required ? `${label} *` : label}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        error={Boolean(error)}
        onChangeText={onChangeText}
      />
      {error && (
        <HelperText type="error" visible>
          {error}
        </HelperText>
      )}
    </View>
  );
}
