/**
 * @schema security
 * Contains tables and logic for authentication, authorization, roles, and permissions.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END
GO

/*
DROP TABLE [security].[userSession];
DROP TABLE [security].[loginAttempt];
DROP TABLE [security].[user];
*/

/**
 * @table user Stores user accounts and credentials.
 * @multitenancy true
 * @softDelete true
 * @alias usr
 */
CREATE TABLE [security].[user] (
  [idUser] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(200) NOT NULL,
  [email] NVARCHAR(255) NOT NULL,
  [passwordHash] NVARCHAR(255) NOT NULL,
  [failedLoginAttempts] INTEGER NOT NULL,
  [lockoutUntil] DATETIME2 NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL
);
GO

/**
 * @table loginAttempt Logs every login attempt for security and auditing.
 * @multitenancy true
 * @softDelete false
 * @alias la
 */
CREATE TABLE [security].[loginAttempt] (
  [idLoginAttempt] BIGINT IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NULL, -- Null if the user does not exist
  [emailAttempt] NVARCHAR(255) NOT NULL,
  [ipAddress] VARCHAR(45) NOT NULL,
  [userAgent] NVARCHAR(500) NOT NULL,
  [wasSuccess] BIT NOT NULL,
  [attemptDate] DATETIME2 NOT NULL
);
GO

/**
 * @table userSession Manages active user sessions and tokens.
 * @multitenancy true
 * @softDelete false
 * @alias us
 */
CREATE TABLE [security].[userSession] (
  [idUserSession] BIGINT IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [token] NVARCHAR(1024) NOT NULL,
  [ipAddress] VARCHAR(45) NOT NULL,
  [userAgent] NVARCHAR(500) NOT NULL,
  [expiresAt] DATETIME2 NOT NULL,
  [createdAt] DATETIME2 NOT NULL,
  [revoked] BIT NOT NULL
);
GO

-- Constraints for [security].[user]
/**
 * @primaryKey pkUser
 * @keyType Object
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [pkUser] PRIMARY KEY CLUSTERED ([idUser]);
GO

/**
 * @foreignKey fkUser_Account Links user to a tenant account.
 * @target subscription.account
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [fkUser_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/** @default dfUser_failedLoginAttempts */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_failedLoginAttempts] DEFAULT (0) FOR [failedLoginAttempts];
GO

/** @default dfUser_dateCreated */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_dateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/** @default dfUser_deleted */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_deleted] DEFAULT (0) FOR [deleted];
GO

-- Indexes for [security].[user]
/**
 * @index uqUser_Account_Email
 * @type Search
 * @unique true
 * @filter Ensures email is unique per account for active users.
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqUser_Account_Email]
ON [security].[user]([idAccount], [email])
WHERE [deleted] = 0;
GO

-- Constraints for [security].[loginAttempt]
/**
 * @primaryKey pkLoginAttempt
 * @keyType Object
 */
ALTER TABLE [security].[loginAttempt]
ADD CONSTRAINT [pkLoginAttempt] PRIMARY KEY CLUSTERED ([idLoginAttempt]);
GO

/** @default dfLoginAttempt_attemptDate */
ALTER TABLE [security].[loginAttempt]
ADD CONSTRAINT [dfLoginAttempt_attemptDate] DEFAULT (GETUTCDATE()) FOR [attemptDate];
GO

-- Indexes for [security].[loginAttempt]
/**
 * @index ixLoginAttempt_EmailAttempt_Date
 * @type Search
 * @filter For querying login history by email.
 */
CREATE NONCLUSTERED INDEX [ixLoginAttempt_EmailAttempt_Date]
ON [security].[loginAttempt]([emailAttempt], [attemptDate]);
GO

-- Constraints for [security].[userSession]
/**
 * @primaryKey pkUserSession
 * @keyType Object
 */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [pkUserSession] PRIMARY KEY CLUSTERED ([idUserSession]);
GO

/**
 * @foreignKey fkUserSession_User Links session to a user.
 * @target security.user
 */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [fkUserSession_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/** @default dfUserSession_createdAt */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [dfUserSession_createdAt] DEFAULT (GETUTCDATE()) FOR [createdAt];
GO

/** @default dfUserSession_revoked */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [dfUserSession_revoked] DEFAULT (0) FOR [revoked];
GO

-- Indexes for [security].[userSession]
/**
 * @index ixUserSession_User_Expires
 * @type Search
 * @filter For finding active sessions for a user.
 */
CREATE NONCLUSTERED INDEX [ixUserSession_User_Expires]
ON [security].[userSession]([idUser], [expiresAt])
WHERE [revoked] = 0;
GO
