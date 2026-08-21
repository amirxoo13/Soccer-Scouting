create table if not exists platform_users (
  user_id text primary key,
  role text not null check (role in ('player', 'scout', 'admin')),
  display_name text,
  org_name text,
  org_role text,
  scout_status text not null default 'pending' check (scout_status in ('pending', 'approved', 'rejected')),
  is_admin boolean not null default false,
  locale text not null default 'fa',
  created_at timestamptz not null default now()
);

create table if not exists player_profiles (
  id serial primary key,
  user_id text not null unique,
  first_name text not null,
  last_name text not null,
  dob date,
  nationality text,
  country text,
  city text,
  height_cm int,
  weight_kg int,
  preferred_foot text check (preferred_foot in ('right', 'left', 'both')),
  primary_position text,
  secondary_positions text,
  jersey_number int,
  current_club text,
  club_history jsonb not null default '[]'::jsonb,
  playing_level text check (playing_level in ('amateur', 'semi_pro', 'professional')),
  achievements text,
  injury_status text,
  languages text,
  education text,
  bio text,
  instagram text,
  photo_url text,
  full_body_url text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'approved', 'needs_revision', 'rejected')),
  review_note text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  views int not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists player_profiles_status_idx on player_profiles (status);
create index if not exists player_profiles_country_idx on player_profiles (country);
create index if not exists player_profiles_position_idx on player_profiles (primary_position);

create table if not exists player_videos (
  id serial primary key,
  profile_id int not null references player_profiles(id) on delete cascade,
  youtube_url text not null,
  title text,
  description text,
  category text,
  sort_order int not null default 0,
  play_count int not null default 0
);

create table if not exists shortlists (
  id serial primary key,
  user_id text not null,
  name text not null default 'Watchlist',
  created_at timestamptz not null default now()
);

create table if not exists shortlist_items (
  id serial primary key,
  shortlist_id int not null references shortlists(id) on delete cascade,
  profile_id int not null references player_profiles(id) on delete cascade,
  notes text,
  status text not null default 'watching' check (status in ('watching', 'reviewing', 'contacted', 'passed')),
  created_at timestamptz not null default now(),
  unique (shortlist_id, profile_id)
);

