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
          first_name: string | null;
          company_name: string | null;
          abn: string | null;
          contact_email: string | null;
          industry: string | null;
          num_employees: number | null;
          num_sites: number | null;
          business_type: string | null;
          logo_url: string | null;
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
          first_name?: string | null;
          company_name?: string | null;
          abn?: string | null;
          contact_email?: string | null;
          industry?: string | null;
          num_employees?: number | null;
          num_sites?: number | null;
          business_type?: string | null;
          logo_url?: string | null;
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
          first_name?: string | null;
          company_name?: string | null;
          abn?: string | null;
          contact_email?: string | null;
          industry?: string | null;
          num_employees?: number | null;
          num_sites?: number | null;
          business_type?: string | null;
          logo_url?: string | null;
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
        Relationships: [];
      };
      emissions_data: {
        Row: {
          id: string;
          user_id: string;
          report_period: string;
          period_start: string;
          period_end: string;
          electricity_emissions: number;
          gas_emissions: number;
          fuel_emissions: number;
          flights_emissions: number;
          water_emissions: number;
          waste_emissions: number;
          scope1_total: number;
          scope2_total: number;
          scope3_total: number;
          total_emissions: number;
          site_breakdown: Json | null;
          source_file: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_period?: string;
          period_start?: string;
          period_end?: string;
          electricity_emissions?: number;
          gas_emissions?: number;
          fuel_emissions?: number;
          flights_emissions?: number;
          water_emissions?: number;
          waste_emissions?: number;
          scope1_total?: number;
          scope2_total?: number;
          scope3_total?: number;
          total_emissions?: number;
          site_breakdown?: Json | null;
          source_file?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_period?: string;
          period_start?: string;
          period_end?: string;
          electricity_emissions?: number;
          gas_emissions?: number;
          fuel_emissions?: number;
          flights_emissions?: number;
          water_emissions?: number;
          waste_emissions?: number;
          scope1_total?: number;
          scope2_total?: number;
          scope3_total?: number;
          total_emissions?: number;
          site_breakdown?: Json | null;
          source_file?: string | null;
        };
        Relationships: [];
      };
      scenarios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          baseline_emissions: number;
          reductions: Json | null;
          target_emissions: number;
          target_reduction: number | null;
          target_year: number | null;
          reduction_percentage: number;
          timeline_months: number;
          target_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          baseline_emissions?: number;
          reductions?: Json | null;
          target_emissions?: number;
          target_reduction?: number | null;
          target_year?: number | null;
          reduction_percentage?: number;
          timeline_months?: number;
          target_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          baseline_emissions?: number;
          reductions?: Json | null;
          target_emissions?: number;
          target_reduction?: number | null;
          target_year?: number | null;
          reduction_percentage?: number;
          timeline_months?: number;
          target_date?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_reports: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          report_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          report_data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          report_data?: Json;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier use
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];
export type EmissionsData = Database['public']['Tables']['emissions_data']['Row'];
export type Scenario = Database['public']['Tables']['scenarios']['Row'];
export type UserReport = Database['public']['Tables']['user_reports']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type InsertBusinessProfile = Database['public']['Tables']['business_profiles']['Insert'];
export type InsertEmissionsData = Database['public']['Tables']['emissions_data']['Insert'];
export type InsertScenario = Database['public']['Tables']['scenarios']['Insert'];
export type InsertUserReport = Database['public']['Tables']['user_reports']['Insert'];
export type InsertProfile = Database['public']['Tables']['profiles']['Insert'];

export type UpdateBusinessProfile = Database['public']['Tables']['business_profiles']['Update'];
export type UpdateEmissionsData = Database['public']['Tables']['emissions_data']['Update'];
export type UpdateScenario = Database['public']['Tables']['scenarios']['Update'];
export type UpdateUserReport = Database['public']['Tables']['user_reports']['Update'];
export type UpdateProfile = Database['public']['Tables']['profiles']['Update'];
