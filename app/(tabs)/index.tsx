import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { useThemeContext } from "@/lib/theme-provider";
import { t } from "@/lib/i18n/translations";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { colorScheme } = useThemeContext();
  const { playButtonClick } = useSoundEffects();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem("user_name");
      setUserName(name);
      const role = await AsyncStorage.getItem("user_role");
      if (role === "admin" || role === "user") {
        setUserRole(role);
      }
    };
    loadUser();
  }, []);

  const isAdmin = userRole === "admin";

  const isDark = colorScheme === "dark";

  const handleButtonPress = async (route: any) => {
    await playButtonClick();
    router.push(route);
  };

  return (
    <ScreenContainer className={`p-0 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Retro PS1 Background Header */}
          <View className="bg-gradient-to-b from-cyan-400 to-magenta-500 px-6 py-8 gap-4">
            {/* Language Toggle - Retro Style */}
            <View className="flex-row justify-end gap-2">
              <TouchableOpacity
              onPress={async () => {
                await playButtonClick();
                setLanguage("en");
              }}
                className={`px-4 py-2 rounded border-2 ${
                  language === "en"
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-cyan-300 border-cyan-400"
                }`}
              >
                <Text className="font-bold text-sm text-black">EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={async () => {
                await playButtonClick();
                setLanguage("el");
              }}
                className={`px-4 py-2 rounded border-2 ${
                  language === "el"
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-magenta-300 border-magenta-400"
                }`}
              >
                <Text className="font-bold text-sm text-black">EL</Text>
              </TouchableOpacity>
            </View>

            {/* Welcome Message */}
            <View className="gap-1">
              <Text className="text-2xl font-black text-black">
                {language === "en" ? "🎾 SMASH COURT" : "🎾 SMASH COURT"}
              </Text>
              <Text className="text-sm font-bold text-black">
                {language === "en"
                  ? `Welcome, ${userName || "Player"}!`
                  : `Καλώς ήρθατε, ${userName || "Παίκτη"}!`}
              </Text>
              {!isAdmin && (
                <Text className="text-xs font-bold text-black opacity-70">
                  {language === "en" ? "👁 View-only access" : "👁 Πρόσβαση μόνο για προβολή"}
                </Text>
              )}
            </View>
          </View>

          {/* Main Content */}
          <View className={`flex-1 px-6 py-8 gap-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Start New Match - Retro Button (admin only) */}
            {isAdmin && (
              <TouchableOpacity
                onPress={() => handleButtonPress("/new-match")}
                className="bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-lg p-6 border-4 border-cyan-600 active:scale-95"
              >
                <View className="items-center gap-2">
                  <Text className="text-3xl">🎾</Text>
                  <Text className="text-black font-black text-lg">
                    {language === "en" ? "START NEW MATCH" : "ΝΕΟΣ ΑΓΩΝΑΣ"}
                  </Text>
                  <Text className="text-black font-bold text-xs text-center">
                    {language === "en"
                      ? "Enter players and track the game"
                      : "Εισάγετε παίκτες και παρακολουθήστε τον αγώνα"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Statistics - Retro Button */}
            <TouchableOpacity
              onPress={() => handleButtonPress("/statistics")}
              className={`bg-gradient-to-r from-magenta-400 to-magenta-500 rounded-lg p-6 border-4 border-magenta-600 active:scale-95 ${
                isDark ? "bg-gradient-to-r from-magenta-600 to-magenta-700" : ""
              }`}
            >
              <View className="items-center gap-2">
                <Text className="text-3xl">📊</Text>
                <Text className="text-black font-black text-lg">
                  {language === "en" ? "VIEW STATISTICS" : "ΣΤΑΤΙΣΤΙΚΑ"}
                </Text>
                <Text className="text-black font-bold text-xs text-center">
                  {language === "en"
                    ? "Player rankings and team performance"
                    : "Κατάταξη παικτών και απόδοση ομάδας"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Match History - Retro Button */}
            <TouchableOpacity
              onPress={() => handleButtonPress("/match-history")}
              className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg p-6 border-4 border-yellow-500 active:scale-95"
            >
              <View className="items-center gap-2">
                <Text className="text-3xl">📋</Text>
                <Text className="text-black font-black text-lg">
                  {language === "en" ? "MATCH HISTORY" : "ΙΣΤΟΡΙΚΟ ΑΓΩΝΩΝ"}
                </Text>
                <Text className="text-black font-bold text-xs text-center">
                  {language === "en"
                    ? "Review past matches"
                    : "Ανασκόπηση προηγούμενων αγώνων"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quick Stats - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-4 mt-4 ${
                isDark
                  ? "bg-gray-800 border-cyan-400"
                  : "bg-white border-cyan-400"
              }`}
            >
              <Text className={`font-black text-lg ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>
                {language === "en" ? "QUICK STATS" : "ΓΡΗΓΟΡΑ ΣΤΑΤΙΣΤΙΚΑ"}
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-cyan-500 rounded-lg p-4 border-2 border-cyan-600 items-center">
                  <Text className={`font-black text-2xl ${isDark ? "text-cyan-300" : "text-black"}`}>0</Text>
                  <Text className={`font-bold text-xs ${isDark ? "text-cyan-300" : "text-black"}`}>
                    {language === "en" ? "Matches" : "Αγώνες"}
                  </Text>
                </View>
                <View className="flex-1 bg-magenta-500 rounded-lg p-4 border-2 border-magenta-600 items-center">
                  <Text className={`font-black text-2xl ${isDark ? "text-cyan-300" : "text-black"}`}>0</Text>
                  <Text className={`font-bold text-xs ${isDark ? "text-cyan-300" : "text-black"}`}>
                    {language === "en" ? "Wins" : "Νίκες"}
                  </Text>
                </View>
                <View className="flex-1 bg-yellow-400 rounded-lg p-4 border-2 border-yellow-500 items-center">
                  <Text className={`font-black text-2xl ${isDark ? "text-cyan-300" : "text-black"}`}>0%</Text>
                  <Text className={`font-bold text-xs ${isDark ? "text-cyan-300" : "text-black"}`}>
                    {language === "en" ? "Win Rate" : "% Νικών"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Settings Link - Retro Style */}
            <TouchableOpacity
              onPress={async () => {
                await playButtonClick();
                router.push("/settings");
              }}
              className={`rounded-lg p-4 border-2 active:opacity-80 mt-4 ${
                isDark
                  ? "bg-gray-800 border-cyan-400"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Text className={`font-bold text-center ${isDark ? "text-cyan-300" : "text-gray-700"}`}>
                {language === "en" ? "⚙️ Settings" : "⚙️ Ρυθμίσεις"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
