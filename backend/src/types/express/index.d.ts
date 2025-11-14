// This file is used to extend the Express Request type.

declare namespace Express {
  export interface Request {
    // --- AUTHENTICATION INTEGRATION POINT ---
    // Add user property here after implementing auth middleware.
    // This will hold the decoded JWT payload.
    // Example:
    // user?: {
    //   idUser: number;
    //   idAccount: number;
    //   roles: string[];
    // };
  }
}
