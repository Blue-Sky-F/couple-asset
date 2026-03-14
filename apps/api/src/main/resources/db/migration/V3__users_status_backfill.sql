UPDATE users
SET status =
    CASE
      WHEN status = '1' THEN 'ACTIVE'
      WHEN status = '0' THEN 'DISABLED'
      ELSE status
    END;

