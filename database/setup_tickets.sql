-- Simple database setup for ticket booking system
-- Run this in your MySQL database

USE f1hub;

-- Create events table if not exists
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    event_image VARCHAR(500),
    category ENUM('RACE', 'PRACTICE', 'QUALIFYING', 'SPECIAL') DEFAULT 'RACE',
    status ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bookings table if not exists
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
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
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert sample events (only if table is empty)
INSERT IGNORE INTO events (id, name, description, event_date, venue, ticket_price, total_seats, available_seats, category) VALUES
(1, 'F1 Monaco Grand Prix 2026', 'The most prestigious race in Formula 1 calendar. Experience the glamour and excitement of Monaco.', '2026-05-24 14:00:00', 'Circuit de Monaco, Monaco', 299.99, 50000, 50000, 'RACE'),
(2, 'F1 British Grand Prix 2026', 'Home of British motorsport at the legendary Silverstone Circuit.', '2026-07-05 14:00:00', 'Silverstone Circuit, UK', 199.99, 140000, 140000, 'RACE'),
(3, 'F1 Italian Grand Prix 2026', 'The Temple of Speed - Experience the passion at Monza.', '2026-09-06 14:00:00', 'Autodromo Nazionale Monza, Italy', 249.99, 113860, 113860, 'RACE'),
(4, 'F1 Abu Dhabi Grand Prix 2026', 'Season finale under the lights at Yas Marina Circuit.', '2026-11-29 17:00:00', 'Yas Marina Circuit, UAE', 279.99, 60000, 60000, 'RACE'),
(5, 'F1 Practice Session - Bahrain', 'Free Practice sessions at Bahrain International Circuit.', '2026-03-15 13:00:00', 'Bahrain International Circuit', 89.99, 80000, 80000, 'PRACTICE');

SELECT 'Database setup complete!' as message;