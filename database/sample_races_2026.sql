-- Add sample race events for 2026
-- First, ensure we have a season for 2026
INSERT IGNORE INTO season (year, name) VALUES (2026, '2026 Formula 1 World Championship');

-- Get the season ID (assuming it's 1, adjust if needed)
SET @season_id = (SELECT id FROM season WHERE year = 2026 LIMIT 1);

-- Add some sample circuits if they don't exist
INSERT IGNORE INTO circuit (name, country, city, length, turns) VALUES
('Monaco Circuit', 'Monaco', 'Monte Carlo', 3.337, 19),
('Silverstone Circuit', 'United Kingdom', 'Silverstone', 5.891, 18),
('Monza Circuit', 'Italy', 'Monza', 5.793, 11),
('Spa-Francorchamps', 'Belgium', 'Spa', 7.004, 19),
('Suzuka Circuit', 'Japan', 'Suzuka', 5.807, 18);

-- Add sample race events for 2026
INSERT INTO race_event (season_id, circuit_id, round_number, race_name, event_type, start_date, end_date, status) VALUES
(@season_id, 1, 1, 'Monaco Grand Prix', 'RACE', '2026-05-24', '2026-05-24', 'UPCOMING'),
(@season_id, 2, 2, 'British Grand Prix', 'RACE', '2026-07-05', '2026-07-05', 'UPCOMING'),
(@season_id, 3, 3, 'Italian Grand Prix', 'RACE', '2026-09-06', '2026-09-06', 'UPCOMING'),
(@season_id, 4, 4, 'Belgian Grand Prix', 'RACE', '2026-08-30', '2026-08-30', 'UPCOMING'),
(@season_id, 5, 5, 'Japanese Grand Prix', 'RACE', '2026-10-11', '2026-10-11', 'UPCOMING');