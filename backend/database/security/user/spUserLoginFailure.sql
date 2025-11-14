/**
 * @summary
 * Records a failed login attempt and updates the user's lockout status if necessary.
 * 
 * @procedure spUserLoginFailure
 * @schema security
 * @type stored-procedure
 * 
 * @endpoints
 * - Used internally by the login process after a failed authentication.
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: The account identifier.
 * @param {NVARCHAR(255)} email
 *   - Required: Yes
 *   - Description: The email address used in the failed attempt.
 * @param {VARCHAR(45)} ipAddress
 *   - Required: Yes
 *   - Description: The IP address from which the attempt was made.
 * @param {NVARCHAR(500)} userAgent
 *   - Required: Yes
 *   - Description: The user agent of the client.
 * 
 * @testScenarios
 * - Log a failed attempt for an existing user, incrementing the counter.
 * - Log a fifth failed attempt, triggering an account lockout.
 * - Log a failed attempt for a non-existent user email.
 */
CREATE OR ALTER PROCEDURE [security].[spUserLoginFailure]
    @idAccount INT,
    @email NVARCHAR(255),
    @ipAddress VARCHAR(45),
    @userAgent NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idUser INT;
    DECLARE @failedAttempts INT;
    DECLARE @lockoutDurationMinutes INT = 15;
    DECLARE @maxFailedAttempts INT = 5;

    -- Find the user to update their failed attempts count
    SELECT 
        @idUser = [usr].[idUser],
        @failedAttempts = [usr].[failedLoginAttempts]
    FROM [security].[user] [usr]
    WHERE [usr].[idAccount] = @idAccount
      AND [usr].[email] = @email
      AND [usr].[deleted] = 0;

    -- Log the failed attempt regardless of whether the user exists
    INSERT INTO [security].[loginAttempt] 
        ([idAccount], [idUser], [emailAttempt], [ipAddress], [userAgent], [wasSuccess])
    VALUES 
        (@idAccount, @idUser, @email, @ipAddress, @userAgent, 0);

    -- If the user exists, update their failed attempt status
    IF @idUser IS NOT NULL
    BEGIN
        SET @failedAttempts = @failedAttempts + 1;

        IF @failedAttempts >= @maxFailedAttempts
        BEGIN
            -- Lock the account
            UPDATE [security].[user]
            SET 
                [failedLoginAttempts] = @failedAttempts,
                [lockoutUntil] = DATEADD(MINUTE, @lockoutDurationMinutes, GETUTCDATE())
            WHERE [idUser] = @idUser;
        END
        ELSE
        BEGIN
            -- Just increment the counter
            UPDATE [security].[user]
            SET [failedLoginAttempts] = @failedAttempts
            WHERE [idUser] = @idUser;
        END
    END

END;
GO
