-- Fix booking table schema - remove event_id column completely
-- Run these commands in your MySQL database

-- STEP 1: Drop the foreign key constraint for event_id
ALTER TABLE bookings 
DROP FOREIGN KEY FK2ww82bk3npaiyu9oeehwtt2q3;

-- STEP 2: Drop the event_id column completely
ALTER TABLE bookings 
DROP COLUMN event_id;

-- STEP 3: Verify the table structure (run this to check)
-- DESC bookings;

-- STEP 4: Add correct foreign key for race_event_id (if not exists)
ALTER TABLE bookings 
ADD CONSTRAINT fk_booking_race_event 
FOREIGN KEY (race_event_id) 
REFERENCES race_event(id);

-- STEP 5: Verify the final table structure
-- SHOW CREATE TABLE bookings;