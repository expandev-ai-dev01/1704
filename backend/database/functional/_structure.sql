/**
 * @schema functional
 * Contains tables and logic related to the core business entities and operations of the application.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
    EXEC('CREATE SCHEMA functional');
END
GO

-- Add business entity tables here as features are developed.
-- Example:
/*
CREATE TABLE [functional].[user] (
    [idUser] INTEGER IDENTITY(1,1) NOT NULL,
    [idAccount] INTEGER NOT NULL,
    [email] NVARCHAR(256) NOT NULL,
    [passwordHash] NVARCHAR(256) NOT NULL,
    [firstName] NVARCHAR(100) NOT NULL,
    [lastName] NVARCHAR(100) NOT NULL,
    [dateCreated] DATETIME2 NOT NULL DEFAULT(GETUTCDATE()),
    [deleted] BIT NOT NULL DEFAULT(0)
);
*/
