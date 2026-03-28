CREATE TABLE asset_history (
  id BIGINT NOT NULL AUTO_INCREMENT,
  household_id BIGINT NOT NULL,
  record_month VARCHAR(7) NOT NULL, -- YYYY-MM
  total_amount DECIMAL(19,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_asset_history_household_month (household_id, record_month),
  KEY idx_asset_history_household_id (household_id),
  CONSTRAINT fk_asset_history_household_id FOREIGN KEY (household_id) REFERENCES households (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
