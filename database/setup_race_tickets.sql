-- Updated database schema for race-based ticket booking
USE f1hub;

-- Create race_tickets table to link with existing race_events
CREATE TABLE IF NOT EXISTS race_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_event_id BIGINT NOT NULL UNIQUE,
    ticket_price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('AVAILABLE', 'SOLD_OUT', 'DISABLED') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (race_event_id) REFERENCES race_events(id) ON DELETE CASCADE
);

-- Update bookings table to link with race_events instead of separate events
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    race_event_id BIGINT NOT NULL,
    number_of_tickets INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    seat_numbers VARCHAR(500),
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    booking_reference VARCHAR(50) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (race_event_id) REFERENCES race_events(id) ON DELETE CASCADE,
    INDEX idx_user_bookings (user_id),
    INDEX idx_race_bookings (race_event_id)
);

-- Insert sample race tickets for existing races (adjust race_event_id based on your data)
INSERT IGNORE INTO race_tickets (race_event_id, ticket_price, total_seats, available_seats) VALUES
(1, 299.99, 50000, 50000),   -- Monaco GP
(2, 199.99, 140000, 140000), -- British GP  
(3, 249.99, 113860, 113860), -- Italian GP
(4, 279.99, 60000, 60000),   -- Abu Dhabi GP
(5, 89.99, 80000, 80000);    -- Practice Session

SELECT 'Race ticket system setup complete!' as message;