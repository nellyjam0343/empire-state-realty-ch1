-- ClipBook: Enable pg_cron and pg_net for automated reminders
-- Run this in Supabase Dashboard > SQL Editor

-- Enable required extensions (if not already enabled)
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Schedule reminder check every 15 minutes
select cron.schedule(
  'clipbook-send-reminders',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://xuvxsxbbdgksvqyujpmo.supabase.co/functions/v1/send-reminder',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dnhzeGJiZGdrc3ZxeXVqcG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTk0MTMsImV4cCI6MjA4OTI3NTQxM30.f5rwNv4BvyfSdm-pZXKerN1hTY_SrbdnuibCeOq3Cso'
    )
  );
  $$
);

-- Verify the cron job was created
select * from cron.job where jobname = 'clipbook-send-reminders';
