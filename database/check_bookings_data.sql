-- Check bookings with all related data
SELECT 
    b.id as booking_id,
    b.race_ticket_id,
    b.race_event_id,
    b.booking_date,
    b.booking_status,
    b.payment_status,
    rt.ticket_type,
    rt.price,
    re.race_name,
    re.start_date,
    c.name as circuit_name,
    c.country as circuit_country
FROM bookings b
LEFT JOIN race_tickets rt ON b.race_ticket_id = rt.id
LEFT JOIN race_event re ON b.race_event_id = re.id
LEFT JOIN circuit c ON re.circuit_id = c.id
ORDER BY b.id DESC
LIMIT 10;

-- Check if race_event_id is properly stored in bookings
SELECT id, race_ticket_id, race_event_id, booking_status FROM bookings ORDER BY id DESC LIMIT 5;

-- Check race_tickets table
SELECT id, race_event_id, ticket_type FROM race_tickets LIMIT 5;

-- Check race_event table
SELECT id, race_name, start_date, circuit_id FROM race_event LIMIT 5;

-- Check circuit table
SELECT id, name, country FROM circuit LIMIT 5;
