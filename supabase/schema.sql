create extension if not exists "pgcrypto";

create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_emails (email)
values ('sangsanwongmoolno.4@gmail.com')
on conflict (email) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('computer', 'scimath', 'camp', 'about')),
  title_th text not null,
  title_en text,
  subtitle_th text,
  subtitle_en text,
  details_th text,
  details_en text,
  tags text[] not null default '{}',
  technologies text[] not null default '{}',
  achievement_th text,
  achievement_en text,
  github_url text,
  demo_url text,
  project_date date,
  sort_order int not null default 100,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null check (kind in ('image', 'certificate')),
  bucket text not null,
  path text not null,
  alt_th text,
  alt_en text,
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.about_me (
  id int primary key default 1 check (id = 1),
  title_th text not null default 'About Me',
  title_en text not null default 'About Me',
  body_th text not null default '',
  body_en text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.about_me (id, body_th, body_en)
values (
  1,
  'เด็กสายสร้างที่ชอบใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อทำโปรเจกต์จริงและแก้ปัญหาให้ผู้คน',
  'A builder who uses technology, games, and creativity to make real projects and solve meaningful problems.'
)
on conflict (id) do nothing;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_email text,
  rating int check (rating between 1 and 5),
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects_updated_at on public.projects;
create trigger touch_projects_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists touch_reviews_updated_at on public.reviews;
create trigger touch_reviews_updated_at
before update on public.reviews
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    case when exists (select 1 from public.admin_emails where email = new.email) then 'admin' else 'user' end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    role = case when exists (select 1 from public.admin_emails where email = excluded.email) then 'admin' else public.profiles.role end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_emails
    where email = auth.jwt() ->> 'email'
  )
  or exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.admin_emails enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.about_me enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Admins manage admin emails" on public.admin_emails;
create policy "Admins manage admin emails" on public.admin_emails
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read own profile admins read all" on public.profiles;
create policy "Users read own profile admins read all" on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users update own profile admins update all" on public.profiles;
create policy "Users update own profile admins update all" on public.profiles
for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

drop policy if exists "Public read visible projects" on public.projects;
create policy "Public read visible projects" on public.projects
for select using (is_visible or public.is_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read project media" on public.project_media;
create policy "Public read project media" on public.project_media
for select using (
  exists (
    select 1 from public.projects
    where projects.id = project_media.project_id and (projects.is_visible or public.is_admin())
  )
);

drop policy if exists "Admins manage project media" on public.project_media;
create policy "Admins manage project media" on public.project_media
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read about me" on public.about_me;
create policy "Public read about me" on public.about_me
for select using (true);

drop policy if exists "Admins manage about me" on public.about_me;
create policy "Admins manage about me" on public.about_me
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read approved reviews" on public.reviews;
create policy "Public read approved reviews" on public.reviews
for select using (status = 'approved' or public.is_admin() or auth.uid() = user_id);

drop policy if exists "Authenticated users create pending reviews" on public.reviews;
create policy "Authenticated users create pending reviews" on public.reviews
for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews" on public.reviews
for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('certificates', 'certificates', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public read public portfolio files" on storage.objects;
create policy "Public read public portfolio files" on storage.objects
for select using (bucket_id in ('project-images', 'certificates', 'avatars'));

drop policy if exists "Admins upload project files" on storage.objects;
create policy "Admins upload project files" on storage.objects
for insert with check (bucket_id in ('project-images', 'certificates') and public.is_admin());

drop policy if exists "Admins update project files" on storage.objects;
create policy "Admins update project files" on storage.objects
for update using (bucket_id in ('project-images', 'certificates') and public.is_admin());

drop policy if exists "Admins delete project files" on storage.objects;
create policy "Admins delete project files" on storage.objects
for delete using (bucket_id in ('project-images', 'certificates') and public.is_admin());

