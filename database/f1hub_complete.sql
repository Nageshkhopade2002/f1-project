-- Complete F1 Hub Database Schema with Ticket Booking System

-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table for ticket booking
CREATE TABLE events (
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

-- Bookings table
CREATE TABLE bookings (
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
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_bookings (user_id),
    INDEX idx_event_bookings (event_id)
);

-- Insert sample events
INSERT INTO events (name, description, event_date, venue, ticket_price, total_seats, available_seats, category) VALUES
('F1 Monaco Grand Prix 2026', 'The most prestigious race in Formula 1 calendar. Experience the glamour and excitement of Monaco.', '2026-05-24 14:00:00', 'Circuit de Monaco, Monaco', 299.99, 50000, 50000, 'RACE'),
('F1 British Grand Prix 2026', 'Home of British motorsport at the legendary Silverstone Circuit.', '2026-07-05 14:00:00', 'Silverstone Circuit, UK', 199.99, 140000, 140000, 'RACE'),
('F1 Italian Grand Prix 2026', 'The Temple of Speed - Experience the passion at Monza.', '2026-09-06 14:00:00', 'Autodromo Nazionale Monza, Italy', 249.99, 113860, 113860, 'RACE'),
('F1 Abu Dhabi Grand Prix 2026', 'Season finale under the lights at Yas Marina Circuit.', '2026-11-29 17:00:00', 'Yas Marina Circuit, UAE', 279.99, 60000, 60000, 'RACE'),
('F1 Practice Session - Bahrain', 'Free Practice sessions at Bahrain International Circuit.', '2026-03-15 13:00:00', 'Bahrain International Circuit', 89.99, 80000, 80000, 'PRACTICE');

-- Create admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@f1hub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'ADMIN');