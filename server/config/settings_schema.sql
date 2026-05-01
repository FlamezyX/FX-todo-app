USE fx_todo;

ALTER TABLE users
  ADD COLUMN time_format ENUM('12h', '24h') DEFAULT '12h',
  ADD COLUMN accent_color VARCHAR(20) DEFAULT '#7c3aed';
