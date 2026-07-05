import { ScrollView, Text, View, TouchableOpacity, Alert, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";

interface MatchRecord {
  id: number;
  team1Player1: string;
  team1Player2: string;
  team2Player1: string;
  team2Player2: string;
  team1: string;
  team2: string;
  team1Sets: number;
  team2Sets: number;
  team1Games: number;
  team2Games: number;
  winner: 1 | 2;
  date: string;
  matchDate: Date;
}

export default function MatchHistoryScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { matchHistory, isLoadingHistory, deleteMatchAsync } = useTennisApi();
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (matchHistory && matchHistory.length > 0) {
      const formatted = matchHistory.map((m) => ({
        id: m.id,
        team1Player1: m.team1Player1,
        team1Player2: m.team1Player2,
        team2Player1: m.team2Player1,
        team2Player2: m.team2Player2,
        team1: `${m.team1Player1} & ${m.team1Player2}`,
        team2: `${m.team2Player1} & ${m.team2Player2}`,
        team1Sets: m.team1Sets,
        team2Sets: m.team2Sets,
        team1Games: m.team1Games,
        team2Games: m.team2Games,
        winner: (m.winner || 0) as 1 | 2,
        date: new Date(m.matchDate).toLocaleDateString(),
        matchDate: new Date(m.matchDate),
      }));
      setMatches(formatted);
    }
  }, [matchHistory]);

  // Get unique dates for filter
  const uniqueDates = useMemo(() => {
    return [...new Set(matches.map((m) => m.date))].sort().reverse();
  }, [matches]);

  // Get unique players for filter
  const uniquePlayers = useMemo(() => {
    const players = new Set<string>();
    matches.forEach((m) => {
      players.add(m.team1Player1);
      players.add(m.team1Player2);
      players.add(m.team2Player1);
      players.add(m.team2Player2);
    });
    return Array.from(players).sort();
  }, [matches]);

  // Filter matches based on selected filters
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const dateMatch = !selectedDate || m.date === selectedDate;
      const playerMatch =
        !selectedPlayer ||
        m.team1Player1 === selectedPlayer ||
        m.team1Player2 === selectedPlayer ||
        m.team2Player1 === selectedPlayer ||
        m.team2Player2 === selectedPlayer;
      return dateMatch && playerMatch;
    });
  }, [matches, selectedDate, selectedPlayer]);

  const handleDeleteMatch = (id: number) => {
    Alert.alert(
      language === "en" ? "Delete Match" : "Διαγραφή Αγώνα",
      language === "en" ? "Are you sure?" : "Είστε σίγουροι;",
      [
        { text: language === "en" ? "Cancel" : "Ακύρωση", onPress: () => {} },
        {
          text: language === "en" ? "Delete" : "Διαγραφή",
          onPress: async () => {
            try {
              await deleteMatchAsync({ matchId: id });
              setMatches(matches.filter((m) => m.id !== id));
            } catch (error) {
              Alert.alert(language === "en" ? "Error" : "Σφάλμα", "Failed to delete match.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEditMatch = (match: MatchRecord) => {
    router.push({
      pathname: "/edit-match",
      params: {
        matchId: match.id,
        team1Player1: match.team1Player1,
        team1Player2: match.team1Player2,
        team2Player1: match.team2Player1,
        team2Player2: match.team2Player2,
        team1Sets: match.team1Sets,
        team2Sets: match.team2Sets,
        team1Games: match.team1Games,
        team2Games: match.team2Games,
      },
    });
  };

  const MatchCard = ({ match }: { match: MatchRecord }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-xs text-muted mb-1">{match.date}</Text>
          <Text className="text-sm font-bold text-foreground">{match.team1}</Text>
          <Text className="text-sm font-bold text-foreground">{match.team2}</Text>
        </View>
        <View className="items-center bg-primary rounded-lg px-3 py-2">
          <Text className="text-white font-bold text-lg">
            {match.team1Sets}-{match.team2Sets}
          </Text>
          <Text className="text-white text-xs">Sets</Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={() => handleEditMatch(match)}
          className="flex-1 bg-primary rounded-lg py-2 active:opacity-80"
        >
          <Text className="text-white font-semibold text-center text-sm">
            {language === "en" ? "Edit" : "Επεξεργασία"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteMatch(match.id)}
          className="flex-1 bg-error rounded-lg py-2 active:opacity-80"
        >
          <Text className="text-white font-semibold text-center text-sm">
            {language === "en" ? "Delete" : "Διαγραφή"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              {language === "en" ? "Match History" : "Ιστορικό Αγώνων"}
            </Text>
            <Text className="text-sm text-muted">
              {language === "en" ? "Total matches: " : "Σύνολο αγώνων: "}
              {filteredMatches.length}
            </Text>
          </View>

          {/* Filter Toggle Button */}
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="bg-primary rounded-lg py-3 active:opacity-80"
          >
            <Text className="text-white font-bold text-center">
              {showFilters
                ? language === "en"
                  ? "Hide Filters"
                  : "Απόκρυψη Φίλτρων"
                : language === "en"
                ? "Show Filters"
                : "Εμφάνιση Φίλτρων"}
            </Text>
          </TouchableOpacity>

          {/* Filters Section */}
          {showFilters && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-4">
              {/* Date Filter */}
              <View className="gap-2">
                <Text className="text-sm font-bold text-foreground">
                  {language === "en" ? "Filter by Date" : "Φίλτρο κατά Ημερομηνία"}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  <TouchableOpacity
                    onPress={() => setSelectedDate(null)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedDate === null ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        selectedDate === null ? "text-white" : "text-foreground"
                      }`}
                    >
                      {language === "en" ? "All" : "Όλα"}
                    </Text>
                  </TouchableOpacity>
                  {uniqueDates.map((date) => (
                    <TouchableOpacity
                      key={date}
                      onPress={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedDate === date ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          selectedDate === date ? "text-white" : "text-foreground"
                        }`}
                      >
                        {date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Player Filter */}
              <View className="gap-2">
                <Text className="text-sm font-bold text-foreground">
                  {language === "en" ? "Filter by Player" : "Φίλτρο κατά Παίκτη"}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  <TouchableOpacity
                    onPress={() => setSelectedPlayer(null)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedPlayer === null ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        selectedPlayer === null ? "text-white" : "text-foreground"
                      }`}
                    >
                      {language === "en" ? "All" : "Όλα"}
                    </Text>
                  </TouchableOpacity>
                  {uniquePlayers.map((player) => (
                    <TouchableOpacity
                      key={player}
                      onPress={() => setSelectedPlayer(player)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedPlayer === player ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          selectedPlayer === player ? "text-white" : "text-foreground"
                        }`}
                      >
                        {player}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Clear Filters Button */}
              {(selectedDate || selectedPlayer) && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(null);
                    setSelectedPlayer(null);
                  }}
                  className="bg-warning rounded-lg py-2 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center text-sm">
                    {language === "en" ? "Clear Filters" : "Εκκαθάριση Φίλτρων"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Matches List */}
          {isLoadingHistory ? (
            <Text className="text-center text-muted py-8">
              {language === "en" ? "Loading..." : "Φόρτωση..."}
            </Text>
          ) : filteredMatches.length === 0 ? (
            <Text className="text-center text-muted py-8">
              {language === "en" ? "No matches found" : "Δεν βρέθηκαν αγώνες"}
            </Text>
          ) : (
            <View>
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
