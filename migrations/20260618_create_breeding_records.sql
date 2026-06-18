-- 2026-06-18 create breeding_records table
create extension if not exists "uuid-ossp";

create table if not exists breeding_records (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  sow_id uuid not null references animals(id),
  method text,
  mating_date date,
  expected_farrow_date date,
  actual_farrow_date date,
  litter_size int,
  male_count int,
  female_count int,
  stillborn_count int default 0,
  status text default 'pending',
  notes text,
  created_at timestamptz default now()
);
