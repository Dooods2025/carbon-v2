import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { EmissionsData } from '@/types/database';

export function useEmissions(userId: string | undefined) {
  // Fetch all emissions data for user
  const emissionsQuery = useQuery({
    queryKey: ['emissions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('user_id', userId)
        .order('period_start', { ascending: false });

      if (error) throw error;
      return data as EmissionsData[];
    },
    enabled: !!userId,
  });

  // Get latest emissions record
  const latestEmissions = emissionsQuery.data?.[0] ?? null;

  // Get total emissions by category (from latest record)
  const getCategoryData = () => {
    if (!latestEmissions) return [];
    return [
      { name: 'Electricity', value: latestEmissions.electricity_emissions ?? 0, color: '#3b82f6' },
      { name: 'Gas', value: latestEmissions.gas_emissions ?? 0, color: '#f59e0b' },
      { name: 'Fuel', value: latestEmissions.fuel_emissions ?? 0, color: '#ef4444' },
      { name: 'Flights', value: latestEmissions.flights_emissions ?? 0, color: '#8b5cf6' },
      { name: 'Water', value: latestEmissions.water_emissions ?? 0, color: '#06b6d4' },
      { name: 'Waste', value: latestEmissions.waste_emissions ?? 0, color: '#10b981' },
    ];
  };

  // Get scope distribution (from latest record)
  const getScopeData = () => {
    if (!latestEmissions) return [];
    return [
      { name: 'Scope 1', value: latestEmissions.scope1_total ?? 0, color: '#3b82f6' },
      { name: 'Scope 2', value: latestEmissions.scope2_total ?? 0, color: '#10b981' },
      { name: 'Scope 3', value: latestEmissions.scope3_total ?? 0, color: '#f59e0b' },
    ];
  };

  // Get year-over-year data for charts
  const getYearlyData = () => {
    if (!emissionsQuery.data) return [];

    // Group by year
    const byYear = emissionsQuery.data.reduce((acc, record) => {
      if (!record.period_start) return acc;
      const year = new Date(record.period_start).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = {
          year,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        };
      }
      acc[year].scope1 += record.scope1_total ?? 0;
      acc[year].scope2 += record.scope2_total ?? 0;
      acc[year].scope3 += record.scope3_total ?? 0;
      acc[year].total += record.total_emissions ?? 0;
      return acc;
    }, {} as Record<string, { year: string; scope1: number; scope2: number; scope3: number; total: number }>);

    return Object.values(byYear).sort((a, b) => a.year.localeCompare(b.year));
  };

  return {
    emissions: emissionsQuery.data ?? [],
    latestEmissions,
    isLoading: emissionsQuery.isLoading,
    error: emissionsQuery.error,
    getCategoryData,
    getScopeData,
    getYearlyData,
  };
}
