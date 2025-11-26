-- Fix the Roles table by removing all duplicate indexes
-- First, disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop the Roles table
DROP TABLE IF EXISTS `Roles`;

-- Recreate the Roles table with clean structure
CREATE TABLE `Roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
