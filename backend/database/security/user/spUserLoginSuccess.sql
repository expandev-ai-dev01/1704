/**
 * @summary
 * Records a successful login, creates a new user session, and resets any account lockout.
 * 
 * @procedure spUserLoginSuccess
 * @schema security
 * @type stored-procedure
 * 
 * @endpoints
 * - Used internally by the login process after successful authentication.
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: The account identifier.
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: The identifier of the user who logged in.
 * @param {VARCHAR(45)} ipAddress
 *   - Required: Yes
 *   - Description: The IP address from which the login was made.
 * @param {NVARCHAR(500)} userAgent
 *   - Required: Yes
 *   - Description: The user agent of the client.
 * @param {NVARCHAR(1024)} token
 *   - Required: Yes
 *   - Description: The JWT generated for the session.
 * @param {DATETIME2} expiresAt
 *   - Required: Yes
 *   - Description: The expiration timestamp of the token.
 * 
 * @testScenarios
 * - Log a successful login and create a new session.
 * - Ensure failed login attempts are reset for the user.
 * - Verify that old sessions are removed if the session limit is exceeded.
 */
CREATE OR ALTER PROCEDURE [security].[spUserLoginSuccess]
    @idAccount INT,
    @idUser INT,
    @ipAddress VARCHAR(45),
    @userAgent NVARCHAR(500),
    @token NVARCHAR(1024),
    @expiresAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @maxSessions INT = 5;
    DECLARE @email NVARCHAR(255);

    SELECT @email = [usr].[email] FROM [security].[user] [usr] WHERE [usr].[idUser] = @idUser;

    BEGIN TRY
        BEGIN TRAN;

        -- Reset failed login attempts and lockout status for the user
        UPDATE [security].[user]
        SET 
            [failedLoginAttempts] = 0,
            [lockoutUntil] = NULL
        WHERE [idUser] = @idUser;

        -- Log the successful attempt
        INSERT INTO [security].[loginAttempt] 
            ([idAccount], [idUser], [emailAttempt], [ipAddress], [userAgent], [wasSuccess])
        VALUES 
            (@idAccount, @idUser, @email, @ipAddress, @userAgent, 1);

        -- Create the new session record
        INSERT INTO [security].[userSession]
            ([idAccount], [idUser], [token], [ipAddress], [userAgent], [expiresAt])
        VALUES
            (@idAccount, @idUser, @token, @ipAddress, @userAgent, @expiresAt);

        -- Enforce session limit: remove the oldest sessions if count exceeds maxSessions
        WITH [RankedSessions] AS (
            SELECT 
                [us].[idUserSession],
                ROW_NUMBER() OVER (ORDER BY [us].[createdAt] DESC) AS [rn]
            FROM [security].[userSession] [us]
            WHERE [us].[idUser] = @idUser
              AND [us].[revoked] = 0
              AND [us].[expiresAt] > GETUTCDATE()
        )
        DELETE FROM [security].[userSession]
        WHERE [idUserSession] IN (
            SELECT [rs].[idUserSession] 
            FROM [RankedSessions] [rs] 
            WHERE [rs].[rn] > @maxSessions
        );

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH;

END;
GO
