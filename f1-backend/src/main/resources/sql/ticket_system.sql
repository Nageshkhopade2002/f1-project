-- Ticket System Database Schema

-- Race Tickets Table (Admin manages these)
CREATE TABLE race_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_event_id BIGINT NOT NULL,
    ticket_type VARCHAR(50) NOT NULL, -- 'GENERAL', 'VIP', 'PADDOCK'
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (race_event_id) REFERENCES race_events(id) ON DELETE CASCADE
);

-- User Bookings Table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    race_ticket_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SUCCESS', 'FAILED'
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (race_ticket_id) REFERENCES race_tickets(id) ON DELETE CASCADE
);

-- Insert sample race tickets for existing races
INSERT INTO race_tickets (race_event_id, ticket_type, price, total_seats, available_seats) 
SELECT id, 'GENERAL', 150.00, 1000, 1000 FROM race_events WHERE id <= 5;

INSERT INTO race_tickets (race_event_id, ticket_type, price, total_seats, available_seats) 
SELECT id, 'VIP', 350.00, 200, 200 FROM race_events WHERE id <= 5;

INSERT INTO race_tickets (race_event_id, ticket_type, price, total_seats, available_seats) 
SELECT id, 'PADDOCK', 750.00, 50, 50 FROM race_events WHERE id <= 5;