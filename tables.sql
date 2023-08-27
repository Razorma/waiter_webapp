CREATE TABLE IF NOT EXISTS days (
    id serial PRIMARY KEY,
    day varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS shifts(
    id serial PRIMARY KEY,
    waiter_name varchar(20) NOT NULL,
    day_id int REFERENCES days(id) ON DELETE CASCADE,
);

CREATE TABLE IF NOT EXISTS waiters(
    id serial PRIMARY KEY,
    user_name varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    role varchar(255) NOT NULL,
    CONSTRAINT unique_user_name UNIQUE (user_name)
);

INSERT INTO days (day)
      SELECT * FROM (VALUES
        ('sunday'),
        ('monday'),
        ('tuesday'),
        ('wednesday'),
        ('thursday'),
        ('friday'),
        ('saturday')
      ) AS new_day(day)
      WHERE NOT EXISTS (
        SELECT 1 FROM days WHERE day = new_day.day
      );



