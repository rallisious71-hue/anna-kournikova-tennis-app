import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface ScoreInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  /** Tailwind text color className applied to both the number and label, e.g. "text-primary" */
  colorClassName: string;
  max?: number;
}

/**
 * A tappable, typeable score box. Shows large centered number that the user
 * can tap and type directly (in addition to any +/- buttons elsewhere).
 */
export function ScoreInput({ value, onChange, label, colorClassName, max = 99 }: ScoreInputProps) {
  const [text, setText] = useState(String(value));

  // Keep local text in sync when the value changes from outside (e.g. +/- buttons, reset)
  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    const parsed = digitsOnly === "" ? 0 : Math.max(0, Math.min(max, parseInt(digitsOnly, 10)));
    setText(String(parsed));
    onChange(parsed);
  };

  return (
    <View className="flex-1 bg-white rounded-lg p-4 items-center">
      <TextInput
        value={text}
        onChangeText={setText}
        onEndEditing={(e) => commit(e.nativeEvent.text)}
        onBlur={() => commit(text)}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={2}
        textAlign="center"
        className={`text-5xl font-bold ${colorClassName} w-full`}
      />
      <Text className={`text-sm font-bold ${colorClassName} mt-1`}>{label}</Text>
    </View>
  );
}
