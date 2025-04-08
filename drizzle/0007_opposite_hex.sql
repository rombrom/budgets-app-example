-- Custom SQL migration file, put your code below! --
create trigger refresh_budget_spend_after_budgets
after insert or update or delete on budget
for each statement execute function refresh_budget_spend();
