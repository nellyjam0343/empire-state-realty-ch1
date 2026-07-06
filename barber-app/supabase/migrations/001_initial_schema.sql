-- ClipBook Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- SHOPS
-- ============================================
create table shops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  phone text,
  linq_number text, -- Linq-provisioned phone number
  owner_id uuid not null references auth.users(id),
  logo_url text,
  created_at timestamptz default now()
);

alter table shops enable row level security;
create policy "Users can view their shops" on shops for select using (owner_id = auth.uid());
create policy "Users can create shops" on shops for insert with check (owner_id = auth.uid());
create policy "Owners can update shops" on shops for update using (owner_id = auth.uid());

-- ============================================
-- SERVICES (haircut types, braids, fades, etc.)
-- ============================================
create table services (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,           -- e.g., "6 Braids", "Skin Fade", "Beard Trim"
  description text,
  duration_minutes int not null default 30,
  price decimal(10,2),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table services enable row level security;
create policy "Shop members can view services" on services for select using (
  shop_id in (select id from shops where owner_id = auth.uid())
  or shop_id in (select shop_id from barbers where user_id = auth.uid())
);
create policy "Shop owners can manage services" on services for all using (
  shop_id in (select id from shops where owner_id = auth.uid())
);

-- ============================================
-- BARBERS
-- ============================================
create table barbers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id),
  shop_id uuid references shops(id) on delete set null,
  name text not null,
  email text,
  phone text,
  specialties text[], -- e.g., ['braids', 'fades', 'beards']
  avatar_url text,
  is_owner boolean default false,
  created_at timestamptz default now()
);

alter table barbers enable row level security;
create policy "Barbers can view shop colleagues" on barbers for select using (
  user_id = auth.uid()
  or shop_id in (select shop_id from barbers where user_id = auth.uid())
);
create policy "Users can create their barber profile" on barbers for insert with check (user_id = auth.uid());
create policy "Barbers can update own profile" on barbers for update using (user_id = auth.uid());

-- ============================================
-- CLIENTS
-- ============================================
create table clients (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  notes text,                        -- barber's private notes
  preferred_barber_id uuid references barbers(id),
  preferred_service_id uuid references services(id),
  usual_preferences jsonb default '{}', -- e.g., {"braids": 6, "taper": "low", "lineup": true}
  visit_count int default 0,
  last_visit_at timestamptz,
  created_at timestamptz default now()
);

alter table clients enable row level security;
create policy "Shop members can view clients" on clients for select using (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);
create policy "Shop members can manage clients" on clients for all using (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);

-- ============================================
-- AVAILABILITY (recurring weekly schedule)
-- ============================================
create table availability (
  id uuid primary key default uuid_generate_v4(),
  barber_id uuid not null references barbers(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_time time not null,
  end_time time not null,
  is_active boolean default true
);

alter table availability enable row level security;
create policy "Anyone can view availability" on availability for select using (true);
create policy "Barbers can manage own availability" on availability for all using (
  barber_id in (select id from barbers where user_id = auth.uid())
);

-- ============================================
-- AVAILABILITY OVERRIDES (specific date blocks/changes)
-- ============================================
create table availability_overrides (
  id uuid primary key default uuid_generate_v4(),
  barber_id uuid not null references barbers(id) on delete cascade,
  date date not null,
  is_available boolean default false, -- false = blocked off
  start_time time,
  end_time time,
  reason text
);

alter table availability_overrides enable row level security;
create policy "Anyone can view overrides" on availability_overrides for select using (true);
create policy "Barbers can manage own overrides" on availability_overrides for all using (
  barber_id in (select id from barbers where user_id = auth.uid())
);

-- ============================================
-- APPOINTMENTS
-- ============================================
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  barber_id uuid not null references barbers(id),
  client_id uuid not null references clients(id),
  shop_id uuid not null references shops(id),
  service_id uuid references services(id),
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes text,
  client_preferences jsonb default '{}', -- snapshot of what client asked for this visit
  is_repeat boolean default false,
  repeat_rule jsonb,                     -- e.g., {"frequency": "biweekly", "next_date": "2026-03-30"}
  reminder_24h_sent boolean default false,
  reminder_1h_sent boolean default false,
  created_at timestamptz default now()
);

