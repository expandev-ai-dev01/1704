/**
 * @summary
 * Retrieves a user's security information by their email address for a specific account.
 * 
 * @procedure spUserGetByEmail
 * @schema security
 * @type stored-procedure
 * 
 * @endpoints
 * - Used internally by the login process.
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: The account identifier to scope the user search.
 * @param {NVARCHAR(255)} email
 *   - Required: Yes
 *   - Description: The email address of the user to retrieve.
 * 
 * @testScenarios
 * - Retrieve an existing, active user.
 * - Attempt to retrieve a user with a non-existent email.
 * - Attempt to retrieve a user from a different account.
 */
CREATE OR ALTER PROCEDURE [security].[spUserGetByEmail]
    @idAccount INT,
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    /**
    * @output {UserDetails, 1, 1}
    * @column {INT} idUser - The user's unique identifier.
    * @column {NVARCHAR(255)} passwordHash - The user's hashed password.
    * @column {NVARCHAR(200)} name - The user's full name.
    * @column {INT} failedLoginAttempts - Current count of consecutive failed login attempts.
    * @column {DATETIME2} lockoutUntil - The timestamp until which the account is locked.
    */
    SELECT
        [usr].[idUser],
        [usr].[passwordHash],
        [usr].[name],
        [usr].[failedLoginAttempts],
        [usr].[lockoutUntil]
    FROM [security].[user] [usr]
    WHERE [usr].[idAccount] = @idAccount
      AND [usr].[email] = @email
      AND [usr].[deleted] = 0;

END;
GO
