CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) 
VALUES ('Dan Abramov', 'https://overreacted.io/things-i-dont-know-as-of-2018/', 'Things I Don''t Know as of 2018', 0);

INSERT INTO blogs (author, url, title, likes) 
VALUES ('Martin Fowler', 'https://martinfowler.com/articles/continuousIntegration.html', 'Continuous Integration', 12);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);