-- Alternative fix - Remove foreign key constraint temporarily
USE f1hub;

-- Drop existing race_tickets table if it exists
DROP TABLE IF EXISTS race_tickets;

-- Create race_tickets table WITHOUT foreign key constraint (temporary fix)
CREATE TABLE race_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_event_id BIGINT NOT NULL,
    ticket_type ENUM('GENERAL', 'VIP', 'PADDOCK') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_race_ticket (race_event_id, ticket_type)
);

SELECT 'Race tickets table created without foreign key constraint!' as message;