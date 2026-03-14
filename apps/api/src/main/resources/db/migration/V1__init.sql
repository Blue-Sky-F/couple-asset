CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  status TINYINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE households (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE household_members (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_household_members_household_user (household_id, user_id),
  KEY idx_household_members_household_id (household_id),
  KEY idx_household_members_user_id (user_id),
  CONSTRAINT fk_household_members_household_id FOREIGN KEY (household_id) REFERENCES households (id),
  CONSTRAINT fk_household_members_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assets (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT NOT NULL,
  scope VARCHAR(20) NOT NULL,
  owner_user_id BIGINT NULL,
  type VARCHAR(30) NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(19,2) NOT NULL,
  note VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assets_household_id (household_id),
  KEY idx_assets_owner_user_id (owner_user_id),
  CONSTRAINT fk_assets_household_id FOREIGN KEY (household_id) REFERENCES households (id),
  CONSTRAINT fk_assets_owner_user_id FOREIGN KEY (owner_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transactions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT NOT NULL,
  scope VARCHAR(20) NOT NULL,
  owner_user_id BIGINT NULL,
  direction VARCHAR(20) NOT NULL,
  category VARCHAR(30) NOT NULL,
  amount DECIMAL(19,2) NOT NULL,
  occurred_at DATETIME NOT NULL,
  note VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_transactions_household_id (household_id),
  KEY idx_transactions_owner_user_id (owner_user_id),
  KEY idx_transactions_occurred_at (occurred_at),
  CONSTRAINT fk_transactions_household_id FOREIGN KEY (household_id) REFERENCES households (id),
  CONSTRAINT fk_transactions_owner_user_id FOREIGN KEY (owner_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

