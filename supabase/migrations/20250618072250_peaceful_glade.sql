/*
  # Add feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_email` (text, for contact purposes)
      - `type` (text: 'suggestion', 'bug', 'compliment', 'general')
      - `subject` (text)
      - `message` (text)
      - `rating` (integer, 1-5 stars)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on feedback table
    - Add policies for authenticated users to insert their own feedback
    - Allow users to read their own feedback submissions
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email text NOT NULL,
  type text NOT NULL CHECK (type IN ('suggestion', 'bug', 'compliment', 'general')),
  subject text NOT NULL,
  message text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Feedback policies
CREATE POLICY "Users can insert own feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback(created_at);