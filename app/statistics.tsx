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
  gamesWon: number;
  percentage: number;
}

interface TeamRank {
  rank: number;
  teamLabel: string;
  matches: number;
  wins: number;
  percentage: number;
}

/** Order-independent key so "A & B" and "B & A" count as the same pair */
function teamKey(p1: string, p2: string) {
  return [p1, p2].sort((a, b) => a.localeCompare(b));
}

export default function StatisticsScreen() {
  const router = useRouter();
  const { playerStats, isLoadingStats, matchHistory, isLoadingHistory } = useTennisApi();
  const [sortBy, setSortBy] = useState<"wins" | "games" | "teams">("wins");
  const [players, setPlayers] = useState<PlayerRank[]>([]);
  const [teams, setTeams] = useState<TeamRank[]>([]);

  useEffect(() => {
    if (playerStats && playerStats.length > 0) {
      const ranked = playerStats
        .map((stat) => ({
          rank: 0,
          name: stat.playerName,
          matches: stat.matchesPlayed,
          wins: stat.matchesWon,
          gamesWon: stat.gamesWon,
          percentage: stat.matchesPlayed > 0 ? Math.round((stat.matchesWon / stat.matchesPlayed) * 100) : 0,
        }))
        .sort((a, b) => (sortBy === "games" ? b.gamesWon - a.gamesWon : b.wins - a.wins))
        .map((p, index) => ({ ...p, rank: index + 1 }));
      setPlayers(ranked);
    } else {
      setPlayers([]);
    }
  }, [playerStats, sortBy]);

  // Team (doubles pair) effectiveness - computed from full match history
  useEffect(() => {
    if (matchHistory && matchHistory.length > 0) {
      const map = new Map<string, { key: [string, string]; matches: number; wins: number }>();

      matchHistory.forEach((m: any) => {
        const entries: { key: [string, string]; won: boolean }[] = [
          { key: teamKey(m.team1Player1, m.team1Player2) as [string, string], won: m.winner === 1 },
          { key: teamKey(m.team2Player1, m.team2Player2) as [string, string], won: m.winner === 2 },
        ];

        entries.forEach(({ key, won }) => {
          const mapKey = key.join(" & ");
          const existing = map.get(mapKey) || { key, matches: 0, wins: 0 };
          existing.matches += 1;
          existing.wins += won ? 1 : 0;
          map.set(mapKey, existing);
        });
      });

      const ranked = Array.from(map.values())
        .map((t) => ({
          rank: 0,
          teamLabel: t.key.join(" & "),
          matches: t.matches,
          wins: t.wins,
          percentage: t.matches > 0 ? Math.round((t.wins / t.matches) * 100) : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage || b.matches - a.matches)
        .map((t, index) => ({ ...t, rank: index + 1 }));

      setTeams(ranked);
    } else {
      setTeams([]);
    }
  }, [matchHistory]);

  const renderPlayerRow = ({ item }: { item: PlayerRank }) => (
    <View className="flex-row items-center gap-4 bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
        <Text className="text-white font-bold text-sm">{item.rank}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-xs text-muted mt-1">{item.matches} matches</Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-primary">
          {sortBy === "games" ? item.gamesWon : item.wins}
        </Text>
        <Text className="text-xs text-muted">{sortBy === "games" ? "games" : `${item.percentage}%`}</Text>
      </View>
    </View>
  );

  const renderTeamRow = ({ item }: { item: TeamRank }) => (
    <View className="flex-row items-center gap-4 bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
        <Text className="text-white font-bold text-sm">{item.rank}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.teamLabel}</Text>
        <Text className="text-xs text-muted mt-1">
          {item.wins}/{item.matches} νίκες
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-primary">{item.percentage}%</Text>
        <Text className="text-xs text-muted">αποτελεσματικότητα</Text>
      </View>
    </View>
  );

  const isTeamsTab = sortBy === "teams";
  const isLoading = isTeamsTab ? isLoadingHistory : isLoadingStats;
  const hasData = isTeamsTab ? teams.length > 0 : players.length > 0;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">Statistics</Text>
              <Text className="text-sm text-muted mt-1">
                {isTeamsTab ? "Αποτελεσματικότητα Ζευγαριών" : "Player Rankings"}
              </Text>
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
                Νίκες
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortBy("games")}
              className={`flex-1 rounded-lg py-3 ${
                sortBy === "games" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold text-center ${
                  sortBy === "games" ? "text-white" : "text-foreground"
                }`}
              >
                Games
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortBy("teams")}
              className={`flex-1 rounded-lg py-3 ${
                sortBy === "teams" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold text-center ${
                  sortBy === "teams" ? "text-white" : "text-foreground"
                }`}
              >
                Ζευγάρια %
              </Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          {isLoading ? (
            <View className="flex-1 items-center justify-center gap-3 py-12">
              <Text className="text-muted">Loading...</Text>
            </View>
          ) : hasData ? (
            isTeamsTab ? (
              <FlatList
                data={teams}
                renderItem={renderTeamRow}
                keyExtractor={(item) => item.teamLabel}
                scrollEnabled={false}
              />
            ) : (
              <FlatList
                data={players}
                renderItem={renderPlayerRow}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
              />
            )
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
