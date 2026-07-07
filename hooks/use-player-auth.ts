import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CurrentPlayer {
  username: string;
  name: string;
  role: "admin" | "user";
}

/**
 * Hook to manage current player login state
 */
export function usePlayerAuth() {
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer | null>(null);
  const [loading, setLoading] = useState(true);

  // Load player from storage on mount
  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const playerJson = await AsyncStorage.getItem("currentPlayer");
        if (playerJson) {
          setCurrentPlayer(JSON.parse(playerJson));
        }
      } catch (error) {
        console.error("Failed to load player from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, []);

  // Save player login
  const login = useCallback(async (username: string, name: string, role: "admin" | "user") => {
    const player: CurrentPlayer = { username, name, role };
    setCurrentPlayer(player);
    await AsyncStorage.setItem("currentPlayer", JSON.stringify(player));
  }, []);

  // Clear player logout
  const logout = useCallback(async () => {
    setCurrentPlayer(null);
    await AsyncStorage.removeItem("currentPlayer");
  }, []);

  // Check if current player is admin
  const isAdmin = useCallback(() => {
    return currentPlayer?.role === "admin";
  }, [currentPlayer]);

  return {
    currentPlayer,
    loading,
    login,
    logout,
    isAdmin,
  };
}
