-- Script for importing an exported database
DROP database gymsystem;    -- First remove database
CREATE database gymsystem;  -- ... and recreate it.
USE gymsystem;              -- Select the database as default
SET FOREIGN_KEY_CHECKS=0;   -- Disable key checking

-- Run your export script here




-- End export script
SET FOREIGN_KEY_CHECKS=1;   -- Reenable key checking.
