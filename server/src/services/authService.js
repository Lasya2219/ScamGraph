import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSession } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'scamgraph_super_secret_jwt_key_2026';

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const err = new Error('Name, email, and password are required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanEmail = email.trim().toLowerCase();
  const session = getSession();

  try {
    const checkResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: cleanEmail }
    );

    if (checkResult.records.length > 0) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    await session.run(
      `CREATE (u:User {
        id: $userId,
        name: $name,
        email: $email,
        passwordHash: $passwordHash,
        createdAt: $createdAt
      })`,
      { userId, name, email: cleanEmail, passwordHash, createdAt }
    );

    const userPayload = { id: userId, name, email: cleanEmail };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return { user: userPayload, token };
  } finally {
    await session.close();
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanEmail = email.trim().toLowerCase();
  const session = getSession();

  try {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: cleanEmail }
    );

    if (result.records.length === 0) {
      const err = new Error('Invalid email address or password.');
      err.statusCode = 401;
      throw err;
    }

    const userNode = result.records[0].get('u').properties;

    const isPasswordValid = await bcrypt.compare(password, userNode.passwordHash);
    if (!isPasswordValid) {
      const err = new Error('Invalid email address or password.');
      err.statusCode = 401;
      throw err;
    }

    const userPayload = { id: userNode.id, name: userNode.name, email: userNode.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return { user: userPayload, token };
  } finally {
    await session.close();
  }
};