alter table appointments enable row level security;
create policy "Shop members can view appointments" on appointments for select using (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);
create policy "Shop members can manage appointments" on appointments for all using (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);

-- Index for fast calendar queries
create index idx_appointments_time on appointments(shop_id, start_time);
create index idx_appointments_barber on appointments(barber_id, start_time);

-- ============================================
-- MESSAGES (Linq message log)
-- ============================================
create table messages (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references shops(id),
  client_id uuid references clients(id),
  barber_id uuid references barbers(id),
  direction text not null check (direction in ('inbound', 'outbound')),
  content text not null,
  channel text, -- 'imessage', 'rcs', 'sms'
  linq_message_id text,
  status text default 'sent', -- 'sent', 'delivered', 'read', 'failed'
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Shop members can view messages" on messages for select using (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);
create policy "Shop members can create messages" on messages for insert with check (
  shop_id in (select shop_id from barbers where user_id = auth.uid())
  or shop_id in (select id from shops where owner_id = auth.uid())
);

create index idx_messages_conversation on messages(shop_id, client_id, created_at);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get conversations (latest message per client)
create or replace function get_conversations(p_shop_id uuid)
returns table (
  client_id uuid,
  client_name text,
  client_phone text,
  last_message text,
  last_message_at timestamptz,
  unread_count bigint
) language sql security definer as $$
  select
    c.id as client_id,
    c.name as client_name,
    c.phone as client_phone,
    m.content as last_message,
    m.created_at as last_message_at,
    0::bigint as unread_count
  from clients c
  left join lateral (
    select content, created_at
    from messages
    where client_id = c.id and shop_id = p_shop_id
    order by created_at desc
    limit 1
  ) m on true
  where c.shop_id = p_shop_id
  order by m.created_at desc nulls last;
$$;

-- Auto-update client visit count and last_visit after appointment completion
create or replace function update_client_visit_stats()
returns trigger language plpgsql as $$
begin
  if NEW.status = 'completed' and (OLD.status is null or OLD.status != 'completed') then
    update clients
    set visit_count = visit_count + 1,
        last_visit_at = NEW.end_time
    where id = NEW.client_id;

    -- Save preferences from this appointment to client's usual_preferences
    if NEW.client_preferences is not null and NEW.client_preferences != '{}' then
      update clients
      set usual_preferences = NEW.client_preferences
      where id = NEW.client_id;
    end if;
  end if;
  return NEW;
end;
$$;

create trigger trg_update_visit_stats
  after insert or update on appointments
  for each row execute function update_client_visit_stats();

-- Auto-create next repeat appointment when current one completes
create or replace function auto_create_repeat_appointment()
returns trigger language plpgsql as $$
declare
  next_date timestamptz;
  duration interval;
begin
  if NEW.status = 'completed' and NEW.is_repeat and NEW.repeat_rule is not null then
    duration := NEW.end_time - NEW.start_time;

    -- Calculate next date based on frequency
    case NEW.repeat_rule->>'frequency'
      when 'weekly' then next_date := NEW.start_time + interval '7 days';
      when 'biweekly' then next_date := NEW.start_time + interval '14 days';
      when 'monthly' then next_date := NEW.start_time + interval '1 month';
      when 'triweekly' then next_date := NEW.start_time + interval '21 days';
      else return NEW;
    end case;

    insert into appointments (barber_id, client_id, shop_id, service_id, start_time, end_time,
      status, notes, client_preferences, is_repeat, repeat_rule)
    values (NEW.barber_id, NEW.client_id, NEW.shop_id, NEW.service_id, next_date, next_date + duration,
      'pending', NEW.notes, NEW.client_preferences, true, NEW.repeat_rule);
  end if;
  return NEW;
end;
$$;

create trigger trg_auto_repeat
  after update on appointments
  for each row execute function auto_create_repeat_appointment();
