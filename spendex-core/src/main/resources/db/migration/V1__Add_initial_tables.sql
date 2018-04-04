CREATE TABLE uploaded_file (
  id          INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename    VARCHAR(64) NOT NULL,
  upload_time TIMESTAMP   NOT NULL
);
ALTER TABLE uploaded_file
  ADD CONSTRAINT uq_name UNIQUE (filename);


CREATE TABLE spendex_transaction (
  id               INT     NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uploaded_file_id INT     NOT NULL,
  transaction_date DATE    NOT NULL,
  week             INT     NOT NULL,
  amount           DECIMAL NOT NULL,
  description      VARCHAR(512),
  category         VARCHAR(128),
  FOREIGN KEY (uploaded_file_id) REFERENCES uploaded_file (id)
);

-- valid data file has 'duplicates', so we don't use this constraint
-- ALTER TABLE spendex_transaction
--   ADD CONSTRAINT uq_transaction UNIQUE (transaction_date, amount, description);
