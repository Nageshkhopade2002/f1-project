-- Updated ticket system database schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS race_tickets;

-- Create race_tickets table linked to race_event
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

-- Create bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    race_ticket_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (race_ticket_id) REFERENCES race_tickets(id) ON DELETE CASCADE
);

-- Insert sample tickets for existing race events (assuming you have race events with IDs 1, 2, 3)
INSERT INTO race_tickets (race_event_id, ticket_type, price, total_seats, available_seats) VALUES
-- Race 1 tickets
(1, 'GENERAL', 199.99, 50000, 50000),
(1, 'VIP', 499.99, 5000, 5000),
(1, 'PADDOCK', 999.99, 500, 500),

-- Race 2 tickets  
(2, 'GENERAL', 149.99, 60000, 60000),
(2, 'VIP', 399.99, 6000, 6000),
(2, 'PADDOCK', 799.99, 600, 600),

-- Race 3 tickets
(3, 'GENERAL', 249.99, 45000, 45000),
(3, 'VIP', 599.99, 4500, 4500),
(3, 'PADDOCK', 1199.99, 450, 450);