-- Custom SQL migration file, put your code below! --
-- NOTE: this would be better to hand off to a background job but
--       for the sake of simplicity !@#$% it we'll do it live.
create or replace function refresh_budget_spend()
returns trigger as $$
begin
  refresh materialized view concurrently budget_spend;
  return null;
end;
$$ language plpgsql;

create trigger refresh_budget_spend_after_change
after insert or update or delete on purchase
for each statement execute function refresh_budget_spend();
