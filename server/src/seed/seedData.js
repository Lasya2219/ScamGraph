import driver, { getSession } from '../config/database.js';

const seedGraph = async () => {
  const session = getSession();
  try {
    console.log('Starting ScamGraph seed...');

    await session.run('MATCH (n) DETACH DELETE n');

    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (sa:ScamActor) REQUIRE sa.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (sc:ScamCampaign) REQUIRE sc.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (st:ScamType) REQUIRE st.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (ind:Indicator) REQUIRE ind.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (inc:Incident) REQUIRE inc.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (org:Organization) REQUIRE org.id IS UNIQUE');

    await session.run(`
      CREATE (sa1:ScamActor {
        id: 'sa-1', name: 'Syndicate Alpha', aliases: ['Alpha Network', 'Shadow Payers'], 
        originRegion: 'South Asia', riskLevel: 'High', description: 'Organized financial cybercrime syndicate specializing in utility bill fraud.'
      })
      CREATE (sa2:ScamActor {
        id: 'sa-2', name: 'PhishCraft Network', aliases: ['CraftPhish Syndicate'], 
        originRegion: 'Eastern Europe', riskLevel: 'Critical', description: 'Advanced phishing network targeting banking credentials and payment portals.'
      })
      CREATE (sa3:ScamActor {
        id: 'sa-3', name: 'Digital Vault Syndicate', aliases: ['VaultBot Crew'], 
        originRegion: 'Southeast Asia', riskLevel: 'Medium', description: 'Syndicate running Telegram task scams and fake investment schemes.'
      })

      CREATE (sc1:ScamCampaign { id: 'sc-1', name: 'Fake Electricity Bill Scam Wave', activePeriod: '2024 - Present', estimatedLoss: '$450,000', description: 'Fraudulent SMS alerts threatening immediate power disconnection unless paid to a mule UPI ID.' })
      CREATE (sc2:ScamCampaign { id: 'sc-2', name: 'Bank KYC Renewal Fraud', activePeriod: '2024 - Present', estimatedLoss: '$850,000', description: 'Phishing campaign tricking users into submitting bank credentials on fake verification domains.' })
      CREATE (sc3:ScamCampaign { id: 'sc-3', name: 'Telegram Part-Time Job Scam', activePeriod: '2023 - 2024', estimatedLoss: '$200,000', description: 'Task scam promising high returns for rating products, requiring upfront deposit payments.' })
      CREATE (sc4:ScamCampaign { id: 'sc-4', name: 'Loan Approval Fee Fraud', activePeriod: '2024 - Present', estimatedLoss: '$310,000', description: 'Fake instant loan offers requiring non-refundable processing fees.' })

      CREATE (st1:ScamType { id: 'st-1', name: 'Utility Bill Fraud', category: 'Impersonation Fraud', tactics: 'SMS Threat, Urgent Disconnection' })
      CREATE (st2:ScamType { id: 'st-2', name: 'Banking Phishing', category: 'Credential Theft', tactics: 'Smishing, Fake KYC Web Form' })
      CREATE (st3:ScamType { id: 'st-3', name: 'Task Investment Fraud', category: 'Advance-Fee Scam', tactics: 'Telegram Tasks, Ponzi Returns' })
      CREATE (st4:ScamType { id: 'st-4', name: 'Instant Loan Fraud', category: 'Advance-Fee Scam', tactics: 'Fake Approval Notice, Processing Fee' })
      
      CREATE (ind1:Indicator { id: 'ind-1', value: 'fastpay-mule@example.test', type: 'UPI / Payment Handle', status: 'Active Fraud', firstReported: '2024-01-15' })
      CREATE (ind2:Indicator { id: 'ind-2', value: '+91-90000-00001', type: 'Phone Number', status: 'Active Fraud', firstReported: '2024-02-01' })
      CREATE (ind3:Indicator { id: 'ind-3', value: 'bank-verify.example.test', type: 'Phishing Domain', status: 'Blocked', firstReported: '2024-03-10' })
      CREATE (ind4:Indicator { id: 'ind-4', value: 'electricity-help@example.test', type: 'Email Address', status: 'Active Fraud', firstReported: '2024-01-20' })
      CREATE (ind5:Indicator { id: 'ind-5', value: '+91-90000-00002', type: 'Phone Number', status: 'Active Fraud', firstReported: '2024-04-05' })

      CREATE (inc1:Incident { id: 'inc-1', title: 'Power Disconnection Panic Report #101', reportedDate: '2024-02-10', amountLost: '$1,200', description: 'Victim paid fraudulent power bill threat via mule payment handle.' })
      CREATE (inc2:Incident { id: 'inc-2', title: 'Unauthorized Account Drain Report #102', reportedDate: '2024-03-15', amountLost: '$15,000', description: 'Victim submitted net banking credentials on fake verification domain.' })
      CREATE (inc3:Incident { id: 'inc-3', title: 'Telegram Task Deposit Loss Report #103', reportedDate: '2024-04-01', amountLost: '$3,500', description: 'Victim deposited funds for product rating tasks that were never refunded.' })
      CREATE (inc4:Incident { id: 'inc-4', title: 'Processing Fee Fraud Report #104', reportedDate: '2024-04-12', amountLost: '$800', description: 'Victim paid loan approval fee but received no loan disbursement.' })

      CREATE (org1:Organization { id: 'org-1', name: 'State Electricity Board', industry: 'Utilities', region: 'North' })
      CREATE (org2:Organization { id: 'org-2', name: 'Metro Commercial Bank', industry: 'Banking & Finance', region: 'National' })
      CREATE (org3:Organization { id: 'org-3', name: 'Global Financial Trust', industry: 'Banking & Finance', region: 'International' })
      CREATE (org4:Organization { id: 'org-4', name: 'National Power Grid Corp', industry: 'Utilities', region: 'National' })
      
      CREATE (sa1)-[:CONDUCTS]->(sc1)
      CREATE (sa2)-[:CONDUCTS]->(sc2)
      CREATE (sa3)-[:CONDUCTS]->(sc3)
      CREATE (sa1)-[:CONDUCTS]->(sc4)

      CREATE (sc1)-[:HAS_TYPE]->(st1)
      CREATE (sc2)-[:HAS_TYPE]->(st2)
      CREATE (sc3)-[:HAS_TYPE]->(st3)
      CREATE (sc4)-[:HAS_TYPE]->(st4)

      CREATE (sc1)-[:USES]->(ind1)
      CREATE (sc1)-[:USES]->(ind2)
      CREATE (sc1)-[:USES]->(ind4)

      CREATE (sc2)-[:USES]->(ind1) 
      CREATE (sc2)-[:USES]->(ind3)

      CREATE (sc3)-[:USES]->(ind5)

      CREATE (sc4)-[:USES]->(ind2)  !

      
      CREATE (sc1)-[:ASSOCIATED_WITH]->(inc1)
      CREATE (sc2)-[:ASSOCIATED_WITH]->(inc2)
      CREATE (sc3)-[:ASSOCIATED_WITH]->(inc3)
      CREATE (sc4)-[:ASSOCIATED_WITH]->(inc4)

      
      CREATE (inc1)-[:TARGETS]->(org1)
      CREATE (inc2)-[:TARGETS]->(org2)
      CREATE (inc3)-[:TARGETS]->(org3)
      CREATE (inc4)-[:TARGETS]->(org4)
    `);

    console.log('ScamGraph seed completed successfully! Synthetic CTI -> CSI graph populated.');
  } catch (error) {
    console.error('ScamGraph seed failed:', error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedGraph();