import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface DurationInputProps {
  totalSeconds: number;
  onChange: (totalSeconds: number) => void;
  labelHours?: string;
  labelMinutes?: string;
  labelSeconds?: string;
}

function toParts(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  return {
    h: Math.floor(safe / 3600),
    m: Math.floor((safe % 3600) / 60),
    s: safe % 60,
  };
}

function clamp(raw: string, max: number) {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  if (digitsOnly === "") return 0;
  return Math.max(0, Math.min(max, parseInt(digitsOnly, 10)));
}

/**
 * Lets the user type a match duration directly as hours / minutes / seconds,
 * instead of relying only on a running stopwatch.
 */
export function DurationInput({
  totalSeconds,
  onChange,
  labelHours = "ώρες",
  labelMinutes = "λεπτά",
  labelSeconds = "δευτ.",
}: DurationInputProps) {
  const initial = toParts(totalSeconds);
  const [h, setH] = useState(String(initial.h));
  const [m, setM] = useState(String(initial.m));
  const [s, setS] = useState(String(initial.s));

  useEffect(() => {
    const p = toParts(totalSeconds);
    setH(String(p.h));
    setM(String(p.m));
    setS(String(p.s));
  }, [totalSeconds]);

  const commitAll = (hh: number, mm: number, ss: number) => {
    onChange(hh * 3600 + mm * 60 + ss);
  };

  const fieldClass =
    "bg-surface border border-border rounded-lg text-foreground text-2xl font-bold w-full py-2";

  return (
    <View className="flex-row gap-2 items-end">
      <View className="flex-1 items-center">
        <TextInput
          value={h}
          onChangeText={setH}
          onEndEditing={() => {
            const val = clamp(h, 99);
            setH(String(val));
            commitAll(val, clamp(m, 59), clamp(s, 59));
          }}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          textAlign="center"
          className={fieldClass}
        />
        <Text className="text-xs text-muted mt-1">{labelHours}</Text>
      </View>
      <Text className="text-2xl font-bold text-foreground pb-6">:</Text>
      <View className="flex-1 items-center">
        <TextInput
          value={m}
          onChangeText={setM}
          onEndEditing={() => {
            const val = clamp(m, 59);
            setM(String(val));
            commitAll(clamp(h, 99), val, clamp(s, 59));
          }}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          textAlign="center"
          className={fieldClass}
        />
        <Text className="text-xs text-muted mt-1">{labelMinutes}</Text>
      </View>
      <Text className="text-2xl font-bold text-foreground pb-6">:</Text>
      <View className="flex-1 items-center">
        <TextInput
          value={s}
          onChangeText={setS}
          onEndEditing={() => {
            const val = clamp(s, 59);
            setS(String(val));
            commitAll(clamp(h, 99), clamp(m, 59), val);
          }}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          textAlign="center"
          className={fieldClass}
        />
        <Text className="text-xs text-muted mt-1">{labelSeconds}</Text>
      </View>
    </View>
  );
}
