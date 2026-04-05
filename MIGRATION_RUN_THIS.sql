-- ============================================================
-- SPARK DATABASE MIGRATION - Combined SQL
-- Run this in the Supabase SQL Editor for project: icbputkucrvzbzhqhtca
-- ============================================================

-- ============================================================
-- MIGRATION 1: Users table, RLS policies, auth triggers
-- ============================================================

-- Create users table with JSONB columns for all profile data
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile JSONB DEFAULT '{}'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  surprise_projects JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  coding_platforms JSONB DEFAULT '[]'::jsonb,
  about_me JSONB DEFAULT '{}'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  personal_connect JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
USING (auth.uid() = auth_user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid() = auth_user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- Public profiles are viewable by everyone (for portfolio sharing)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, username, profile, projects, surprise_projects, skills, certificates, experience, coding_platforms, about_me, education, personal_connect)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    '{}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb
  );
  RETURN NEW;
END;
$$;

-- Trigger to create user record on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- MIGRATION 2: Conversations & Messages tables, RLS, Realtime
-- ============================================================

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_one UUID NOT NULL,
  participant_two UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_one, participant_two)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations
FOR SELECT
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can create conversations they are part of"
ON public.conversations
FOR INSERT
WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can update their own conversations"
ON public.conversations
FOR UPDATE
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can delete their own conversations"
ON public.conversations
FOR DELETE
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  )
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Create index for faster queries
CREATE INDEX idx_conversations_participants ON public.conversations(participant_one, participant_two);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_conversations_viewed_at ON public.conversations(viewed_at);
