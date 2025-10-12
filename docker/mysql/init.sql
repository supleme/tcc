CREATE TABLE IF NOT EXISTS users (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  email_verified_at DATETIME NULL,
  password VARCHAR(255),
  type VARCHAR(50),
  RA VARCHAR(20),
  course VARCHAR(50),
  period INT,
  address VARCHAR(255),
  city VARCHAR(100),
  telephone VARCHAR(20),
  birth_date DATE,
  CPF VARCHAR(20),
  active TINYINT(1),
  position VARCHAR(100),
  admission_date DATE,
  hours_available INT,
  remember_token VARCHAR(100),
  created_at DATETIME,
  updated_at DATETIME
);

INSERT INTO users (
  id_usuario, name, email, password, type, RA, course, period, address, city, telephone,
  birth_date, CPF, active, hours_available, created_at, updated_at
) VALUES (
  2,
  'admin',
  'admin@email.com',
  '$2y$12$udHAt1lRrHJiup7mIFixCebyZNRyM76puIvKSYm3gZakCaDAQ7rYy',
  'Coordinator',
  '11111111',
  'admin',
  1,
  'centro',
  'gorpa',
  '1111111111',
  '2000-01-01',
  '123',
  1,
  3,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE id_usuario = id_usuario;
