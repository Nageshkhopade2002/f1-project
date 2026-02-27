-- Check bookings data
SELECT * FROM bookings LIMIT 5;

-- Check if race_ticket_id and race_event_id exist
SELECT 
    b.id as booking_id,
    b.race_ticket_id,
    b.race_event_id,
    b.quantity,
    b.total_amount,
    b.booking_status,
    b.payment_status
FROM bookings b;

-- Check if race_tickets table has data
SELECT * FROM race_tickets LIMIT 5;

-- Check if race_event table has data
SELECT * FROM race_event LIMIT 5;

-- Check full join to see what's missing
SELECT 
    b.id,
    b.race_ticket_id,
    b.race_event_id,
    rt.id as ticket_exists,
    rt.ticket_type,
    re.id as race_exists,
    re.race_name
FROM bookings b
LEFT JOIN race_tickets rt ON b.race_ticket_id = rt.id
LEFT JOIN race_event re ON b.race_event_id = re.id;
