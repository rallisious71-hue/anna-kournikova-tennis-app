import { trpc } from "@/lib/trpc";

/**
 * Hook for tennis app API calls
 */
export function useTennisApi() {
  const saveMatchMutation = trpc.tennis.saveMatch.useMutation();
  const updateMatchMutation = trpc.tennis.updateMatch.useMutation();
  const getPlayerStatsQuery = trpc.tennis.getPlayerStats.useQuery();
  const getMatchHistoryQuery = trpc.tennis.getMatchHistory.useQuery();
  const deleteMatchMutation = trpc.tennis.deleteMatch.useMutation();

  return {
    // Mutations
    saveMatch: saveMatchMutation.mutate,
    saveMatchAsync: saveMatchMutation.mutateAsync,
    isSavingMatch: saveMatchMutation.isPending,

    updateMatch: updateMatchMutation,
    updateMatchAsync: updateMatchMutation.mutateAsync,
    isUpdatingMatch: updateMatchMutation.isPending,

    deleteMatch: deleteMatchMutation.mutate,
    deleteMatchAsync: deleteMatchMutation.mutateAsync,
    isDeletingMatch: deleteMatchMutation.isPending,

    // Queries
    playerStats: getPlayerStatsQuery.data || [],
    isLoadingStats: getPlayerStatsQuery.isLoading,

    matchHistory: getMatchHistoryQuery.data || [],
    isLoadingHistory: getMatchHistoryQuery.isLoading,

    // Refetch
    refetchStats: getPlayerStatsQuery.refetch,
    refetchHistory: getMatchHistoryQuery.refetch,
  };
}
