import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
    process.env.COGNO_DB_URI,
    neo4j.auth.basic(
        process.env.COGNO_DB_USER,
        process.env.COGNO_DB_PASSWORD
    )
);

try {
    await driver.verifyConnectivity();
    console.log('✅ CognoDB connection successful!');
} catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
} finally {
    await driver.close();
}