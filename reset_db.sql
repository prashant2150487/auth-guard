-- Clean reset of the database to fix "Too many keys" and deadlock issues
-- This will drop all tables and allow Sequelize to recreate them cleanly

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `UserPermissions`;
DROP TABLE IF EXISTS `RolePermissions`; -- Just in case it still exists
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Roles`;
DROP TABLE IF EXISTS `Permissions`;

SET FOREIGN_KEY_CHECKS = 1;
