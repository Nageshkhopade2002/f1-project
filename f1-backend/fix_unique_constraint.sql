-- Fix unique constraint to allow multiple ticket types per race
-- Run these commands in MySQL

-- Step 1: Drop the wrong unique constraint
ALTER TABLE race_tickets 
DROP INDEX UK6bh8w33sc8s4cnkao9q2cuoit;

-- Step 2: Add correct composite unique constraint
ALTER TABLE race_tickets 
ADD UNIQUE KEY uk_race_event_ticket_type (race_event_id, ticket_type);

-- Step 3: Verify the constraint
SHOW INDEX FROM race_tickets;