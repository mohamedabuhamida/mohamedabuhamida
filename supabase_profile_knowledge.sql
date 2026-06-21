create extension if not exists vector with schema extensions;

create table if not exists public.profile_knowledge (
  id bigserial primary key,
  title text not null,
  content text not null,
  category text not null default 'general',
  is_active boolean not null default true,
  embedding vector(768),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profile_knowledge_embedding_idx
  on public.profile_knowledge
  using hnsw (embedding vector_cosine_ops);

create or replace function public.match_profile_knowledge(
  query_embedding vector(768),
  match_count int default 6,
  match_threshold float default 0.35
)
returns table (
  id bigint,
  title text,
  content text,
  category text,
  similarity float
)
language sql
stable
as $$
  select
    pk.id,
    pk.title,
    pk.content,
    pk.category,
    1 - (pk.embedding <=> query_embedding) as similarity
  from public.profile_knowledge pk
  where
    pk.is_active = true
    and pk.embedding is not null
    and 1 - (pk.embedding <=> query_embedding) > match_threshold
  order by pk.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profile_knowledge_updated_at on public.profile_knowledge;

create trigger set_profile_knowledge_updated_at
  before update on public.profile_knowledge
  for each row
  execute function public.set_updated_at();

alter table public.profile_knowledge enable row level security;

drop policy if exists "Authenticated users can manage profile knowledge" on public.profile_knowledge;

create policy "Authenticated users can manage profile knowledge"
  on public.profile_knowledge
  for all
  to authenticated
  using (true)
  with check (true);
