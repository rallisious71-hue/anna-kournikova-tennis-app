import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem("user_name");
      setUserName(name);
    };
    loadUserName();
  }, []);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-8">
          {/* Language Toggle */}
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={() => setLanguage("en")}
              className={`px-3 py-1 rounded ${language === "en" ? "bg-primary" : "bg-surface border border-border"}`}
            >
              <Text className={language === "en" ? "text-white font-semibold" : "text-foreground"}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage("el")}
              className={`px-3 py-1 rounded ${language === "el" ? "bg-primary" : "bg-surface border border-border"}`}
            >
              <Text className={language === "el" ? "text-white font-semibold" : "text-foreground"}>
                EL
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View className="items-center gap-4">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Text className="text-4xl">🎾</Text>
            </View>
            <Text className="text-4xl font-bold text-foreground text-center">
              {t("welcomeTitle", language)}
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              {t("welcomeSubtitle", language)}
            </Text>
            {userName && (
              <Text className="text-sm text-primary font-semibold mt-2">
                {language === "en" ? "Welcome" : "Καλώς ήρθατε"}, {userName}!
              </Text>
            )}
          </View>

          {/* Main Action Buttons */}
          <View className="gap-4">
            {/* Start New Match */}
            <TouchableOpacity
              onPress={() => router.push("../new-match")}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-white font-bold text-lg text-center">
                {t("startNewMatch", language)}
              </Text>
              <Text className="text-white text-sm text-center mt-1 opacity-90">
                {t("startNewMatchDesc", language)}
              </Text>
            </TouchableOpacity>

            {/* View Statistics */}
            <TouchableOpacity
              onPress={() => router.push("../statistics")}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-80"
            >
              <Text className="text-foreground font-bold text-lg text-center">
                {t("viewStatistics", language)}
              </Text>
              <Text className="text-muted text-sm text-center mt-1">
                {t("viewStatisticsDesc", language)}
              </Text>
            </TouchableOpacity>

            {/* Match History */}
            <TouchableOpacity
              onPress={() => router.push("../match-history")}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-80"
            >
              <Text className="text-foreground font-bold text-lg text-center">
                {t("matchHistoryTitle", language)}
              </Text>
              <Text className="text-muted text-sm text-center mt-1">
                {t("matchHistoryDesc", language)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">{t("quickStats", language)}</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0</Text>
                <Text className="text-xs text-muted mt-1">{t("matches", language)}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0</Text>
                <Text className="text-xs text-muted mt-1">{t("wins", language)}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0%</Text>
                <Text className="text-xs text-muted mt-1">{t("winRate", language)}</Text>
              </View>
            </View>
          </View>

          {/* Settings Button */}
          <TouchableOpacity
            onPress={() => router.push("../settings")}
            className="bg-surface border border-border rounded-2xl p-6 active:opacity-80"
          >
            <Text className="text-foreground font-semibold text-center">
              ⚙️ {t("settingsTitle", language)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
