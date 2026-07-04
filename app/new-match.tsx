import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

export default function NewMatchScreen() {
  const router = useRouter();
  const [team1Player1, setTeam1Player1] = useState("");
  const [team1Player2, setTeam1Player2] = useState("");
  const [team2Player1, setTeam2Player1] = useState("");
  const [team2Player2, setTeam2Player2] = useState("");

  const handleStartMatch = () => {
    if (!team1Player1.trim() || !team1Player2.trim() || !team2Player1.trim() || !team2Player2.trim()) {
      Alert.alert("Error", "Please enter all player names");
      return;
    }

    // Navigate to live match with player data
    router.push({
      pathname: "/live-match",
      params: {
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2,
      },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">New Match</Text>
            <Text className="text-sm text-muted">Enter player names to get started</Text>
          </View>

          {/* Team 1 Section */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-accent items-center justify-center">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="text-lg font-semibold text-foreground">Team 1</Text>
            </View>

            <View className="gap-3 bg-surface rounded-xl p-4 border border-border">
              <View>
                <Text className="text-sm font-medium text-muted mb-2">Player 1</Text>
                <TextInput
                  placeholder="Enter player name"
                  placeholderTextColor="#9BA1A6"
                  value={team1Player1}
                  onChangeText={setTeam1Player1}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-muted mb-2">Player 2</Text>
                <TextInput
                  placeholder="Enter player name"
                  placeholderTextColor="#9BA1A6"
                  value={team1Player2}
                  onChangeText={setTeam1Player2}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            </View>
          </View>

          {/* Team 2 Section */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-error items-center justify-center">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-lg font-semibold text-foreground">Team 2</Text>
            </View>

            <View className="gap-3 bg-surface rounded-xl p-4 border border-border">
              <View>
                <Text className="text-sm font-medium text-muted mb-2">Player 1</Text>
                <TextInput
                  placeholder="Enter player name"
                  placeholderTextColor="#9BA1A6"
                  value={team2Player1}
                  onChangeText={setTeam2Player1}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-muted mb-2">Player 2</Text>
                <TextInput
                  placeholder="Enter player name"
                  placeholderTextColor="#9BA1A6"
                  value={team2Player2}
                  onChangeText={setTeam2Player2}
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleStartMatch}
              className="bg-primary rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-white font-bold text-center text-lg">Start Match</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-surface border border-border rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-foreground font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
