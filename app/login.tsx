import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.players.login.useQuery(
    { username, password },
    { enabled: false }
  );

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(t("error", language), "Please enter username and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.refetch();
      if (result.data) {
        // Save user data including role
        await AsyncStorage.setItem("user_id", result.data.id.toString());
        await AsyncStorage.setItem("user_name", result.data.name);
        await AsyncStorage.setItem("username", result.data.username);
        await AsyncStorage.setItem("user_role", result.data.role || "user");
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert(t("error", language), error.message || t("invalidCredentials", language));
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
            <Text className="text-3xl font-bold text-foreground">{t("loginTitle", language)}</Text>
            <Text className="text-sm text-muted">{t("loginSubtitle", language)}</Text>
          </View>

          {/* Login Form */}
          <View className="gap-4">
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
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary rounded-lg py-4 active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-white font-bold text-center text-lg">
              {isLoading ? t("loading", language) : t("login", language)}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-muted">{t("dontHaveAccount", language)}</Text>
            <TouchableOpacity onPress={() => router.push("../register")}>
              <Text className="text-primary font-semibold">{t("register", language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
