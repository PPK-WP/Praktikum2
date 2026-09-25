-- Initial schema from PROJEK_WORKFLOW.md §20 (Database Strategy).
-- Owner: P1. The transactions table follows §20 as-is; its fields and data access belong to P2.

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(50)  NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type        VARCHAR(10)   NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  description TEXT          NOT NULL DEFAULT '',
  date        DATE          NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX transactions_user_id_date_idx ON transactions (user_id, date DESC);

CREATE TABLE user_preferences (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  theme          VARCHAR(10) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  default_filter VARCHAR(10) NOT NULL DEFAULT 'all' CHECK (default_filter IN ('all', 'income', 'expense')),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
