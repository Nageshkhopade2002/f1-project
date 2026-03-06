-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);

-- Bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    number_of_tickets INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    seat_numbers VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Sample events data
INSERT INTO events (name, description, event_date, venue, ticket_price, total_seats, available_seats) VALUES
('F1 Monaco Grand Prix 2026', 'The most prestigious race in Formula 1 calendar', '2026-05-24 14:00:00', 'Circuit de Monaco', 299.99, 50000, 50000),
('F1 British Grand Prix 2026', 'Home of British motorsport at Silverstone', '2026-07-05 14:00:00', 'Silverstone Circuit', 199.99, 140000, 140000),
('F1 Italian Grand Prix 2026', 'The Temple of Speed - Monza', '2026-09-06 14:00:00', 'Autodromo Nazionale Monza', 249.99, 113860, 113860);