import * as authService from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser({ name, email, password });
    res.status(201).json({
      message: 'Account created successfully',
      user: data.user,
      token: data.token,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || 'Signup failed. Please try again.' });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    res.json({
      message: 'Login successful',
      user: data.user,
      token: data.token,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || 'Login failed. Please check credentials.' });
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
