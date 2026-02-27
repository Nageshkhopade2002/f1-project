-- Check booking data
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
LEFT JOIN race_event re ON b.race_event_id = re.id
WHERE b.id = 8;

-- If race_ticket_id or race_event_id is NULL or doesn't exist, fix it:
-- UPDATE bookings SET race_event_id = 1, race_ticket_id = 1 WHERE id = 8;
