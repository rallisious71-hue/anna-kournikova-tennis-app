import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will permanently delete all matches and statistics. This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Reset",
          onPress: async () => {
            // TODO: Clear all data from database
            Alert.alert("Success", "All data has been reset");
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
              <Text className="text-3xl font-bold text-foreground">Settings</Text>
              <Text className="text-sm text-muted mt-1">App preferences</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
            >
              <Text className="text-foreground text-lg">×</Text>
            </TouchableOpacity>
          </View>

          {/* Theme Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Appearance</Text>
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-foreground font-medium">Dark Mode</Text>
                <Text className="text-xs text-muted">Toggle dark/light theme</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                // TODO: Implement theme switching
              />
            </View>
          </View>

          {/* Data Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Data</Text>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-80">
              <View className="gap-1">
                <Text className="text-foreground font-medium">Export Data</Text>
                <Text className="text-xs text-muted">Download your match history</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetData}
              className="bg-error bg-opacity-10 rounded-lg p-4 border border-error border-opacity-30 active:opacity-80"
            >
              <View className="gap-1">
                <Text className="text-error font-medium">Reset All Data</Text>
                <Text className="text-xs text-error opacity-75">Delete all matches and statistics</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted">Version</Text>
                <Text className="text-foreground font-semibold">1.0.0</Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-1">
                <Text className="text-foreground font-medium">Anna Kournikova Smash Court Tennis</Text>
                <Text className="text-xs text-muted mt-2">
                  Track your doubles tennis matches and climb the leaderboard
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 py-6">
            <Text className="text-xs text-muted">Made with 🎾 for tennis lovers</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
