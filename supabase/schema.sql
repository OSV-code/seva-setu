-- Seva Setu Phase 1 schema

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  role text not null check (role in ('customer', 'lab_partner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  line1 text not null,
  city text not null,
  pincode text not null,
  lat numeric,
  lng numeric,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists test_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null,
  sample_type text not null,
  prep_instructions text not null,
  created_at timestamptz not null default now()
);

create table if not exists labs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_phone text not null,
  city text not null,
  is_active boolean not null default true,
  commission_rate numeric(5, 2) not null default 20,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references users(id),
  test_package_id uuid not null references test_packages(id),
  lab_id uuid references labs(id),
  address_id uuid not null references addresses(id),
  slot_date date not null,
  slot_time_window text not null,
  status text not null check (status in (
    'requested',
    'confirmed',
    'technician_assigned',
    'sample_collected',
    'processing',
    'report_ready',
    'cancelled'
  )),
  amount numeric(10, 2) not null,
  platform_fee numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  file_url text not null,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid references users(id)
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references users(id),
  plan_type text not null,
  status text not null,
  renewal_date date,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_customer_id on bookings(customer_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_slot_date on bookings(slot_date);
