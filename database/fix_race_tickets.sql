-- Fix race tickets table and foreign key constraints
USE f1hub;

-- Drop existing race_tickets table if it exists
DROP TABLE IF EXISTS race_tickets;

-- Create race_tickets table with proper foreign key to race_event
CREATE TABLE race_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_event_id BIGINT NOT NULL,
    ticket_type ENUM('GENERAL', 'VIP', 'PADDOCK') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (race_event_id) REFERENCES race_event(id) ON DELETE CASCADE,
    UNIQUE KEY unique_race_ticket (race_event_id, ticket_type)
);

-- Check if race_event table exists, if not create it
CREATE TABLE IF NOT EXISTS race_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_name VARCHAR(255) NOT NULL,
    round_number INT,
    event_type VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample race events if table is empty
INSERT IGNORE INTO race_event (id, race_name, round_number, event_type, status) VALUES
(1, 'Bahrain Grand Prix', 1, 'RACE', 'ACTIVE'),
(2, 'Saudi Arabian Grand Prix', 2, 'RACE', 'ACTIVE'),
(3, 'Australian Grand Prix', 3, 'RACE', 'ACTIVE'),
(4, 'Japanese Grand Prix', 4, 'RACE', 'ACTIVE'),
(5, 'Chinese Grand Prix', 5, 'RACE', 'ACTIVE'),
(6, 'Miami Grand Prix', 6, 'RACE', 'ACTIVE'),
(7, 'Emilia Romagna Grand Prix', 7, 'RACE', 'ACTIVE'),
(8, 'Monaco Grand Prix', 8, 'RACE', 'ACTIVE');

-- Insert sample tickets for the race events
INSERT IGNORE INTO race_tickets (race_event_id, ticket_type, price, total_seats, available_seats) VALUES
(1, 'GENERAL', 199.99, 50000, 50000),
(1, 'VIP', 499.99, 5000, 5000),
(2, 'GENERAL', 149.99, 60000, 60000),
(3, 'GENERAL', 249.99, 45000, 45000);

SELECT 'Race tickets table setup complete!' as message;