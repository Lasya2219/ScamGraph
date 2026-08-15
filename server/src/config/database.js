import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const { COGNO_DB_URI, COGNO_DB_USER, COGNO_DB_PASSWORD } = process.env;

const driver = neo4j.driver(
  COGNO_DB_URI,
  neo4j.auth.basic(COGNO_DB_USER, COGNO_DB_PASSWORD)
);

export const verifyConnection = async () => {
  const session = driver.session();
  try {
    await session.run('RETURN 1 AS result');
    console.log('✅ Connected to CognoDB Cloud successfully over Bolt!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    await session.close();
  }
};

export const getSession = () => driver.session();
export default driver;