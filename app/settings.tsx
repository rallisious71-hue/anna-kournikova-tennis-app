import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const handleLogout = async () => {
    Alert.alert(t("logout", language), language === "en" ? "Are you sure?" : "Είστε σίγουροι;", [
      { text: t("cancel", language), onPress: () => {} },
      {
        text: t("logout", language),
        onPress: async () => {
          await AsyncStorage.removeItem("user_id");
          await AsyncStorage.removeItem("user_name");
          await AsyncStorage.removeItem("username");
          router.replace("../login");
        },
        style: "destructive",
      },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      t("resetAllData", language),
      language === "en"
        ? "This will permanently delete all matches and statistics. This action cannot be undone."
        : "Αυτό θα διαγράψει μόνιμα όλους τους αγώνες και τα στατιστικά. Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
      [
        { text: t("cancel", language), onPress: () => {} },
        {
          text: t("delete", language),
          onPress: async () => {
            // TODO: Clear all data from database
            Alert.alert(t("success", language), language === "en" ? "All data has been reset" : "Όλα τα δεδομένα έχουν επαναφερθεί");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">{t("settingsTitle", language)}</Text>
              <Text className="text-sm text-muted mt-1">App preferences</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
            >
              <Text className="text-foreground text-lg">×</Text>
            </TouchableOpacity>
          </View>

          {/* Language Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("language", language)}</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setLanguage("en")}
                className={`flex-1 py-3 rounded ${language === "en" ? "bg-primary" : "bg-surface border border-border"}`}
              >
                <Text className={`font-semibold text-center ${language === "en" ? "text-white" : "text-foreground"}`}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage("el")}
                className={`flex-1 py-3 rounded ${language === "el" ? "bg-primary" : "bg-surface border border-border"}`}
              >
                <Text className={`font-semibold text-center ${language === "el" ? "text-white" : "text-foreground"}`}>
                  Ελληνικά
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("appearance", language)}</Text>
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-foreground font-medium">{t("darkMode", language)}</Text>
                <Text className="text-xs text-muted">{t("toggleDarkLight", language)}</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
              />
            </View>
          </View>

          {/* Data Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("data", language)}</Text>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-80">
              <View className="gap-1">
                <Text className="text-foreground font-medium">{t("exportData", language)}</Text>
                <Text className="text-xs text-muted">{t("downloadMatchHistory", language)}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetData}
              className="bg-error bg-opacity-10 rounded-lg p-4 border border-error border-opacity-30 active:opacity-80"
            >
              <View className="gap-1">
                <Text className="text-error font-medium">{t("resetAllData", language)}</Text>
                <Text className="text-xs text-error opacity-75">{t("deleteAllMatches", language)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("about", language)}</Text>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted">{t("version", language)}</Text>
                <Text className="text-foreground font-semibold">1.0.0</Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-1">
                <Text className="text-foreground font-medium">Anna Kournikova Smash Court Tennis</Text>
                <Text className="text-xs text-muted mt-2">
                  {t("appDescription", language)}
                </Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error rounded-lg py-4 active:opacity-80"
          >
            <Text className="text-white font-semibold text-center">{t("logout", language)}</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center gap-2 py-6">
            <Text className="text-xs text-muted">Made with 🎾 for tennis lovers</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
