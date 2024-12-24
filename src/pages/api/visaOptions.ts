// pages/api/visaOptions.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Generalized visa options data
const visaOptions = [
  {
    nationality: 'All',
    destination: 'Oman',
    visaRequired: true,
    nationalityId: 0, // Indicates all nationalities
    destinationId: 1,
    destinationFlag: '🇴🇲',
    nationalityFlag: '🌍', // Generic flag for all
    lastUpdated: new Date().toISOString(),
    successRate: 95,
    visaTypes: [
      {
        type: '10 Days Tourist Visa',
        stayPeriod: 10,
        validityPeriod: 30,
        entryType: 'Single',
        fees: {
          omr: 15
        },
        approvalIndex: 'Easy',
        easeOfApplication: 'Easy',
        processingTime: '1-2 Business Days',
        overstayPenalty: {
          dailyFee: 10,
          maxFee: 300
        },
        requirements: ['Valid Passport', 'Passport-sized Photographs'],
        benefits: ['10 Days Stay', 'Single Entry', 'Tourist Purposes'],
        priority: false
      },
      {
        type: '30 Days Tourist Visa',
        stayPeriod: 30,
        validityPeriod: 60,
        entryType: 'Single',
        fees: {
          omr: 30
        },
        approvalIndex: 'Easy',
        easeOfApplication: 'Easy',
        processingTime: '1-2 Business Days',
        overstayPenalty: {
          dailyFee: 10,
          maxFee: 300
        },
        requirements: ['Valid Passport', 'Passport-sized Photographs'],
        benefits: ['30 Days Stay', 'Single Entry', 'Tourist Purposes'],
        priority: false
      }
    ]
  },
  {
    nationality: 'All',
    destination: 'United Arab Emirates',
    visaRequired: true,
    nationalityId: 0, // Indicates all nationalities
    destinationId: 2,
    destinationFlag: '🇦🇪',
    nationalityFlag: '🌍', // Generic flag for all
    lastUpdated: new Date().toISOString(),
    successRate: 92,
    visaTypes: [
      {
        type: '30 Days Tourist Visa',
        stayPeriod: 30,
        validityPeriod: 60,
        entryType: 'Single',
        fees: {
          omr: 45
        },
        approvalIndex: 'Easy',
        easeOfApplication: 'Easy',
        processingTime: '3-5 Business Days',
        overstayPenalty: {
          dailyFee: 100,
          maxFee: 5000
        },
        requirements: ['Valid Passport', 'Passport-sized Photographs'],
        benefits: ['30 Days Stay', 'Single Entry', 'Tourist Purposes'],
        priority: false
      },
      {
        type: '60 Days Tourist Visa',
        stayPeriod: 60,
        validityPeriod: 90,
        entryType: 'Single',
        fees: {
          omr: 56
        },
        approvalIndex: 'Moderate',
        easeOfApplication: 'Moderate',
        processingTime: '3-5 Business Days',
        overstayPenalty: {
          dailyFee: 100,
          maxFee: 5000
        },
        requirements: ['Valid Passport', 'Passport-sized Photographs'],
        benefits: ['60 Days Stay', 'Single Entry', 'Tourist Purposes'],
        priority: true
      }
    ]
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json({ visaOptions });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
