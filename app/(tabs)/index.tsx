import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-4 mt-4">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <Text className="text-4xl">🎾</Text>
            </View>
            <Text className="text-4xl font-bold text-foreground text-center">
              Smash Court Tennis
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Track your doubles matches and climb the leaderboard
            </Text>
          </View>

          {/* Main Action Buttons */}
          <View className="gap-4">
            {/* Start New Match */}
            <TouchableOpacity
              onPress={() => router.push("../new-match")}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-white font-bold text-lg text-center">
                🏁 Start New Match
              </Text>
              <Text className="text-white text-sm text-center mt-1 opacity-90">
                Enter players and track the game
              </Text>
            </TouchableOpacity>

            {/* View Statistics */}
            <TouchableOpacity
              onPress={() => router.push("../statistics")}
              className="bg-accent rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-white font-bold text-lg text-center">
                📊 View Statistics
              </Text>
              <Text className="text-white text-sm text-center mt-1 opacity-90">
                Player rankings and team performance
              </Text>
            </TouchableOpacity>

            {/* Match History */}
            <TouchableOpacity
              onPress={() => router.push("../match-history")}
              className="bg-surface border border-border rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-foreground font-bold text-lg text-center">
                📜 Match History
              </Text>
              <Text className="text-muted text-sm text-center mt-1">
                Review past matches
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats Card */}
          <View className="bg-surface border border-border rounded-2xl p-6 gap-3">
            <Text className="text-lg font-semibold text-foreground">Quick Stats</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0</Text>
                <Text className="text-xs text-muted mt-1">Matches</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0</Text>
                <Text className="text-xs text-muted mt-1">Wins</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">0%</Text>
                <Text className="text-xs text-muted mt-1">Win Rate</Text>
              </View>
            </View>
          </View>

          {/* Settings Link */}
          <TouchableOpacity
            onPress={() => router.push("../settings")}
            className="flex-row items-center justify-center gap-2 py-3"
          >
            <Text className="text-muted">⚙️</Text>
            <Text className="text-muted text-sm">Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
