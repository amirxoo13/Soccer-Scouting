create table if not exists wallets (
  user_id text primary key,
  address text not null unique,
  network text not null default 'TRC20',
  asset text not null default 'USDT',
  balance_usdt numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists wallet_tx (
  id serial primary key,
  user_id text not null,
  kind text not null check (kind in ('deposit', 'subscribe', 'refund')),
  amount_usdt numeric(12,2) not null,
  plan text,
  memo text,
  created_at timestamptz not null default now()
);

create index if not exists wallet_tx_user_idx on wallet_tx (user_id, created_at desc);

create table if not exists subscriptions (
  user_id text primary key,
  plan text not null check (plan in ('youth', 'player_u24', 'player_senior', 'desk')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists youth_verifications (
  user_id text primary key,
  id_doc_url text not null,
  selfie_url text not null,
  video_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists clubs (
  id serial primary key,
  slug text not null unique,
  name text not null,
  short_code text not null,
  country text not null,
  city text,
  league text,
  email text,
  website text,
  color_a text not null default '#1c3d32',
  color_b text not null default '#c5d0c8',
  email_verified boolean not null default false
);

create table if not exists club_alerts (
  id serial primary key,
  club_id int not null references clubs(id) on delete cascade,
  profile_id int not null references player_profiles(id) on delete cascade,
  email text not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

insert into clubs (slug, name, short_code, country, city, league, email, website, color_a, color_b, email_verified) values
  ('al-hilal', 'Al Hilal', 'HIL', 'SA', 'Riyadh', 'Saudi Pro League', 'Care@alhilal.com', 'https://alhilal.com', '#005bac', '#ffffff', true),
  ('al-sadd', 'Al Sadd', 'SAD', 'QA', 'Doha', 'Qatar Stars League', 'info@al-saddclub.com', 'https://al-saddclub.com', '#111111', '#ffffff', true),
  ('al-wasl', 'Al Wasl', 'WAS', 'AE', 'Dubai', 'UAE Pro League', 'mail@alwaslsc.ae', 'https://www.alwaslsc.ae', '#f5c400', '#111111', true),
  ('buriram-united', 'Buriram United', 'BRU', 'TH', 'Buriram', 'Thai League 1', 'brutd@buriramunited.com', 'https://www.buriramunited.com', '#0b1f4a', '#c9a227', true),
  ('al-ain', 'Al Ain', 'AIN', 'AE', 'Al Ain', 'UAE Pro League', 'info@alainfc.ae', 'https://alainclub.ae', '#5b2d8e', '#ffffff', true),
  ('persepolis', 'Persepolis', 'PRS', 'IR', 'Tehran', 'Persian Gulf Pro League', 'info@fc-perspolis.com', 'https://fc-perspolis.com', '#c8102e', '#ffffff', false),
  ('esteghlal', 'Esteghlal', 'EST', 'IR', 'Tehran', 'Persian Gulf Pro League', 'info@fcesteghlal.ir', 'https://fcesteghlal.ir', '#0057b8', '#ffffff', false),
  ('tractor', 'Tractor', 'TRC', 'IR', 'Tabriz', 'Persian Gulf Pro League', 'info@tractor-fc.com', 'https://tractor-fc.com', '#e10600', '#ffffff', false),
  ('sepahan', 'Sepahan', 'SEP', 'IR', 'Isfahan', 'Persian Gulf Pro League', 'info@sepahansc.com', 'https://sepahansc.com', '#f0c400', '#1a1a1a', false),
  ('al-nassr', 'Al Nassr', 'NSR', 'SA', 'Riyadh', 'Saudi Pro League', 'online.store@alnassr.sa', 'https://alnassr.sa', '#f5c400', '#0b2a6f', true),
  ('al-ittihad', 'Al Ittihad', 'ITT', 'SA', 'Jeddah', 'Saudi Pro League', 'info@ittihadclub.sa', 'https://ittihadclub.sa', '#111111', '#f5c400', false),
  ('al-ahli-jeddah', 'Al Ahli', 'AHL', 'SA', 'Jeddah', 'Saudi Pro League', 'info@alahli.com', 'https://alahli.com', '#0b7a3e', '#ffffff', false),
  ('urawa-reds', 'Urawa Red Diamonds', 'URA', 'JP', 'Saitama', 'J1 League', null, 'https://www.urawa-reds.co.jp', '#c8102e', '#ffffff', false),
  ('kashima', 'Kashima Antlers', 'KAS', 'JP', 'Kashima', 'J1 League', 'info@antlers.co.jp', 'https://www.antlers.co.jp', '#c8102e', '#1a1a1a', false),
  ('kawasaki', 'Kawasaki Frontale', 'KAW', 'JP', 'Kawasaki', 'J1 League', 'info@frontale.co.jp', 'https://www.frontale.co.jp', '#0077c8', '#111111', false),
  ('gamba-osaka', 'Gamba Osaka', 'GAM', 'JP', 'Osaka', 'J1 League', 'info@gamba-osaka.net', 'https://www.gamba-osaka.net', '#0033a0', '#7ac143', false),
  ('jeonbuk', 'Jeonbuk Hyundai Motors', 'JEO', 'KR', 'Jeonju', 'K League 1', 'webmaster@hyundai-motorsfc.com', 'https://www.hyundai-motorsfc.com', '#0b6b3a', '#ffffff', false),
  ('ulsan', 'Ulsan HD', 'ULS', 'KR', 'Ulsan', 'K League 1', 'webmaster@uhfc.tv', 'https://www.uhfc.tv', '#0057b8', '#f5c400', false),
  ('fc-seoul', 'FC Seoul', 'SEL', 'KR', 'Seoul', 'K League 1', 'webmaster@fcseoul.com', 'https://www.fcseoul.com', '#c8102e', '#111111', false),
  ('pohang', 'Pohang Steelers', 'POH', 'KR', 'Pohang', 'K League 1', 'webmaster@steelers.co.kr', 'https://www.steelers.co.kr', '#c8102e', '#1a1a1a', false),
  ('shanghai-port', 'Shanghai Port', 'SHP', 'CN', 'Shanghai', 'Chinese Super League', 'media@sipgfc.com', 'https://www.sipgfc.com', '#c8102e', '#ffffff', false),
  ('shandong', 'Shandong Taishan', 'SDT', 'CN', 'Jinan', 'Chinese Super League', 'media@fcshandong.com', 'https://www.fcshandong.com', '#c8102e', '#f5c400', false),
  ('pakhtakor', 'Pakhtakor', 'PAK', 'UZ', 'Tashkent', 'Uzbekistan Super League', 'info@pakhtakor.uz', 'https://www.pakhtakor.uz', '#0057b8', '#ffffff', false),
  ('nasaf', 'Nasaf', 'NSF', 'UZ', 'Qarshi', 'Uzbekistan Super League', 'info@fcnasaf.uz', 'https://fcnasaf.uz', '#0b6b3a', '#ffffff', false),
  ('al-duhail', 'Al Duhail', 'DUH', 'QA', 'Doha', 'Qatar Stars League', 'info@duhailsc.qa', 'https://www.duhailsc.qa', '#c8102e', '#ffffff', false),
  ('al-rayyan', 'Al Rayyan', 'RAY', 'QA', 'Al Rayyan', 'Qatar Stars League', 'info@alrayyansc.qa', 'https://www.alrayyansc.qa', '#c8102e', '#f5c400', false),
  ('shabab-al-ahli', 'Shabab Al Ahli', 'SAH', 'AE', 'Dubai', 'UAE Pro League', 'info@shababalahli.ae', 'https://www.shababalahli.ae', '#c8102e', '#ffffff', false),
  ('johor-dt', 'Johor Darul Ta''zim', 'JDT', 'MY', 'Johor Bahru', 'Malaysia Super League', 'info@johorsoutherntigers.com.my', 'https://johorsoutherntigers.com.my', '#0057b8', '#c9a227', false),
  ('melbourne-victory', 'Melbourne Victory', 'MVC', 'AU', 'Melbourne', 'A-League', 'info@melbournevictory.com.au', 'https://melbournevictory.com.au', '#0033a0', '#c9a227', false),
  ('mumbai-city', 'Mumbai City', 'MCF', 'IN', 'Mumbai', 'Indian Super League', 'info@mumbaicityfc.com', 'https://www.mumbaicityfc.com', '#0077c8', '#ffffff', false),
  ('persija', 'Persija Jakarta', 'PSJ', 'ID', 'Jakarta', 'Liga 1', 'info@persija.id', 'https://persija.id', '#c8102e', '#f5c400', false),
  ('al-shorta', 'Al Shorta', 'SHO', 'IQ', 'Baghdad', 'Iraq Stars League', 'info@alshorta.iq', 'https://alshorta.iq', '#0b6b3a', '#ffffff', false)
on conflict (slug) do nothing;
