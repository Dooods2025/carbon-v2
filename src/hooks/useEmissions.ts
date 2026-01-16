import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { EmissionsData } from '@/types/database';

// Helper to ensure value is a number
const toNum = (val: unknown): number => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

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
      { name: 'Electricity', value: toNum(latestEmissions.electricity_emissions), color: '#3b82f6' },
      { name: 'Gas', value: toNum(latestEmissions.gas_emissions), color: '#f59e0b' },
      { name: 'Fuel', value: toNum(latestEmissions.fuel_emissions), color: '#ef4444' },
      { name: 'Flights', value: toNum(latestEmissions.flights_emissions), color: '#8b5cf6' },
      { name: 'Water', value: toNum(latestEmissions.water_emissions), color: '#06b6d4' },
      { name: 'Waste', value: toNum(latestEmissions.waste_emissions), color: '#10b981' },
    ];
  };

  // Get scope distribution (from latest record)
  const getScopeData = () => {
    if (!latestEmissions) return [];
    return [
      { name: 'Scope 1', value: toNum(latestEmissions.scope1_total), color: '#3b82f6' },
      { name: 'Scope 2', value: toNum(latestEmissions.scope2_total), color: '#10b981' },
      { name: 'Scope 3', value: toNum(latestEmissions.scope3_total), color: '#f59e0b' },
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
      acc[year].scope1 += toNum(record.scope1_total);
      acc[year].scope2 += toNum(record.scope2_total);
      acc[year].scope3 += toNum(record.scope3_total);
      acc[year].total += toNum(record.total_emissions);
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
