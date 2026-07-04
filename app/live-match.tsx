import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";

export default function LiveMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);

  const { saveMatchAsync, isSavingMatch } = useTennisApi();

  const handleEndMatch = () => {
    // Determine winner
    let winner = 0;
    if (team1Sets > team2Sets) winner = 1;
    else if (team2Sets > team1Sets) winner = 2;
    else {
      Alert.alert("Error", "Match is not complete. One team must win more sets.");
      return;
    }

    Alert.alert("Match Complete", "Save this match to your history?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Save",
        onPress: async () => {
          try {
            const matchData = {
              team1Player1: params.team1Player1 as string,
              team1Player2: params.team1Player2 as string,
              team2Player1: params.team2Player1 as string,
              team2Player2: params.team2Player2 as string,
              team1Sets,
              team2Sets,
              team1Games,
              team2Games,
              winner,
            };

            console.log("[Match Save] Starting match save with data:", matchData);

            const result = await saveMatchAsync(matchData);

            console.log("[Match Save] Success! Result:", result);

            Alert.alert("Success", "Match saved!", [
              { text: "OK", onPress: () => router.push("/(tabs)") },
            ]);
          } catch (error: any) {
            console.error("[Match Save] Error:", error);
            const errorMessage = error?.message || "Failed to save match. Please try again.";
            Alert.alert("Error", errorMessage);
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Match Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground text-center">Live Match</Text>
            <Text className="text-xs text-muted text-center">
              {params.team1Player1} & {params.team1Player2} vs {params.team2Player1} & {params.team2Player2}
            </Text>
          </View>

          {/* Team 1 Score Card */}
          <View className="bg-accent rounded-2xl p-6 gap-4">
            <View className="gap-1">
              <Text className="text-sm font-semibold text-white opacity-90">Team 1</Text>
              <Text className="text-xs text-white opacity-75">
                {params.team1Player1} & {params.team1Player2}
              </Text>
            </View>

            {/* Sets and Games Display */}
            <View className="flex-row gap-4">
              <View className="flex-1 bg-white bg-opacity-20 rounded-lg p-4 items-center">
                <Text className="text-4xl font-bold text-white">{team1Sets}</Text>
                <Text className="text-xs text-white mt-1">Sets</Text>
              </View>
              <View className="flex-1 bg-white bg-opacity-20 rounded-lg p-4 items-center">
                <Text className="text-4xl font-bold text-white">{team1Games}</Text>
                <Text className="text-xs text-white mt-1">Games</Text>
              </View>
            </View>

            {/* Score Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTeam1Games(Math.max(0, team1Games - 1))}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam1Games(team1Games + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-accent font-bold text-center">+1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam1Sets(team1Sets + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-accent font-bold text-center">+1 Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Team 2 Score Card */}
          <View className="bg-error rounded-2xl p-6 gap-4">
            <View className="gap-1">
              <Text className="text-sm font-semibold text-white opacity-90">Team 2</Text>
              <Text className="text-xs text-white opacity-75">
                {params.team2Player1} & {params.team2Player2}
              </Text>
            </View>

            {/* Sets and Games Display */}
            <View className="flex-row gap-4">
              <View className="flex-1 bg-white bg-opacity-20 rounded-lg p-4 items-center">
                <Text className="text-4xl font-bold text-white">{team2Sets}</Text>
                <Text className="text-xs text-white mt-1">Sets</Text>
              </View>
              <View className="flex-1 bg-white bg-opacity-20 rounded-lg p-4 items-center">
                <Text className="text-4xl font-bold text-white">{team2Games}</Text>
                <Text className="text-xs text-white mt-1">Games</Text>
              </View>
            </View>

            {/* Score Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTeam2Games(Math.max(0, team2Games - 1))}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam2Games(team2Games + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-error font-bold text-center">+1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam2Sets(team2Sets + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-error font-bold text-center">+1 Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleEndMatch}
              disabled={isSavingMatch}
              className="bg-primary rounded-lg py-4 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-white font-bold text-center text-lg">
                {isSavingMatch ? "Saving..." : "End Match"}
              </Text>
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
