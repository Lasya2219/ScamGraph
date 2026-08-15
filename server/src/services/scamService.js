import { getSession } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';

export const searchEntities = async (searchTerm = '') => {
  const session = getSession();
  try {
    const result = await session.run(queries.SEARCH_SCAM_ENTITIES, { searchTerm });
    return result.records.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      value: record.get('value'),
      type: record.get('type'),
      indicatorType: record.get('indicatorType'),
      originRegion: record.get('originRegion'),
      riskLevel: record.get('riskLevel'),
      estimatedLoss: record.get('estimatedLoss')
    }));
  } finally {
    await session.close();
  }
};

export const getEntityDetails = async (entityId) => {
  const session = getSession();
  try {
    const result = await session.run(queries.GET_ENTITY_BY_ID, { entityId });
    if (result.records.length === 0) return null;
    const node = result.records[0].get('n');
    const type = result.records[0].get('type');
    return {
      id: node.properties.id,
      name: node.properties.name || node.properties.value || node.properties.title,
      type,
      details: node.properties
    };
  } finally {
    await session.close();
  }
};

export const getInvestigationGraphPayload = async (entityId) => {
  const session = getSession();
  try {
    const result = await session.run(queries.GET_INVESTIGATION_GRAPH, { entityId });
    const nodesMap = new Map();
    const linksMap = new Map();

    result.records.forEach(record => {
      const path = record.get('path');
      if (!path) return;

      path.segments.forEach(segment => {
        const start = segment.start;
        const end = segment.end;
        const rel = segment.relationship;

        const startId = start.properties.id;
        const endId = end.properties.id;

        if (!nodesMap.has(startId)) {
          nodesMap.set(startId, {
            id: startId,
            name: start.properties.name || start.properties.value || start.properties.title,
            type: start.labels[0],
            details: start.properties
          });
        }

        if (!nodesMap.has(endId)) {
          nodesMap.set(endId, {
            id: endId,
            name: end.properties.name || end.properties.value || end.properties.title,
            type: end.labels[0],
            details: end.properties
          });
        }

        const edgeId = `${startId}-${rel.type}-${endId}`;
        if (!linksMap.has(edgeId)) {
          linksMap.set(edgeId, {
            id: edgeId,
            source: startId,
            target: endId,
            label: rel.type
          });
        }
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links: Array.from(linksMap.values())
    };
  } finally {
    await session.close();
  }
};

export const getSharedIndicatorOverlaps = async (entityId) => {
  const session = getSession();
  try {
    const result = await session.run(queries.GET_SHARED_INDICATOR_OVERLAPS, { entityId });
    return result.records.map(record => ({
      sourceCampaign: record.get('sourceCampaign'),
      sourceActor: record.get('sourceActor'),
      sharedIndicator: record.get('sharedIndicator'),
      indicatorType: record.get('indicatorType'),
      relatedCampaign: record.get('relatedCampaign'),
      relatedActor: record.get('relatedActor')
    }));
  } finally {
    await session.close();
  }
};
