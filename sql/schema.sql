-- Create a table for public profiles linked to auth.users
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('finder', 'owner')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UPDATE FOREIGN KEY TO CASCADE ON DELETE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
        ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;


-- Enable RLS for profiles
alter table profiles enable row level security;

-- Policies for profiles
do $$ begin
  drop policy if exists "Public profiles are viewable by everyone." on profiles;
  create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
end $$;

do $$ begin
  drop policy if exists "Users can insert their own profile." on profiles;
  create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
end $$;

do $$ begin
  drop policy if exists "Users can update own profile." on profiles;
  create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );
end $$;

do $$ begin
  drop policy if exists "Users can delete own profile." on profiles;
  create policy "Users can delete own profile." on profiles for delete using ( auth.uid() = id );
end $$;

-- Create a table for rooms
create table if not exists rooms (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) not null,
  title text not null,
  description text,
  address text not null,
  location text not null, -- City or Area
  price numeric not null,
  property_type text not null, -- 1 BHK, 2 BHK, etc.
  tenant_preference text not null, -- Bachelor, Family, etc.
  contact_number text not null,
  images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UPDATE FOREIGN KEY TO CASCADE ON DELETE FOR ROOMS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'rooms_owner_id_fkey' AND table_name = 'rooms') THEN
        ALTER TABLE rooms DROP CONSTRAINT rooms_owner_id_fkey;
        ALTER TABLE rooms ADD CONSTRAINT rooms_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS for rooms
alter table rooms enable row level security;

-- Policies for rooms
do $$ begin
  drop policy if exists "Rooms are viewable by everyone." on rooms;
  create policy "Rooms are viewable by everyone." on rooms for select using ( true );
end $$;

do $$ begin
  drop policy if exists "Owners can insert their own rooms." on rooms;
  create policy "Owners can insert their own rooms." on rooms for insert with check ( auth.uid() = owner_id );
end $$;

do $$ begin
  drop policy if exists "Owners can update their own rooms." on rooms;
  create policy "Owners can update their own rooms." on rooms for update using ( auth.uid() = owner_id );
end $$;

do $$ begin
  drop policy if exists "Owners can delete their own rooms." on rooms;
  create policy "Owners can delete their own rooms." on rooms for delete using ( auth.uid() = owner_id );
end $$;

-- HANDLE NEW USER TRIGGER
-- This ensures profile is created even if email is not verified yet
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET SETUP
-- Note: You might need to run this in Supabase SQL Editor if the bucket doesn't exist
insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Room images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'room-images' );

create policy "Owners can upload room images."
  on storage.objects for insert
  with check (
    bucket_id = 'room-images'
    and auth.role() = 'authenticated'
  );

create policy "Owners can update their own room images."
  on storage.objects for update
  using (
    bucket_id = 'room-images'
    and auth.uid() = owner
  );

create policy "Owners can delete their own room images."
  on storage.objects for delete
  using (
    bucket_id = 'room-images'
    and auth.uid() = owner
  );
