TRUNCATE goats RESTART IDENTITY;

-- DROP TABLE deletes the whole the table the table is gone
-- TRUNCATE will remove all rows from the table, it removes the data within the table

INSERT INTO goats (name, age)
VALUES
    ('goat 1', 1),
    ('goat 2', 2),
    ('goat 3', 3);
