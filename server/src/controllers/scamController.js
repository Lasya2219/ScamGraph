import * as scamService from '../services/scamService.js';
import { verifyConnection } from '../config/database.js';

export const healthCheck = async (req, res, next) => {
  try {
    await verifyConnection();
    res.json({ status: 'ok', databaseConnected: true });
  } catch (error) {
    res.status(503).json({ status: 'error', databaseConnected: false, message: 'Database connection failed' });
  }
};

export const searchScamEntities = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const entities = await scamService.searchEntities(q);
    res.json(entities);
  } catch (error) {
    next(error);
  }
};

export const getEntityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entity = await scamService.getEntityDetails(id);
    if (!entity) return res.status(404).json({ error: 'Scam entity not found' });
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

export const getInvestigationGraph = async (req, res, next) => {
  try {
    const { id } = req.params;
    const graphData = await scamService.getInvestigationGraphPayload(id);
    res.json(graphData);
  } catch (error) {
    next(error);
  }
};

export const getSharedIndicatorOverlaps = async (req, res, next) => {
  try {
    const { id } = req.params;
    const overlaps = await scamService.getSharedIndicatorOverlaps(id);
    res.json({ overlaps });
  } catch (error) {
    next(error);
  }
};
