ALTER TABLE "purchase" DROP CONSTRAINT "purchase_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase" ADD COLUMN "memberId" integer;--> statement-breakpoint
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase" DROP COLUMN "teamId";