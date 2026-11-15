-- One-time migration for the existing local UUID schema.
-- Run with the auth service stopped. No foreign keys may reference app_users.id.
-- Keep the original UUIDs so existing account identifiers are not lost.
ALTER TABLE app_users
    CHANGE COLUMN id legacy_uuid BINARY(16) NULL,
    DROP PRIMARY KEY,
    ADD UNIQUE KEY uk_app_users_legacy_uuid (legacy_uuid),
    ADD COLUMN id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
