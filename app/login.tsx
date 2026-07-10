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
  // Shown inline on the screen itself. We can't rely solely on Alert.alert
  // for feedback: on web it can be silently blocked (e.g. inside a sandboxed
  // preview iframe with no "allow-modals" permission), which made the login
  // button look like it "did nothing" even though it was actually failing.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = trpc.players.login.useQuery(
    { username, password },
    { enabled: false }
  );

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      const msg = "Please enter username and password";
      setErrorMessage(msg);
      Alert.alert(t("error", language), msg);
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
        return;
      }

      // IMPORTANT: react-query's refetch() does NOT throw on failure — it
      // resolves with { data: undefined, error }. Without this check the
      // login button silently did nothing on invalid credentials or a
      // backend/DB error.
      throw result.error ?? new Error(t("invalidCredentials", language));
    } catch (error: any) {
      const message: string = error?.message || "";
      const friendlyMessage = message.includes("Database not available")
        ? language === "en"
          ? "Cannot reach the server database. Make sure DATABASE_URL is set and the server is running (see .env.example)."
          : "Δεν είναι δυνατή η σύνδεση με τη βάση δεδομένων του server. Βεβαιωθείτε ότι έχει οριστεί το DATABASE_URL και ότι ο server τρέχει (δείτε .env.example)."
        : message || t("invalidCredentials", language);
      setErrorMessage(friendlyMessage);
      Alert.alert(t("error", language), friendlyMessage);
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
                autoCapitalize="none"
                autoCorrect={false}
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
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>

          {/* Inline error message (always visible, doesn't depend on Alert) */}
          {errorMessage ? (
            <View className="bg-red-100 border border-red-400 rounded-lg px-4 py-3">
              <Text className="text-red-700 text-sm">{errorMessage}</Text>
            </View>
          ) : null}

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

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
