import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
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
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Retro PS1 Background Header */}
          <View className="bg-gradient-to-b from-cyan-400 to-magenta-500 px-6 py-8 gap-4">
            {/* Language Toggle - Retro Style */}
            <View className="flex-row justify-end gap-2">
              <TouchableOpacity
                onPress={() => setLanguage("en")}
                className={`px-4 py-2 rounded border-2 ${
                  language === "en"
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-cyan-300 border-cyan-400"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    language === "en" ? "text-black" : "text-black"
                  }`}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage("el")}
                className={`px-4 py-2 rounded border-2 ${
                  language === "el"
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-magenta-300 border-magenta-400"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    language === "el" ? "text-black" : "text-black"
                  }`}
                >
                  EL
                </Text>
              </TouchableOpacity>
            </View>

            {/* Retro Title */}
            <View className="items-center gap-3">
              <Text className="text-4xl font-black text-black drop-shadow-lg">
                SMASH COURT
              </Text>
              <Text className="text-2xl font-black text-yellow-300 drop-shadow-lg">
                TENNIS
              </Text>
              <Text className="text-xs font-bold text-black text-center">
                {language === "en"
                  ? "TRACK YOUR DOUBLES MATCHES"
                  : "ΠΑΡΑΚΟΛΟΥΘΗΣΤΕ ΤΟΥΣ ΑΓΩΝΕΣ ΣΑΣ"}
              </Text>
            </View>

            {/* Welcome Message */}
            {userName && (
              <View className="bg-black bg-opacity-30 rounded-lg p-3 border-2 border-yellow-300">
                <Text className="text-yellow-300 font-bold text-center">
                  {language === "en" ? "Welcome" : "Καλώς ήρθατε"}, {userName}!
                </Text>
              </View>
            )}
          </View>

          {/* Main Content */}
          <View className="flex-1 px-6 py-8 gap-4 bg-gray-900">
            {/* Start New Match - Retro Button */}
            <TouchableOpacity
              onPress={() => router.push("/new-match")}
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

            {/* Statistics - Retro Button */}
            <TouchableOpacity
              onPress={() => router.push("/statistics")}
              className="bg-gradient-to-r from-magenta-400 to-magenta-500 rounded-lg p-6 border-4 border-magenta-600 active:scale-95"
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
              onPress={() => router.push("/match-history")}
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
            <View className="bg-black bg-opacity-50 rounded-lg p-6 border-4 border-cyan-400 gap-4 mt-4">
              <Text className="text-cyan-300 font-black text-lg">
                {language === "en" ? "QUICK STATS" : "ΓΡΗΓΟΡΑ ΣΤΑΤΙΣΤΙΚΑ"}
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-cyan-500 rounded-lg p-4 border-2 border-cyan-600 items-center">
                  <Text className="text-black font-black text-2xl">0</Text>
                  <Text className="text-black font-bold text-xs">
                    {language === "en" ? "Matches" : "Αγώνες"}
                  </Text>
                </View>
                <View className="flex-1 bg-magenta-500 rounded-lg p-4 border-2 border-magenta-600 items-center">
                  <Text className="text-black font-black text-2xl">0</Text>
                  <Text className="text-black font-bold text-xs">
                    {language === "en" ? "Wins" : "Νίκες"}
                  </Text>
                </View>
                <View className="flex-1 bg-yellow-400 rounded-lg p-4 border-2 border-yellow-500 items-center">
                  <Text className="text-black font-black text-2xl">0%</Text>
                  <Text className="text-black font-bold text-xs">
                    {language === "en" ? "Win Rate" : "% Νικών"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Settings Link - Retro Style */}
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              className="bg-gray-700 rounded-lg p-4 border-2 border-gray-600 active:opacity-80 mt-4"
            >
              <Text className="text-gray-300 font-bold text-center">
                {language === "en" ? "⚙️ Settings" : "⚙️ Ρυθμίσεις"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
