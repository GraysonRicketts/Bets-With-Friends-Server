CREATE USER server_user;
ALTER USER server_user WITH PASSWORD;

CREATE DATABASE bets_with_friends;
GRANT CONNECT ON DATABASE bets_with_friends TO server_user;
GRANT USAGE ON SCHEMA public TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO server_user;
ALTER USER server_user CREATEDB;

SET TIMEZONE='GMT';