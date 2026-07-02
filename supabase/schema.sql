-- Run once in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists analytics_events (
  id bigserial primary key,
  event text not null,
  props jsonb not null default '{}'::jsonb,
  visitor_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_created_at
  on analytics_events (created_at desc);

create index if not exists idx_analytics_events_event
  on analytics_events (event);

create index if not exists idx_analytics_events_visitor_id
  on analytics_events (visitor_id);

create table if not exists gumroad_purchases (
  id bigserial primary key,
  sale_id text not null unique,
  product_id text,
  product_name text,
  email text,
  price_cents integer,
  currency text,
  tier text,
  url_params jsonb not null default '{}'::jsonb,
  purchased_at timestamptz,
  refunded boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_gumroad_purchases_purchased_at
  on gumroad_purchases (purchased_at desc);

create index if not exists idx_gumroad_purchases_tier
  on gumroad_purchases (tier);

-- Daily X posts + engagement (for template learning)
create table if not exists x_daily_tweets (
  id bigserial primary key,
  tweet_id text not null unique,
  card_id text not null,
  template_id text not null,
  situation text not null,
  char_count integer,
  tweet_text text not null,
  likes integer not null default 0,
  retweets integer not null default 0,
  replies integer not null default 0,
  impressions integer not null default 0,
  posted_at timestamptz not null default now(),
  metrics_synced_at timestamptz
);

create index if not exists idx_x_daily_tweets_posted_at
  on x_daily_tweets (posted_at desc);

create index if not exists idx_x_daily_tweets_template_id
  on x_daily_tweets (template_id);
