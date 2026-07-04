import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";

export default function NewMatchScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [team1Player1, setTeam1Player1] = useState("");
  const [team1Player2, setTeam1Player2] = useState("");
  const [team2Player1, setTeam2Player1] = useState("");
  const [team2Player2, setTeam2Player2] = useState("");
  const [showPlayerList, setShowPlayerList] = useState<string | null>(null);

  const { data: players = [] } = trpc.players.getAllPlayers.useQuery();

  const handleSelectPlayer = (playerName: string) => {
    if (showPlayerList === "team1Player1") setTeam1Player1(playerName);
    else if (showPlayerList === "team1Player2") setTeam1Player2(playerName);
    else if (showPlayerList === "team2Player1") setTeam2Player1(playerName);
    else if (showPlayerList === "team2Player2") setTeam2Player2(playerName);
    setShowPlayerList(null);
  };

  const handleStartMatch = () => {
    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2) {
      Alert.alert(t("error", language), t("pleaseEnterAllPlayers", language));
      return;
    }

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

  const renderPlayerInput = (label: string, value: string, field: string) => (
    <View>
      <Text className="text-sm font-medium text-muted mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setShowPlayerList(field)}
        className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
      >
        <Text className={value ? "text-foreground" : "text-muted"}>
          {value || t("selectPlayer", language)}
        </Text>
        <Text className="text-muted">▼</Text>
      </TouchableOpacity>
    </View>
  );

  if (showPlayerList) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">{t("selectPlayer", language)}</Text>
            <TouchableOpacity onPress={() => setShowPlayerList(null)}>
              <Text className="text-2xl text-foreground">✕</Text>
            </TouchableOpacity>
          </View>
          {players.length > 0 ? (
            <FlatList
              data={players}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectPlayer(item.name)}
                  className="bg-surface border border-border rounded-lg p-4 mb-2"
                >
                  <Text className="text-foreground font-medium">{item.name}</Text>
                  <Text className="text-sm text-muted">@{item.username}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-3">
              <Text className="text-4xl">👥</Text>
              <Text className="text-foreground font-semibold">No players registered</Text>
              <Text className="text-muted text-sm text-center">Please register players first</Text>
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">{t("newMatchTitle", language)}</Text>
            <Text className="text-sm text-muted">{t("newMatchSubtitle", language)}</Text>
          </View>

          {/* Team 1 */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">{t("team", language)} 1</Text>
            {renderPlayerInput(`${t("player", language)} 1`, team1Player1, "team1Player1")}
            {renderPlayerInput(`${t("player", language)} 2`, team1Player2, "team1Player2")}
          </View>

          {/* Team 2 */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">{t("team", language)} 2</Text>
            {renderPlayerInput(`${t("player", language)} 1`, team2Player1, "team2Player1")}
            {renderPlayerInput(`${t("player", language)} 2`, team2Player2, "team2Player2")}
          </View>

          {/* Start Match Button */}
          <TouchableOpacity
            onPress={handleStartMatch}
            className="bg-primary rounded-lg py-4 active:opacity-80 mt-4"
          >
            <Text className="text-white font-bold text-center text-lg">{t("startMatch", language)}</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-surface border border-border rounded-lg py-4 active:opacity-80"
          >
            <Text className="text-foreground font-semibold text-center">{t("back", language)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
