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

-- X daily tweets + engagement learning loop
create table if not exists social_templates (
  id text primary key,
  name text not null,
  description text not null,
  score numeric not null default 1,
  use_count integer not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists social_posts (
  id bigserial primary key,
  status text not null check (status in ('draft', 'posted', 'failed')),
  template_id text not null references social_templates (id),
  word_id text not null,
  situation text not null,
  tweet_text text not null,
  link_url text not null,
  x_tweet_id text,
  posted_at timestamptz,
  scheduled_for date not null unique,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_social_posts_scheduled_for
  on social_posts (scheduled_for desc);

create index if not exists idx_social_posts_status
  on social_posts (status);

create table if not exists social_post_metrics (
  id bigserial primary key,
  social_post_id bigint not null references social_posts (id) on delete cascade,
  fetched_at timestamptz not null default now(),
  impressions integer not null default 0,
  likes integer not null default 0,
  reposts integer not null default 0,
  replies integer not null default 0,
  bookmarks integer not null default 0,
  url_clicks integer not null default 0
);

create index if not exists idx_social_post_metrics_post
  on social_post_metrics (social_post_id, fetched_at desc);
