-- SZR Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  display_name  TEXT,
  age           INTEGER CHECK (age >= 18),
  bio           TEXT,
  identity_tags TEXT[] DEFAULT '{}',
  looking_for_tags TEXT[] DEFAULT '{}',
  is_verified   BOOLEAN DEFAULT FALSE,
  is_incognito  BOOLEAN DEFAULT FALSE,
  hide_profile  BOOLEAN DEFAULT FALSE,
  show_exact_distance BOOLEAN DEFAULT FALSE,
  last_seen_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  location      GEOGRAPHY(POINT, 4326)
);

CREATE TABLE IF NOT EXISTS public.photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE,
  is_flagged  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT,
  sent_at     TIMESTAMPTZ DEFAULT NOW(),
  read_at     TIMESTAMPTZ,
  photo_url   TEXT
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS public.likes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE TABLE IF NOT EXISTS public.blocks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason           TEXT NOT NULL,
  detail           TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  reviewed         BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST(location);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports     ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view non-hidden profiles" ON public.users
  FOR SELECT USING (
    hide_profile = FALSE
    AND is_incognito = FALSE
    AND id NOT IN (
      SELECT blocked_id FROM public.blocks WHERE blocker_id = auth.uid()
    )
    AND id NOT IN (
      SELECT blocker_id FROM public.blocks WHERE blocked_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Photos policies
CREATE POLICY "Anyone can view non-flagged photos" ON public.photos
  FOR SELECT USING (is_flagged = FALSE);

CREATE POLICY "Users can view flagged own photos" ON public.photos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own photos" ON public.photos
  FOR ALL USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages (read receipts)" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Likes policies
CREATE POLICY "Users can view received likes" ON public.likes
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can create likes" ON public.likes
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can delete own likes" ON public.likes
  FOR DELETE USING (from_user_id = auth.uid());

-- Blocks policies
CREATE POLICY "Users can view own blocks" ON public.blocks
  FOR SELECT USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks" ON public.blocks
  FOR INSERT WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can delete own blocks" ON public.blocks
  FOR DELETE USING (blocker_id = auth.uid());

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (reporter_id = auth.uid());

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, last_seen_at, created_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update last_seen_at
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users SET last_seen_at = NOW() WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get or create conversation between two users
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(other_user_id UUID)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
  u1 UUID := LEAST(auth.uid(), other_user_id);
  u2 UUID := GREATEST(auth.uid(), other_user_id);
BEGIN
  SELECT id INTO conv_id FROM public.conversations
  WHERE user1_id = u1 AND user2_id = u2;

  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (user1_id, user2_id)
    VALUES (u1, u2)
    RETURNING id INTO conv_id;
  END IF;

  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Run in Supabase dashboard Storage section or via API:
-- Create bucket: "photos" with public access
-- Create bucket: "verification" with private access
