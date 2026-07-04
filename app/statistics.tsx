import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";

interface PlayerRank {
  rank: number;
  name: string;
  matches: number;
  wins: number;
  percentage: number;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const { playerStats, isLoadingStats } = useTennisApi();
  const [sortBy, setSortBy] = useState<"wins" | "percentage" | "matches">("wins");
  const [players, setPlayers] = useState<PlayerRank[]>([]);

  useEffect(() => {
    if (playerStats && playerStats.length > 0) {
      const ranked = playerStats
        .map((stat, index) => ({
          rank: index + 1,
          name: stat.playerName,
          matches: stat.matchesPlayed,
          wins: stat.matchesWon,
          percentage: stat.matchesPlayed > 0 ? Math.round((stat.matchesWon / stat.matchesPlayed) * 100) : 0,
        }))
        .sort((a, b) => {
          if (sortBy === "wins") return b.wins - a.wins;
          if (sortBy === "percentage") return b.percentage - a.percentage;
          return b.matches - a.matches;
        });
      setPlayers(ranked);
    }
  }, [playerStats, sortBy]);

  const renderPlayerRow = ({ item, index }: { item: PlayerRank; index: number }) => (
    <View className="flex-row items-center gap-4 bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
        <Text className="text-white font-bold text-sm">{item.rank}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-xs text-muted mt-1">{item.matches} matches</Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-primary">{item.wins}</Text>
        <Text className="text-xs text-muted">{item.percentage}%</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">Statistics</Text>
              <Text className="text-sm text-muted mt-1">Player Rankings</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
            >
              <Text className="text-foreground text-lg">×</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSortBy("wins")}
              className={`flex-1 rounded-lg py-3 ${
                sortBy === "wins" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold text-center ${
                  sortBy === "wins" ? "text-white" : "text-foreground"
                }`}
              >
                Wins
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortBy("percentage")}
              className={`flex-1 rounded-lg py-3 ${
                sortBy === "percentage" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold text-center ${
                  sortBy === "percentage" ? "text-white" : "text-foreground"
                }`}
              >
                Win %
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortBy("matches")}
              className={`flex-1 rounded-lg py-3 ${
                sortBy === "matches" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold text-center ${
                  sortBy === "matches" ? "text-white" : "text-foreground"
                }`}
              >
                Matches
              </Text>
            </TouchableOpacity>
          </View>

          {/* Player List */}
          {isLoadingStats ? (
            <View className="flex-1 items-center justify-center gap-3 py-12">
              <Text className="text-muted">Loading...</Text>
            </View>
          ) : players.length > 0 ? (
            <FlatList
              data={players}
              renderItem={renderPlayerRow}
              keyExtractor={(item) => item.name}
              scrollEnabled={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-3 py-12">
              <Text className="text-4xl">📊</Text>
              <Text className="text-foreground font-semibold">No matches yet</Text>
              <Text className="text-muted text-sm text-center">
                Start a match to see player statistics
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
