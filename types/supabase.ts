export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          role: "admin" | "news_manager" | "moderator" | "member"
          license_number: string | null
          membership_status: "active" | "pending" | "expired"
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "news_manager" | "moderator" | "member"
          license_number?: string | null
          membership_status?: "active" | "pending" | "expired"
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "news_manager" | "moderator" | "member"
          license_number?: string | null
          membership_status?: "active" | "pending" | "expired"
        }
      }
      news: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          author_id: string
          published: boolean
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          author_id: string
          published?: boolean
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          author_id?: string
          published?: boolean
          image_url?: string | null
        }
      }
      forum_categories: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          order?: number
        }
      }
      forum_topics: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          author_id: string
          category_id: string
          pinned: boolean
          locked: boolean
          views: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          author_id: string
          category_id: string
          pinned?: boolean
          locked?: boolean
          views?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          author_id?: string
          category_id?: string
          pinned?: boolean
          locked?: boolean
          views?: number
        }
      }
      forum_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          content: string
          author_id: string
          topic_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          content: string
          author_id: string
          topic_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          content?: string
          author_id?: string
          topic_id?: string
        }
      }
      classifieds: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          price: number
          seller_id: string
          category: string
          condition: "new" | "like_new" | "good" | "fair" | "poor"
          status: "active" | "sold" | "expired"
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          price: number
          seller_id: string
          category: string
          condition: "new" | "like_new" | "good" | "fair" | "poor"
          status?: "active" | "sold" | "expired"
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          price?: number
          seller_id?: string
          category?: string
          condition?: "new" | "like_new" | "good" | "fair" | "poor"
          status?: "active" | "sold" | "expired"
        }
      }
      classified_images: {
        Row: {
          id: string
          created_at: string
          classified_id: string
          url: string
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          classified_id: string
          url: string
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          classified_id?: string
          url?: string
          order?: number
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          organizer_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          organizer_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          organizer_id?: string
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
      [_ in never]: never
    }
  }
}

