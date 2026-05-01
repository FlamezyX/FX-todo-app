CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('task', 'habit', 'goal', 'achievement', 'system') DEFAULT 'system',
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users
  ADD COLUMN notif_tasks BOOLEAN DEFAULT TRUE,
  ADD COLUMN notif_habits BOOLEAN DEFAULT TRUE,
  ADD COLUMN notif_goals BOOLEAN DEFAULT TRUE;
