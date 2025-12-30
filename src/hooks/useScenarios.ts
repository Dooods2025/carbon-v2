import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Scenario, InsertScenario, UpdateScenario } from '@/types/database';

export function useScenarios(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch all scenarios for user
  const scenariosQuery = useQuery({
    queryKey: ['scenarios', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Scenario[];
    },
    enabled: !!userId,
  });

  // Create scenario
  const createScenario = useMutation({
    mutationFn: async (scenario: Omit<InsertScenario, 'user_id'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('scenarios')
        .insert({ ...scenario, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data as Scenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });

  // Update scenario
  const updateScenario = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateScenario }) => {
      const { data, error } = await supabase
        .from('scenarios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Scenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });

  // Delete scenario
  const deleteScenario = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });

  // Set active scenario (deactivate others)
  const setActiveScenario = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');

      // Deactivate all scenarios for user
      await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Activate the selected one
      const { data, error } = await supabase
        .from('scenarios')
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Scenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });

  return {
    scenarios: scenariosQuery.data ?? [],
    isLoading: scenariosQuery.isLoading,
    error: scenariosQuery.error,
    createScenario,
    updateScenario,
    deleteScenario,
    setActiveScenario,
  };
}
