import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { HomeButton } from "@/components/home-button";
import { useTennisApi } from "@/hooks/use-tennis-api";
import { ScoreInput } from "@/components/score-input";
import { DurationInput } from "@/components/duration-input";

export default function LiveMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<number | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEditingDuration, setIsEditingDuration] = useState(false);

  const { saveMatchAsync, deleteMatchAsync } = useTennisApi();

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Auto-hide undo button after 30 seconds
  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => {
        setShowUndo(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleEndMatch = async () => {
    let winner = 0;
    if (team1Sets > team2Sets) winner = 1;
    else if (team2Sets > team1Sets) winner = 2;
    else {
      Alert.alert("Error", "Match is not complete. One team must win more sets.");
      return;
    }

    setIsSaving(true);
    setIsTimerRunning(false);
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
        durationSeconds: elapsedSeconds,
      };

      console.log("[Match Save] Starting match save with data:", matchData);

      const result = await saveMatchAsync(matchData);

      console.log("[Match Save] Success! Result:", result);

      // Extract match ID from result if available
      if (result && typeof result === "object" && "id" in result) {
        setLastMatchId((result as any).id);
      }

      setShowUndo(true);

      Alert.alert("Success", "Match saved! You can undo this action for 30 seconds.", [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error: any) {
      console.error("[Match Save] Error:", error);
      const errorMessage = error?.message || "Failed to save match. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = async () => {
    if (!lastMatchId) {
      Alert.alert("Error", "No match to undo");
      return;
    }

    setIsUndoing(true);
    try {
      await deleteMatchAsync({ matchId: lastMatchId });

      setShowUndo(false);
      setLastMatchId(null);

      Alert.alert("Undo Successful", "Match has been deleted.", [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error: any) {
      console.error("[Match Undo] Error:", error);
      const errorMessage = error?.message || "Failed to undo match. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsUndoing(false);
    }
  };

  const handleResetScores = () => {
    Alert.alert("Reset Scores", "Reset all scores to 0?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Reset",
        onPress: () => {
          setTeam1Sets(0);
          setTeam2Sets(0);
          setTeam1Games(0);
          setTeam2Games(0);
        },
        style: "destructive",
      },
    ]);
  };

  const goHome = () => {
    try {
      router.dismissTo("/");
    } catch {
      router.replace("/");
    }
  };

  const handleGoHome = () => {
    const hasProgress = team1Sets > 0 || team2Sets > 0 || team1Games > 0 || team2Games > 0 || elapsedSeconds > 0;
    if (hasProgress) {
      Alert.alert(
        "Έξοδος από τον αγώνα",
        "Ο αγώνας δεν έχει αποθηκευτεί. Θέλετε σίγουρα να επιστρέψετε στην αρχική σελίδα;",
        [
          { text: "Ακύρωση", onPress: () => {} },
          { text: "Έξοδος", style: "destructive", onPress: goHome },
        ]
      );
    } else {
      goHome();
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Match Header */}
          <View className="gap-2">
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={handleGoHome}
                className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center active:opacity-80"
                accessibilityLabel="Αρχική σελίδα"
              >
                <Text className="text-foreground text-lg">🏠</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-foreground text-center">Live Match</Text>
            <Text className="text-xs text-foreground text-center">
              {params.team1Player1} & {params.team1Player2} vs {params.team2Player1} & {params.team2Player2}
            </Text>
          </View>

          {/* Timer Display */}
          <View className="bg-primary rounded-2xl p-6 items-center gap-3">
            <Text className="text-sm font-bold text-white">Match Duration</Text>

            {isEditingDuration ? (
              <View className="w-full gap-3">
                <DurationInput totalSeconds={elapsedSeconds} onChange={setElapsedSeconds} />
                <TouchableOpacity
                  onPress={() => setIsEditingDuration(false)}
                  className="bg-white rounded-lg py-2 active:opacity-80"
                >
                  <Text className="text-primary font-bold text-center text-sm">✓ Έτοιμο (Done)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className="text-5xl font-bold text-white font-mono">{formatTime(elapsedSeconds)}</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex-1 rounded-lg py-2 active:opacity-80 ${
                      isTimerRunning ? "bg-error" : "bg-success"
                    }`}
                  >
                    <Text className="text-white font-bold text-center text-sm">
                      {isTimerRunning ? "Pause" : "Start"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsTimerRunning(false);
                      setIsEditingDuration(true);
                    }}
                    className="flex-1 bg-black/25 border border-white/40 rounded-lg py-2 active:opacity-60"
                  >
                    <Text className="text-white font-bold text-center text-sm">✏️ Πληκτρολόγηση</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setElapsedSeconds(0);
                      setIsTimerRunning(false);
                    }}
                    className="flex-1 bg-black/25 border border-white/40 rounded-lg py-2 active:opacity-60"
                  >
                    <Text className="text-white font-bold text-center text-sm">Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Team 1 Score Card */}
          <View className="bg-primary rounded-2xl p-6 gap-4">
            <View className="gap-1">
              <Text className="text-sm font-bold text-white">Team 1</Text>
              <Text className="text-xs text-white">
                {params.team1Player1} & {params.team1Player2}
              </Text>
            </View>

            {/* Sets and Games Display - tap the number to type it directly */}
            <View className="flex-row gap-4">
              <ScoreInput value={team1Sets} onChange={setTeam1Sets} label="Sets" colorClassName="text-primary" />
              <ScoreInput value={team1Games} onChange={setTeam1Games} label="Games" colorClassName="text-primary" />
            </View>

            {/* Score Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTeam1Games(Math.max(0, team1Games - 1))}
                className="flex-1 bg-black/25 border border-white/40 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam1Games(team1Games + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-primary font-bold text-center">+1 Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam1Sets(team1Sets + 1)}
                className="flex-1 bg-white rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-primary font-bold text-center">+1 Set</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTeam1Sets(Math.max(0, team1Sets - 1))}
                className="flex-1 bg-black/25 border border-white/40 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Team 2 Score Card */}
          <View className="bg-error rounded-2xl p-6 gap-4">
            <View className="gap-1">
              <Text className="text-sm font-bold text-white">Team 2</Text>
              <Text className="text-xs text-white">
                {params.team2Player1} & {params.team2Player2}
              </Text>
            </View>

            {/* Sets and Games Display - tap the number to type it directly */}
            <View className="flex-row gap-4">
              <ScoreInput value={team2Sets} onChange={setTeam2Sets} label="Sets" colorClassName="text-error" />
              <ScoreInput value={team2Games} onChange={setTeam2Games} label="Games" colorClassName="text-error" />
            </View>

            {/* Score Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTeam2Games(Math.max(0, team2Games - 1))}
                className="flex-1 bg-black/25 border border-white/40 rounded-lg py-3 active:opacity-60"
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
                className="flex-1 bg-black/25 border border-white/40 rounded-lg py-3 active:opacity-60"
              >
                <Text className="text-white font-bold text-center">-1 Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleEndMatch}
              disabled={isSaving}
              className="bg-primary rounded-lg py-4 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-white font-bold text-center text-lg">
                {isSaving ? "Saving..." : "End Match"}
              </Text>
            </TouchableOpacity>

            {showUndo && (
              <TouchableOpacity
                onPress={handleUndo}
                disabled={isUndoing}
                className="bg-warning rounded-lg py-4 active:opacity-80 disabled:opacity-50"
              >
                <Text className="text-white font-bold text-center">
                  {isUndoing ? "Undoing..." : "Αναίρεση (Undo)"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleResetScores}
              className="bg-warning rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-white font-bold text-center">Reset Scores</Text>
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
