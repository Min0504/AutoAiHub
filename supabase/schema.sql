-- AutoHub AI — Leads 테이블
-- Supabase SQL Editor에서 이 파일 전체를 실행하세요.

create table if not exists leads (
  id          uuid primary key,
  kind        text not null check (kind in ('consulting_proposal', 'consulting_meeting', 'roi_report')),
  source      text not null default 'autohub-ai',
  created_at  timestamptz not null default now(),
  payload     jsonb not null default '{}'
);

-- 최신순 조회 인덱스
create index if not exists leads_created_at_idx on leads (created_at desc);

-- kind별 필터 인덱스
create index if not exists leads_kind_idx on leads (kind);

-- RLS: service_role key로만 쓰기 허용 (anon은 읽기/쓰기 불가)
alter table leads enable row level security;

-- 외부에서 직접 조회 불가 (서버만 service_role로 접근)
create policy "service_role only" on leads
  as restrictive
  for all
  using (false);
