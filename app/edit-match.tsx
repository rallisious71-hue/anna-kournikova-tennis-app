// app/edit-match.tsx
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { HomeButton } from "@/components/home-button";
import { useTennisApi } from "@/hooks/use-tennis-api";
import { useNotifications } from "@/hooks/use-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { showSuccess, showError, hapticButton } = useNotifications();

  // Admin check
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("user_role");
      if (role !== "admin") {
        Alert.alert("Access denied", "Only the admin can edit matches.");
        router.replace("/(tabs)");
      }
    })();
  }, [router]);

  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const { updateMatch: updateMatchMutation } = useTennisApi();

  useEffect(() => {
    if (params.team1Sets) setTeam1Sets(parseInt(params.team1Sets as string));
    // ... άλλα params
  }, [params]);

  const handleSaveChanges = async () => {
    await hapticButton();
    if (team1Sets === 0 && team2Sets === 0) {
      showError("Σφάλμα", "Πρέπει να υπάρχει νικητής");
      return;
    }

    setIsSaving(true);
    try {
      const username = await AsyncStorage.getItem("username") || undefined;
      await updateMatchMutation.mutateAsync({
        matchId: parseInt(params.matchId as string),
        team1Sets, team2Sets, team1Games, team2Games, durationSeconds, username
      });

      showSuccess("Επιτυχία!", "Ο αγώνας ενημερώθηκε");
      router.back();
    } catch (error: any) {
      showError("Σφάλμα", error.message || "Αποτυχία ενημέρωσης");
    } finally {
      setIsSaving(false);
    }
  };

  // ... υπόλοιπο component (Score Inputs, Buttons) παραμένει ίδιο
}
