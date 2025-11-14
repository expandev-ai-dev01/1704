import sql, { IRecordSet, ConnectionPool, Transaction, PreparedStatement } from 'mssql';
import { config } from '@/config';

const sqlConfig = {
  user: config.database.user,
  password: config.database.password,
  server: config.database.server,
  database: config.database.database,
  port: config.database.port,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
  },
};

let pool: ConnectionPool;

/**
 * @summary Gets the singleton connection pool instance.
 * @returns {Promise<ConnectionPool>} The connection pool.
 */
export const getPool = async (): Promise<ConnectionPool> => {
  if (!pool || !pool.connected) {
    try {
      pool = await new ConnectionPool(sqlConfig).connect();
      pool.on('error', (err) => {
        console.error('SQL Connection Pool Error:', err);
        // Optionally try to reconnect or handle the error
      });
      console.log('Database connection pool established.');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
};

/**
 * @summary Executes a stored procedure with the given parameters.
 * @param {string} procedureName - The name of the stored procedure (e.g., '[schema].[spName]').
 * @param {object} params - An object containing the input parameters for the procedure.
 * @returns {Promise<IRecordSet<any>[]>} The result sets from the stored procedure.
 */
export const executeProcedure = async (
  procedureName: string,
  params: Record<string, any> = {}
): Promise<IRecordSet<any>[]> => {
  const connectionPool = await getPool();
  const request = connectionPool.request();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      // Type inference can be improved here if needed
      request.input(key, params[key]);
    }
  }

  const result = await request.execute(procedureName);
  return result.recordsets;
};

// Export sql object for direct access to types like sql.Int, sql.NVarChar, etc.
export { sql, Transaction, PreparedStatement };
