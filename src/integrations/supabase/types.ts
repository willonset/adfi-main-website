export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body_en: string
          body_vi: string
          category_en: string
          category_vi: string
          cover_url: string
          created_at: string
          excerpt_en: string
          excerpt_vi: string
          id: string
          is_published: boolean
          published_at: string
          slug: string
          title_en: string
          title_vi: string
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_vi?: string
          category_en?: string
          category_vi?: string
          cover_url?: string
          created_at?: string
          excerpt_en?: string
          excerpt_vi?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title_en?: string
          title_vi?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_vi?: string
          category_en?: string
          category_vi?: string
          cover_url?: string
          created_at?: string
          excerpt_en?: string
          excerpt_vi?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title_en?: string
          title_vi?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          cv_filename: string
          cv_path: string
          email: string
          fullname: string
          id: string
          intro: string
          job_id: string | null
          lang: string
          notes: string
          phone: string
          position: string
          source_other: string
          sources: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_filename?: string
          cv_path?: string
          email?: string
          fullname?: string
          id?: string
          intro?: string
          job_id?: string | null
          lang?: string
          notes?: string
          phone?: string
          position?: string
          source_other?: string
          sources?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_filename?: string
          cv_path?: string
          email?: string
          fullname?: string
          id?: string
          intro?: string
          job_id?: string | null
          lang?: string
          notes?: string
          phone?: string
          position?: string
          source_other?: string
          sources?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits_en: string[]
          benefits_vi: string[]
          created_at: string
          deadline: string | null
          department: string
          description_en: string
          description_vi: string
          employment_type: string
          id: string
          is_open: boolean
          location_en: string
          location_vi: string
          requirements_en: string[]
          requirements_vi: string[]
          salary_en: string | null
          salary_vi: string | null
          slug: string
          sort_order: number
          title_en: string
          title_vi: string
          updated_at: string
        }
        Insert: {
          benefits_en?: string[]
          benefits_vi?: string[]
          created_at?: string
          deadline?: string | null
          department: string
          description_en?: string
          description_vi?: string
          employment_type: string
          id?: string
          is_open?: boolean
          location_en?: string
          location_vi?: string
          requirements_en?: string[]
          requirements_vi?: string[]
          salary_en?: string | null
          salary_vi?: string | null
          slug: string
          sort_order?: number
          title_en: string
          title_vi: string
          updated_at?: string
        }
        Update: {
          benefits_en?: string[]
          benefits_vi?: string[]
          created_at?: string
          deadline?: string | null
          department?: string
          description_en?: string
          description_vi?: string
          employment_type?: string
          id?: string
          is_open?: boolean
          location_en?: string
          location_vi?: string
          requirements_en?: string[]
          requirements_vi?: string[]
          salary_en?: string | null
          salary_vi?: string | null
          slug?: string
          sort_order?: number
          title_en?: string
          title_vi?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          lang: string
          message: string
          name: string
          notes: string
          phone: string
          role: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          lang?: string
          message?: string
          name?: string
          notes?: string
          phone?: string
          role?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lang?: string
          message?: string
          name?: string
          notes?: string
          phone?: string
          role?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_owner: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "owner"],
    },
  },
} as const
