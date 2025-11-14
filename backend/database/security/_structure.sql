/**
 * @schema security
 * Contains tables and logic for authentication, authorization, roles, and permissions.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END
GO

-- Add security-related tables here.
-- Example:
/*
CREATE TABLE [security].[role] (
    [idRole] INTEGER IDENTITY(1,1) NOT NULL,
    [idAccount] INTEGER NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [deleted] BIT NOT NULL DEFAULT(0)
);

CREATE TABLE [security].[userRole] (
    [idAccount] INTEGER NOT NULL,
    [idUser] INTEGER NOT NULL,
    [idRole] INTEGER NOT NULL
);
*/
