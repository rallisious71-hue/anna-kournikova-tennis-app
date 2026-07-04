import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n/translations";

export default function EditMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language } = useLanguage();

  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const { updateMatch: updateMatchMutation } = useTennisApi();

  useEffect(() => {
    if (params.team1Sets) setTeam1Sets(parseInt(params.team1Sets as string));
    if (params.team2Sets) setTeam2Sets(parseInt(params.team2Sets as string));
    if (params.team1Games) setTeam1Games(parseInt(params.team1Games as string));
    if (params.team2Games) setTeam2Games(parseInt(params.team2Games as string));
  }, [params]);

  const handleSaveChanges = async () => {
    if (team1Sets === 0 && team2Sets === 0) {
      Alert.alert(t("error", language), "At least one team must have won sets");
      return;
    }

    setIsSaving(true);
    try {
      await updateMatchMutation.mutateAsync({
        matchId: parseInt(params.matchId as string),
        team1Sets,
        team2Sets,
        team1Games,
        team2Games,
      });

      Alert.alert(t("success", language), "Match updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(t("error", language), error.message || "Failed to update match");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground text-center">Edit Match</Text>
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
              <TouchableOpacity
                onPress={() => setTeam1Sets(Math.max(0, team1Sets - 1))}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Set</Text>
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
              <TouchableOpacity
                onPress={() => setTeam2Sets(Math.max(0, team2Sets - 1))}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleSaveChanges}
              disabled={isSaving}
              className="bg-primary rounded-lg py-4 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-white font-bold text-center text-lg">
                {isSaving ? "Saving..." : "Save Changes"}
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
