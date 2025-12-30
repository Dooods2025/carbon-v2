export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          abn: string | null;
          contact_email: string | null;
          industry: string | null;
          num_employees: number | null;
          num_sites: number | null;
          business_type: string | null;
          building_type: string | null;
          operating_hours: string | null;
          energy_sources: string | null;
          has_fleet: boolean;
          fleet_size: string | null;
          fleet_type: string | null;
          sustainability_initiatives: string | null;
          sustainability_goal: string | null;
          budget_appetite: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          abn?: string | null;
          contact_email?: string | null;
          industry?: string | null;
          num_employees?: number | null;
          num_sites?: number | null;
          business_type?: string | null;
          building_type?: string | null;
          operating_hours?: string | null;
          energy_sources?: string | null;
          has_fleet?: boolean;
          fleet_size?: string | null;
          fleet_type?: string | null;
          sustainability_initiatives?: string | null;
          sustainability_goal?: string | null;
          budget_appetite?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string | null;
          abn?: string | null;
          contact_email?: string | null;
          industry?: string | null;
          num_employees?: number | null;
          num_sites?: number | null;
          business_type?: string | null;
          building_type?: string | null;
          operating_hours?: string | null;
          energy_sources?: string | null;
          has_fleet?: boolean;
          fleet_size?: string | null;
          fleet_type?: string | null;
          sustainability_initiatives?: string | null;
          sustainability_goal?: string | null;
          budget_appetite?: string | null;
          updated_at?: string;
        };
      };
      emissions_data: {
        Row: {
          id: string;
          user_id: string;
          report_period: string | null;
          period_start: string | null;
          period_end: string | null;
          electricity_emissions: number | null;
          gas_emissions: number | null;
          fuel_emissions: number | null;
          flights_emissions: number | null;
          water_emissions: number | null;
          waste_emissions: number | null;
          scope1_total: number | null;
          scope2_total: number | null;
          scope3_total: number | null;
          total_emissions: number | null;
          site_breakdown: Json | null;
          source_file: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_period?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          electricity_emissions?: number | null;
          gas_emissions?: number | null;
          fuel_emissions?: number | null;
          flights_emissions?: number | null;
          water_emissions?: number | null;
          waste_emissions?: number | null;
          scope1_total?: number | null;
          scope2_total?: number | null;
          scope3_total?: number | null;
          total_emissions?: number | null;
          site_breakdown?: Json | null;
          source_file?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_period?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          electricity_emissions?: number | null;
          gas_emissions?: number | null;
          fuel_emissions?: number | null;
          flights_emissions?: number | null;
          water_emissions?: number | null;
          waste_emissions?: number | null;
          scope1_total?: number | null;
          scope2_total?: number | null;
          scope3_total?: number | null;
          total_emissions?: number | null;
          site_breakdown?: Json | null;
          source_file?: string | null;
        };
      };
      scenarios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          baseline_emissions: number | null;
          reductions: Json | null;
          target_emissions: number | null;
          reduction_percentage: number | null;
          timeline_months: number | null;
          target_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          baseline_emissions?: number | null;
          reductions?: Json | null;
          target_emissions?: number | null;
          reduction_percentage?: number | null;
          timeline_months?: number | null;
          target_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          baseline_emissions?: number | null;
          reductions?: Json | null;
          target_emissions?: number | null;
          reduction_percentage?: number | null;
          timeline_months?: number | null;
          target_date?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper types for easier use
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];
export type EmissionsData = Database['public']['Tables']['emissions_data']['Row'];
export type Scenario = Database['public']['Tables']['scenarios']['Row'];

export type InsertBusinessProfile = Database['public']['Tables']['business_profiles']['Insert'];
export type InsertEmissionsData = Database['public']['Tables']['emissions_data']['Insert'];
export type InsertScenario = Database['public']['Tables']['scenarios']['Insert'];

export type UpdateBusinessProfile = Database['public']['Tables']['business_profiles']['Update'];
export type UpdateEmissionsData = Database['public']['Tables']['emissions_data']['Update'];
export type UpdateScenario = Database['public']['Tables']['scenarios']['Update'];
