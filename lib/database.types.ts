export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          client_id: string
          employee_id: string | null
          service_id: string
          vehicle_details: string
          scheduled_time: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          employee_id?: string | null
          service_id: string
          vehicle_details: string
          scheduled_time: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          employee_id?: string | null
          service_id?: string
          vehicle_details?: string
          scheduled_time?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          duration: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          duration: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          duration?: string
          price?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'client' | 'employee'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'client' | 'employee'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'client' | 'employee'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'client' | 'employee'
      appointment_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    }
  }
}