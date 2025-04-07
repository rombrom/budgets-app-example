-- Custom SQL migration file, put your code below! --
create unique index budget_spend_budget_idx
on budget_spend(id);
