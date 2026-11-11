-- Dedicated Auetal PostgreSQL database. Do NOT apply to DG Outbound.
CREATE TABLE IF NOT EXISTS auetal_applicants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 status text NOT NULL DEFAULT 'neu' CHECK (status IN ('neu','kontakt','gespraech','hospitation','eingestellt','abgesagt','archiviert')),
 name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
 email text NOT NULL DEFAULT '',
 telephone text NOT NULL DEFAULT '',
 role text NOT NULL,
 preferred_job text NOT NULL DEFAULT '',
 priority text NOT NULL DEFAULT '',
 worktime text NOT NULL DEFAULT '',
 timing text NOT NULL DEFAULT '',
 message text NOT NULL DEFAULT '',
 notes text NOT NULL DEFAULT '',
 source text NOT NULL DEFAULT 'Karrierewelt',
 utm_source text NOT NULL DEFAULT '',
 utm_medium text NOT NULL DEFAULT '',
 utm_campaign text NOT NULL DEFAULT '',
 utm_content text NOT NULL DEFAULT '',
 follow_up_at timestamptz,
 privacy_acknowledged_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auetal_applicants_created_idx ON auetal_applicants(created_at DESC);
CREATE INDEX IF NOT EXISTS auetal_applicants_status_idx ON auetal_applicants(status,updated_at DESC);
CREATE INDEX IF NOT EXISTS auetal_applicants_followup_idx ON auetal_applicants(follow_up_at) WHERE follow_up_at IS NOT NULL;
CREATE TABLE IF NOT EXISTS auetal_rate_limits (
 key_hash text NOT NULL,
 bucket bigint NOT NULL,
 attempts integer NOT NULL DEFAULT 1,
 PRIMARY KEY (key_hash,bucket)
);
CREATE TABLE IF NOT EXISTS auetal_applicant_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 applicant_id uuid NOT NULL REFERENCES auetal_applicants(id) ON DELETE CASCADE,
 changed_at timestamptz NOT NULL DEFAULT now(),
 event_type text NOT NULL,
 previous_status text,
 new_status text
);
CREATE INDEX IF NOT EXISTS auetal_events_candidate_idx ON auetal_applicant_events(applicant_id,changed_at DESC);
-- Data deletion/retention must be agreed with Auetal and reflected in the applicant privacy notice.