create table if not exists contact_requests (
  id serial primary key,
  from_user_id text not null,
  profile_id int not null references player_profiles(id) on delete cascade,
  message text,
  status text not null default 'open' check (status in ('open', 'seen', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text,
  kind text not null,
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, read);

create table if not exists saved_filters (
  id serial primary key,
  user_id text not null,
  name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists profile_reviews (
  id serial primary key,
  profile_id int not null references player_profiles(id) on delete cascade,
  admin_user_id text not null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

insert into platform_users (user_id, role, display_name, org_name, scout_status, is_admin)
values
  ('seed-p-01', 'player', 'Arman Rahimi', null, 'approved', false),
  ('seed-p-02', 'player', 'Yuki Nakamura', null, 'approved', false),
  ('seed-p-03', 'player', 'Park Min-jun', null, 'approved', false),
  ('seed-p-04', 'player', 'Fahad Al-Mutairi', null, 'approved', false),
  ('seed-p-05', 'player', 'Javohir Karimov', null, 'approved', false),
  ('seed-p-06', 'player', 'Putri Andini', null, 'approved', false),
  ('seed-p-07', 'player', 'Emre Yildiz', null, 'approved', false),
  ('seed-p-08', 'player', 'Arjun Mehta', null, 'approved', false),
  ('seed-p-09', 'player', 'Niran Chaiyasit', null, 'approved', false),
  ('seed-p-10', 'player', 'Noor Al-Attiyah', null, 'approved', false),
  ('seed-p-11', 'player', 'Hana Kobayashi', null, 'approved', false),
  ('seed-p-12', 'player', 'Ali Hussein', null, 'approved', false)
on conflict (user_id) do nothing;

insert into player_profiles (
  user_id, first_name, last_name, dob, nationality, country, city,
  height_cm, weight_kg, preferred_foot, primary_position, secondary_positions,
  jersey_number, current_club, club_history, playing_level, achievements,
  injury_status, languages, education, bio, instagram, photo_url, status,
  views, featured, submitted_at, reviewed_at
) values
(
  'seed-p-01', 'Arman', 'Rahimi', '2007-03-14', 'IR', 'IR', 'Tehran',
  184, 76, 'right', 'ST', 'CF',
  9, 'Esteghlal U21',
  '[{"club":"Oghab Tehran","from":2021,"to":2023},{"club":"Esteghlal U19","from":2023,"to":2025},{"club":"Esteghlal U21","from":2025,"to":null}]'::jsonb,
  'amateur',
  'Tehran Youth League top scorer 2025 (19 goals).',
  null, 'Persian, English', 'High school',
  'Left-shoulder striker who times runs across the near post. First touch to shoot. Looking for a senior minutes pathway in Iran or the Gulf.',
  'arman.rahimi9', '/players/01.jpg', 'approved',
  1280, true, now() - interval '20 days', now() - interval '18 days'
),
(
  'seed-p-02', 'Yuki', 'Nakamura', '2004-07-22', 'JP', 'JP', 'Osaka',
  176, 68, 'left', 'CAM', 'CM,LW',
  10, 'Cerezo Osaka U23',
  '[{"club":"Gamba Osaka Youth","from":2018,"to":2022},{"club":"Cerezo Osaka U23","from":2022,"to":null}]'::jsonb,
  'semi_pro',
  'J Youth Cup finalist 2023.',
  null, 'Japanese, English', 'Kansai University (part-time)',
  'Left-footed 10 who plays between the lines. Short combinations, disguised through balls. Wants a loan with first-team minutes.',
  'yuki.n10', '/players/02.jpg', 'approved',
  940, true, now() - interval '30 days', now() - interval '28 days'
),
(
  'seed-p-03', 'Min-jun', 'Park', '2006-01-09', 'KR', 'KR', 'Busan',
  188, 82, 'right', 'CB', 'RB',
  4, 'Busan IPark Academy',
  '[{"club":"Busan IPark Academy","from":2019,"to":null}]'::jsonb,
  'amateur',
  'U19 national camp invitee, 2025.',
  null, 'Korean, English', 'High school',
  'Right-sided centre-back, aggressive on the first ball, clean enough to step into midfield. Aerial duels are the headline.',
  'park.mj4', '/players/03.jpg', 'approved',
  610, false, now() - interval '12 days', now() - interval '10 days'
),
(
  'seed-p-04', 'Fahad', 'Al-Mutairi', '2007-11-02', 'SA', 'SA', 'Riyadh',
  173, 64, 'left', 'RW', 'LW',
  7, 'Al-Nassr U19',
  '[{"club":"Al-Nassr U17","from":2022,"to":2024},{"club":"Al-Nassr U19","from":2024,"to":null}]'::jsonb,
  'amateur',
  'U19 league assist leader (11) in 2025.',
  null, 'Arabic, English', 'High school',
  'Inverted winger who receives on the half-turn and attacks the far post. Low centre of gravity, repeats sprints.',
  'fahad.m7', '/players/04.jpg', 'approved',
  870, true, now() - interval '8 days', now() - interval '6 days'
),
(
  'seed-p-05', 'Javohir', 'Karimov', '2002-05-18', 'UZ', 'UZ', 'Tashkent',
  192, 86, 'right', 'GK', null,
  1, 'Pakhtakor',
  '[{"club":"Bunyodkor U21","from":2019,"to":2022},{"club":"Pakhtakor","from":2022,"to":null}]'::jsonb,
  'semi_pro',
  'Uzbek Super League debut 2024. 6 clean sheets in 14 appearances.',
  null, 'Uzbek, Russian, English', 'Bachelor, physical education',
  'Shot-stopper with a long reach and a calm build-up pass. Wants a number-one role in a competitive league.',
  'j.karimov1', '/players/05.jpg', 'approved',
  720, true, now() - interval '40 days', now() - interval '38 days'
),
(
  'seed-p-06', 'Putri', 'Andini', '2008-04-30', 'ID', 'ID', 'Bandung',
  162, 54, 'right', 'CAM', 'ST',
  8, 'Persib Putri',
  '[{"club":"Persib Academy","from":2021,"to":2024},{"club":"Persib Putri","from":2024,"to":null}]'::jsonb,
  'amateur',
  'PSSI U18 camp. Liga Putri player of the month, March 2026.',
  null, 'Indonesian, English', 'High school',
  'Late-arriving 8/10 hybrid. Finds pockets, finishes with either foot from the edge. Ambitious about a move to Japan or Australia.',
  'putri.andini8', '/players/06.jpg', 'approved',
  530, true, now() - interval '5 days', now() - interval '3 days'
),
(
  'seed-p-07', 'Emre', 'Yildiz', '2005-09-11', 'TR', 'TR', 'Istanbul',
  178, 72, 'left', 'LB', 'LWB,LM',
  3, 'Fatih Karagumruk U19',
  '[{"club":"Galatasaray U16","from":2018,"to":2022},{"club":"Fatih Karagumruk U19","from":2022,"to":null}]'::jsonb,
  'semi_pro',
  'U19 Super Lig team of the week, twice in 2025.',
  null, 'Turkish, English', 'High school',
  'Attacking left-back who overlaps early and crosses low. Recoveries on the cover shadow still a work-on.',
  'emre.y3', '/players/07.jpg', 'approved',
  460, false, now() - interval '16 days', now() - interval '14 days'
),
(
  'seed-p-08', 'Arjun', 'Mehta', '2007-12-08', 'IN', 'IN', 'Mumbai',
  181, 74, 'right', 'CF', 'ST,CAM',
  11, 'Mumbai City FC Academy',
  '[{"club":"RFYC","from":2019,"to":2023},{"club":"Mumbai City FC Academy","from":2023,"to":null}]'::jsonb,
  'amateur',
  'Reliance Foundation Youth Cup golden boot 2025.',
  null, 'Hindi, English, Marathi', 'High school',
  'Link striker who drops in, then spins. Hold-up is mature for the age group. Looking at ISL minutes or a European academy trial.',
  'arjun.mehta11', '/players/08.jpg', 'approved',
  390, false, now() - interval '22 days', now() - interval '19 days'
),
(
  'seed-p-09', 'Niran', 'Chaiyasit', '2006-06-21', 'TH', 'TH', 'Bangkok',
  171, 63, 'both', 'LW', 'RW,LM',
  17, 'BG Pathum United U21',
  '[{"club":"Muangthong U17","from":2020,"to":2023},{"club":"BG Pathum United U21","from":2023,"to":null}]'::jsonb,
  'amateur',
  'Thai U19 call-up, 2025.',
  null, 'Thai, English', 'High school',
  'Two-footed wide forward. Isolates full-backs 1v1 and cuts inside on either foot. High work-rate out of possession.',
  'niran.17', '/players/09.jpg', 'approved',
  410, false, now() - interval '9 days', now() - interval '7 days'
),
(
  'seed-p-10', 'Noor', 'Al-Attiyah', '2003-02-14', 'QA', 'QA', 'Doha',
  177, 70, 'right', 'CM', 'CDM,CAM',
  6, 'Al-Sadd',
  '[{"club":"Aspire Academy","from":2014,"to":2021},{"club":"Al-Sadd","from":2021,"to":null}]'::jsonb,
  'professional',
  'Qatar Stars League 31 appearances. AFC Champions League squad 2025.',
  null, 'Arabic, English, French', 'Aspire graduate',
  'Tempo midfielder from Aspire. Progressive passer, rarely gives the ball away under press. Open to a European step-up.',
  'noor.attiyah6', '/players/10.jpg', 'approved',
  1104, true, now() - interval '50 days', now() - interval '48 days'
),
(
  'seed-p-11', 'Hana', 'Kobayashi', '2005-08-03', 'JP', 'JP', 'Yokohama',
  165, 56, 'left', 'RW', 'LW,CAM',
  21, 'Nippon TV Tokyo Verdy Beleza U18',
  '[{"club":"Nippon TV Tokyo Verdy Beleza U18","from":2021,"to":null}]'::jsonb,
  'semi_pro',
  'WE League youth all-star, 2025.',
  null, 'Japanese, English', 'High school',
  'Direct winger, first step over short grass. End product improving — more low cutbacks than hopeful crosses.',
  'hana.k21', '/players/11.jpg', 'approved',
  680, false, now() - interval '11 days', now() - interval '9 days'
),
(
  'seed-p-12', 'Ali', 'Hussein', '2004-10-19', 'IQ', 'IQ', 'Baghdad',
  183, 78, 'right', 'CDM', 'CB,CM',
  5, 'Al-Shorta U21',
  '[{"club":"Al-Zawraa Youth","from":2018,"to":2022},{"club":"Al-Shorta U21","from":2022,"to":null}]'::jsonb,
  'amateur',
  'Iraq U20 squad, 2025 AFC U20.',
  'Minor hamstring — training fully.',
  'Arabic, Persian, English', 'University, first year',
  'Screen in front of the back four. Wins the first contact, simple distribution. Looking for a structured academy in Turkey or the Gulf.',
  'ali.h5', '/players/12.jpg', 'approved',
  355, false, now() - interval '27 days', now() - interval '24 days'
)
on conflict (user_id) do nothing;

insert into player_videos (profile_id, youtube_url, title, description, category, sort_order)
select id, 'https://www.youtube.com/watch?v=lT8qgvgk1rE', 'Movement in the box', 'Near-post runs and finishes from the 2025 youth season.', 'goal_highlights', 0
from player_profiles where user_id = 'seed-p-01';
insert into player_videos (profile_id, youtube_url, title, description, category, sort_order)
select id, 'https://www.youtube.com/watch?v=0UjsXo9l6I8', 'Hold-up and link', 'Back to goal, layoff, spin.', 'training', 1
from player_profiles where user_id = 'seed-p-01';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=fC-rPZ6xGyA', 'Between the lines', 'passing', 0
from player_profiles where user_id = 'seed-p-02';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=I1L4bgi_uj0', 'Aerial duels', 'defending', 0
from player_profiles where user_id = 'seed-p-03';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=7PCkvCUwkN0', '1v1 wide', 'full_match_clip', 0
from player_profiles where user_id = 'seed-p-04';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=qYxOYKbwS4U', 'Shot-stopping reel', 'other', 0
from player_profiles where user_id = 'seed-p-05';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=lT8qgvgk1rE', 'Late box arrivals', 'goal_highlights', 0
from player_profiles where user_id = 'seed-p-06';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=0UjsXo9l6I8', 'Overlap and cross', 'full_match_clip', 0
from player_profiles where user_id = 'seed-p-07';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=fC-rPZ6xGyA', 'Link play', 'passing', 0
from player_profiles where user_id = 'seed-p-08';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=I1L4bgi_uj0', 'Isolation 1v1', 'full_match_clip', 0
from player_profiles where user_id = 'seed-p-09';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=7PCkvCUwkN0', 'Progressive passing', 'passing', 0
from player_profiles where user_id = 'seed-p-10';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=qYxOYKbwS4U', 'Wide finishes', 'goal_highlights', 0
from player_profiles where user_id = 'seed-p-11';

insert into player_videos (profile_id, youtube_url, title, category, sort_order)
select id, 'https://www.youtube.com/watch?v=lT8qgvgk1rE', 'Recoveries', 'defending', 0
from player_profiles where user_id = 'seed-p-12';
