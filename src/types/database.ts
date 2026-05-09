export type IdentityTag =
  | 'Lesbian'
  | 'Bisexual'
  | 'Queer'
  | 'Pansexual'
  | 'Sapphic'
  | 'Non-binary'
  | 'Trans woman'
  | 'Femme'
  | 'Butch'
  | 'Stud'
  | 'Soft butch'
  | 'Chapstick';

export type LookingForTag =
  | 'Hookup'
  | 'Dating'
  | 'Friends'
  | 'Long-term'
  | 'Casual'
  | 'Open to anything'
  | 'Networking';

export interface DbUser {
  id: string;
  email: string;
  display_name: string;
  age: number;
  bio: string | null;
  identity_tags: IdentityTag[];
  looking_for_tags: LookingForTag[];
  is_verified: boolean;
  is_incognito: boolean;
  hide_profile: boolean;
  show_exact_distance: boolean;
  last_seen_at: string;
  created_at: string;
  location?: { lat: number; lng: number } | null;
}

export interface DbPhoto {
  id: string;
  user_id: string;
  url: string;
  order_index: number;
  is_primary: boolean;
  is_flagged: boolean;
}

export interface DbMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  sent_at: string;
  read_at: string | null;
  photo_url: string | null;
}

export interface DbConversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_id: string | null;
  updated_at: string;
}

export interface DbLike {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
}

export interface DbBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface DbReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  detail: string | null;
  created_at: string;
  reviewed: boolean;
}

// Enriched types used in-app (joined data)
export interface UserProfile extends DbUser {
  photos: DbPhoto[];
  primary_photo_url?: string;
  distance_km?: number;
  is_online?: boolean;
}

export interface ConversationWithUser extends DbConversation {
  other_user: UserProfile;
  last_message?: DbMessage;
  unread_count: number;
}

export type ReportReason =
  | 'Fake profile'
  | 'Harassment'
  | 'Underage'
  | 'Spam'
  | 'Inappropriate content'
  | 'Other';
