import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";

interface MatchRecord {
  id: number;
  team1: string;
  team2: string;
  team1Sets: number;
  team2Sets: number;
  winner: 1 | 2;
  date: string;
}

export default function MatchHistoryScreen() {
  const router = useRouter();
  const { matchHistory, isLoadingHistory, deleteMatchAsync } = useTennisApi();
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  useEffect(() => {
    if (matchHistory && matchHistory.length > 0) {
      const formatted = matchHistory.map((m) => ({
        id: m.id,
        team1: `${m.team1Player1} & ${m.team1Player2}`,
        team2: `${m.team2Player1} & ${m.team2Player2}`,
        team1Sets: m.team1Sets,
        team2Sets: m.team2Sets,
        winner: (m.winner || 0) as 1 | 2,
        date: new Date(m.matchDate).toLocaleDateString(),
      }));
      setMatches(formatted);
    }
  }, [matchHistory]);

  const handleDeleteMatch = (id: number) => {
    Alert.alert("Delete Match", "Are you sure you want to delete this match?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteMatchAsync({ matchId: id });
            setMatches(matches.filter((m) => m.id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete match.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderMatchRow = ({ item }: { item: MatchRecord }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-foreground font-semibold">{item.team1}</Text>
          <Text className="text-xs text-muted mt-1">{item.date}</Text>
        </View>
        <View className="items-center gap-2">
          <View className="flex-row gap-1">
            <View className={`px-3 py-1 rounded ${item.winner === 1 ? "bg-primary" : "bg-surface"}`}>
              <Text className={`font-bold text-sm ${item.winner === 1 ? "text-white" : "text-foreground"}`}>
                {item.team1Sets}
              </Text>
            </View>
            <Text className="text-foreground font-bold">-</Text>
            <View className={`px-3 py-1 rounded ${item.winner === 2 ? "bg-error" : "bg-surface"}`}>
              <Text className={`font-bold text-sm ${item.winner === 2 ? "text-white" : "text-foreground"}`}>
                {item.team2Sets}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-foreground font-semibold">{item.team2}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteMatch(item.id)}
          className="px-3 py-1 rounded bg-error bg-opacity-10"
        >
          <Text className="text-error text-xs font-semibold">Delete</Text>
        </TouchableOpacity>
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
              <Text className="text-3xl font-bold text-foreground">Match History</Text>
              <Text className="text-sm text-muted mt-1">Past matches</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
            >
              <Text className="text-foreground text-lg">×</Text>
            </TouchableOpacity>
          </View>

          {/* Match List */}
          {isLoadingHistory ? (
            <View className="flex-1 items-center justify-center gap-3 py-12">
              <Text className="text-muted">Loading...</Text>
            </View>
          ) : matches.length > 0 ? (
            <FlatList
              data={matches}
              renderItem={renderMatchRow}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-3 py-12">
              <Text className="text-4xl">📜</Text>
              <Text className="text-foreground font-semibold">No matches yet</Text>
              <Text className="text-muted text-sm text-center">
                Your match history will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
