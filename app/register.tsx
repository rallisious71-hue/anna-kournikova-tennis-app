import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.players.register.useMutation();

  const handleRegister = async () => {
    if (!fullName.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(t("error", language), "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t("error", language), t("passwordMismatch", language));
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerMutation.mutateAsync({
        fullName,
        username,
        password,
      });

      Alert.alert(t("success", language), t("registerSuccess", language), [
        {
          text: "OK",
          onPress: () => router.replace("../login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(t("error", language), error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6 justify-center">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl">🎾</Text>
            <Text className="text-3xl font-bold text-foreground">{t("registerTitle", language)}</Text>
            <Text className="text-sm text-muted">{t("registerSubtitle", language)}</Text>
          </View>

          {/* Registration Form */}
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-muted mb-2">{t("fullName", language)}</Text>
              <TextInput
                placeholder={t("fullName", language)}
                placeholderTextColor="#9BA1A6"
                value={fullName}
                onChangeText={setFullName}
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">{t("username", language)}</Text>
              <TextInput
                placeholder={t("username", language)}
                placeholderTextColor="#9BA1A6"
                value={username}
                onChangeText={setUsername}
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">{t("password", language)}</Text>
              <TextInput
                placeholder={t("password", language)}
                placeholderTextColor="#9BA1A6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted mb-2">{t("confirmPassword", language)}</Text>
              <TextInput
                placeholder={t("confirmPassword", language)}
                placeholderTextColor="#9BA1A6"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className="bg-primary rounded-lg py-4 active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-white font-bold text-center text-lg">
              {isLoading ? t("loading", language) : t("register", language)}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-muted">{t("alreadyHaveAccount", language)}</Text>
            <TouchableOpacity onPress={() => router.replace("../login")}>
              <Text className="text-primary font-semibold">{t("login", language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
