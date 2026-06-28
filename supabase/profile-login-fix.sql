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
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    case when exists (select 1 from public.admin_emails where email = new.email) then 'admin' else 'user' end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    role = case when exists (select 1 from public.admin_emails where email = excluded.email) then 'admin' else public.profiles.role end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
for insert with check (auth.uid() = id and (role = 'user' or public.is_admin()));

drop policy if exists "Users update own profile admins update all" on public.profiles;
drop policy if exists "Users update own profile details" on public.profiles;
create policy "Users update own profile details" on public.profiles
for update using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select profiles.role from public.profiles where profiles.id = auth.uid())
);

drop policy if exists "Admins update all profiles" on public.profiles;
create policy "Admins update all profiles" on public.profiles
for update using (public.is_admin()) with check (public.is_admin());
