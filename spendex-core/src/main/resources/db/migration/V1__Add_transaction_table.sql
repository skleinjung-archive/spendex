CREATE TABLE spendex_transaction (
  id               INT     NOT NULL PRIMARY KEY,
  transaction_date DATE    NOT NULL,
  amount           DECIMAL NOT NULL,
  description      VARCHAR(512),
  category         VARCHAR(128)
);

ALTER TABLE spendex_transaction
  ADD CONSTRAINT uq_transaction UNIQUE (transaction_date, amount, description);
