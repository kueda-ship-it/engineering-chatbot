-- チャットセッション
create table if not exists chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null default '新しい会話',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- メッセージ履歴
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- インデックス
create index if not exists messages_session_id_idx on messages(session_id);
create index if not exists messages_created_at_idx on messages(created_at);

-- RLS
alter table chat_sessions enable row level security;
alter table messages enable row level security;

-- ポリシー: 自分のセッションのみ
create policy "own sessions" on chat_sessions
  for all using (auth.uid() = user_id);

create policy "own messages" on messages
  for all using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- updated_at 自動更新
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on chat_sessions
  for each row execute function update_updated_at();
