// app/live-match.tsx
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useTennisApi } from "@/hooks/use-tennis-api";
import { ScoreInput } from "@/components/score-input";
import { DurationInput } from "@/components/duration-input";
import { useNotifications } from "@/hooks/use-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LiveMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { showSuccess, showError, hapticButton } = useNotifications();

  // Only admin check
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("user_role");
      if (role !== "admin") {
        Alert.alert("Access denied", "Only the admin can record matches.");
        router.replace("/(tabs)");
      }
    })();
  }, [router]);

  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<number | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEditingDuration, setIsEditingDuration] = useState(false);

  const { saveMatchAsync, deleteMatchAsync } = useTennisApi();

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => setShowUndo(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleEndMatch = async () => {
    await hapticButton();

    let winner = 0;
    if (team1Sets > team2Sets) winner = 1;
    else if (team2Sets > team1Sets) winner = 2;
    else {
      showError("Σφάλμα", "Ο αγώνας δεν είναι ολοκληρωμένος");
      return;
    }

    setIsSaving(true);
    setIsTimerRunning(false);

    try {
      const username = await AsyncStorage.getItem("username") || undefined;
      const result = await saveMatchAsync({
        team1Player1: params.team1Player1 as string,
        team1Player2: params.team1Player2 as string,
        team2Player1: params.team2Player1 as string,
        team2Player2: params.team2Player2 as string,
        team1Sets, team2Sets, team1Games, team2Games,
        winner, durationSeconds: elapsedSeconds,
        username,
      });

      if (result?.id) setLastMatchId(result.id);
      setShowUndo(true);

      showSuccess("Επιτυχία!", "Ο αγώνας αποθηκεύτηκε επιτυχώς!");
    } catch (error: any) {
      showError("Σφάλμα", error?.message || "Αποτυχία αποθήκευσης");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = async () => {
    if (!lastMatchId) return;
    await hapticButton();
    setIsUndoing(true);

    try {
      const username = await AsyncStorage.getItem("username") || undefined;
      await deleteMatchAsync({ matchId: lastMatchId, username });
      showSuccess("Αναίρεση", "Ο αγώνας διαγράφηκε");
      setShowUndo(false);
      setLastMatchId(null);
    } catch (error: any) {
      showError("Σφάλμα", error?.message || "Αποτυχία αναίρεσης");
    } finally {
      setIsUndoing(false);
    }
  };

  const handleResetScores = async () => {
    await hapticButton();
    // ... (Alert reset παραμένει ίδιο)
    Alert.alert("Reset Scores", "Reset all scores to 0?", [
      { text: "Cancel" },
      { 
        text: "Reset", 
        style: "destructive", 
        onPress: () => {
          setTeam1Sets(0); setTeam2Sets(0);
          setTeam1Games(0); setTeam2Games(0);
        }
      },
    ]);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header, Timer, Score Cards... (παραμένουν ίδια) */}

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

            <TouchableOpacity onPress={handleResetScores} className="bg-warning rounded-lg py-4 active:opacity-80">
              <Text className="text-white font-bold text-center">Reset Scores</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
