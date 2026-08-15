// Universal search across ScamActor, ScamCampaign, and Indicator
export const SEARCH_SCAM_ENTITIES = `
  MATCH (n)
  WHERE (n:ScamActor AND (toLower(n.name) CONTAINS toLower($searchTerm) OR ANY(alias IN n.aliases WHERE toLower(alias) CONTAINS toLower($searchTerm))))
     OR (n:ScamCampaign AND toLower(n.name) CONTAINS toLower($searchTerm))
     OR (n:Indicator AND toLower(n.value) CONTAINS toLower($searchTerm))
  RETURN n.id AS id, 
         COALESCE(n.name, n.value) AS name, 
         n.value AS value, 
         labels(n)[0] AS type, 
         n.type AS indicatorType,
         n.originRegion AS originRegion,
         n.riskLevel AS riskLevel,
         n.estimatedLoss AS estimatedLoss
  LIMIT 10
`;

// Single entity lookup by ID
export const GET_ENTITY_BY_ID = `
  MATCH (n {id: $entityId})
  RETURN n, labels(n)[0] AS type
`;

// Investigation graph traversal (1 to 3 hops)
export const GET_INVESTIGATION_GRAPH = `
  MATCH path = (start)-[:CONDUCTS|USES|HAS_TYPE|ASSOCIATED_WITH|TARGETS*1..3]-(target)
  WHERE start.id = $entityId
  RETURN path
`;

// Shared indicator overlap query
export const GET_SHARED_INDICATOR_OVERLAPS = `
  MATCH (c1:ScamCampaign)-[:USES]->(i:Indicator)<-[:USES]-(c2:ScamCampaign)
  WHERE c1 <> c2 AND (c1.id = $entityId OR c2.id = $entityId OR i.id = $entityId)
  MATCH (a1:ScamActor)-[:CONDUCTS]->(c1)
  MATCH (a2:ScamActor)-[:CONDUCTS]->(c2)
  RETURN 
    c1.name AS sourceCampaign, 
    a1.name AS sourceActor,
    i.value AS sharedIndicator, 
    i.type AS indicatorType,
    c2.name AS relatedCampaign, 
    a2.name AS relatedActor
`;