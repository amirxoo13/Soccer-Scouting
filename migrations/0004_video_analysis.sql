alter table player_videos add column if not exists analysis_status text not null default 'idle';
alter table player_videos add column if not exists analysis_json jsonb;
alter table player_videos add column if not exists analysis_error text;
alter table player_videos add column if not exists analyzed_at timestamptz;

create table if not exists video_analysis_jobs (
  id serial primary key,
  video_id int not null references player_videos(id) on delete cascade,
  user_id text not null,
  video_url text not null,
  status text not null default 'queued',
  attempts int not null default 0,
  stream_url text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists video_analysis_jobs_status_idx on video_analysis_jobs (status, id);
create index if not exists video_analysis_jobs_video_idx on video_analysis_jobs (video_id);
