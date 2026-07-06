import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { useThemeContext } from "@/lib/theme-provider";
import { t } from "@/lib/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { colorScheme, setColorScheme } = useThemeContext();

  const isDark = colorScheme === "dark";

  const handleDarkModeToggle = (value: boolean) => {
    setColorScheme(value ? "dark" : "light");
  };

  const handleLogout = async () => {
    Alert.alert(
      language === "en" ? "Logout" : "Αποσύνδεση",
      language === "en" ? "Are you sure?" : "Είστε σίγουροι;",
      [
        { text: language === "en" ? "Cancel" : "Ακύρωση", onPress: () => {} },
        {
          text: language === "en" ? "Logout" : "Αποσύνδεση",
          onPress: async () => {
            await AsyncStorage.removeItem("user_id");
            await AsyncStorage.removeItem("user_name");
            await AsyncStorage.removeItem("username");
            router.replace("../login");
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      language === "en" ? "Reset All Data" : "Επαναφορά Όλων των Δεδομένων",
      language === "en"
        ? "This will permanently delete all matches and statistics. This action cannot be undone."
        : "Αυτό θα διαγράψει μόνιμα όλους τους αγώνες και τα στατιστικά. Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
      [
        { text: language === "en" ? "Cancel" : "Ακύρωση", onPress: () => {} },
        {
          text: language === "en" ? "Delete" : "Διαγραφή",
          onPress: async () => {
            // TODO: Clear all data from database
            Alert.alert(
              language === "en" ? "Success" : "Επιτυχία",
              language === "en" ? "All data has been reset" : "Όλα τα δεδομένα έχουν επαναφερθεί"
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className={`p-0 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Retro Header */}
          <View className="bg-gradient-to-r from-magenta-500 to-cyan-400 px-6 py-8 gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-3xl font-black text-black">
                {language === "en" ? "SETTINGS" : "ΡΥΘΜΙΣΕΙΣ"}
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-12 h-12 rounded-lg bg-yellow-300 border-2 border-yellow-400 items-center justify-center active:scale-95"
              >
                <Text className="text-black text-2xl font-black">×</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-black font-bold text-sm">
              {language === "en" ? "Customize your experience" : "Προσαρμόστε την εμπειρία σας"}
            </Text>
          </View>

          {/* Main Content */}
          <View className={`flex-1 px-6 py-8 gap-6 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Language Section - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-4 ${
                isDark
                  ? "bg-gray-800 border-cyan-400"
                  : "bg-white border-cyan-400"
              }`}
            >
              <Text className={`font-black text-lg ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>
                {language === "en" ? "LANGUAGE" : "ΓΛΩΣΣΑ"}
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setLanguage("en")}
                  className={`flex-1 py-4 rounded-lg border-2 font-bold ${
                    language === "en"
                      ? "bg-cyan-400 border-cyan-500"
                      : isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-black text-center ${
                      language === "en"
                        ? "text-black"
                        : isDark
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    ENGLISH
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLanguage("el")}
                  className={`flex-1 py-4 rounded-lg border-2 font-bold ${
                    language === "el"
                      ? "bg-magenta-400 border-magenta-500"
                      : isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-black text-center ${
                      language === "el"
                        ? "text-black"
                        : isDark
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    ΕΛΛΗΝΙΚΑ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dark Mode Section - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-4 ${
                isDark
                  ? "bg-gray-800 border-magenta-400"
                  : "bg-white border-magenta-400"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`font-black text-lg ${isDark ? "text-magenta-300" : "text-magenta-600"}`}>
                  {language === "en" ? "DARK MODE" : "ΣΚΟΤΕΙΝΗ ΛΕΙΤΟΥΡΓΙΑ"}
                </Text>
                <Switch
                  value={colorScheme === "dark"}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: "#FFD700", true: "#00D9FF" }}
                  thumbColor={colorScheme === "dark" ? "#FF006E" : "#FFD700"}
                />
              </View>
              <Text className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {language === "en"
                  ? "Toggle between light and dark themes"
                  : "Εναλλαγή μεταξύ ανοιχτών και σκοτεινών θεμάτων"}
              </Text>
            </View>

            {/* Account Section - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-4 ${
                isDark
                  ? "bg-gray-800 border-yellow-400"
                  : "bg-white border-yellow-400"
              }`}
            >
              <Text className={`font-black text-lg ${isDark ? "text-yellow-300" : "text-yellow-600"}`}>
                {language === "en" ? "ACCOUNT" : "ΛΟΓΑΡΙΑΣΜΟΣ"}
              </Text>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-600 rounded-lg py-4 border-2 border-red-700 active:scale-95"
              >
                <Text className="text-white font-black text-center">
                  {language === "en" ? "LOGOUT" : "ΑΠΟΣΥΝΔΕΣΗ"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Data Section - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-4 ${
                isDark
                  ? "bg-gray-800 border-green-400"
                  : "bg-white border-green-400"
              }`}
            >
              <Text className={`font-black text-lg ${isDark ? "text-green-300" : "text-green-600"}`}>
                {language === "en" ? "DATA" : "ΔΕΔΟΜΕΝΑ"}
              </Text>

              {/* Reset Data Button */}
              <TouchableOpacity
                onPress={handleResetData}
                className="bg-red-600 rounded-lg py-4 border-2 border-red-700 active:scale-95"
              >
                <Text className="text-white font-black text-center">
                  {language === "en" ? "RESET ALL DATA" : "ΕΠΑΝΑΦΟΡΑ ΟΛΩΝ"}
                </Text>
              </TouchableOpacity>
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {language === "en"
                  ? "Permanently delete all matches and statistics"
                  : "Διαγράψτε μόνιμα όλους τους αγώνες και τα στατιστικά"}
              </Text>
            </View>

            {/* About Section - Retro Box */}
            <View
              className={`rounded-lg p-6 border-4 gap-2 ${
                isDark
                  ? "bg-gray-800 border-cyan-400"
                  : "bg-white border-cyan-400"
              }`}
            >
              <Text className={`font-black text-lg ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>
                {language === "en" ? "ABOUT" : "ΣΧΕΤΙΚΑ"}
              </Text>
              <Text className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Anna Kournikova Smash Court Tennis
              </Text>
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {language === "en" ? "Version 1.0.0" : "Έκδοση 1.0.0"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
