-- Drop the RolePermissions table that is no longer needed
-- This will remove the foreign key constraints causing the "too many keys" error

DROP TABLE IF EXISTS `RolePermissions`;

-- Optionally, you can also clean up any orphaned indexes on the Roles table
-- But the sync({ alter: true }) should handle this automatically after dropping RolePermissions
