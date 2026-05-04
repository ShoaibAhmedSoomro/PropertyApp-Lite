/* ════════════════════════════════════════════════════
   RealEstateApp — Mock Data Store
   ════════════════════════════════════════════════════ */

const DB = {

  user: {
    name: 'Sheeraz Shaikh',
    initials: 'SS',
    email: 'admin@asico.ae',
    role: 'Super Admin',
    company: 'Asico Real Estate LLC',
    subscription: 'Enterprise'
  },

  projects: [
    { id: 1, name: 'Marina Heights Development', location: 'Dubai Marina', units: 48, status: 'Active', manager: 'Khalid Hassan', year: 2020 },
    { id: 2, name: 'Downtown Residences', location: 'Downtown Dubai', units: 32, status: 'Active', manager: 'Sara Al Mansoori', year: 2019 },
    { id: 3, name: 'Business Bay Tower', location: 'Business Bay', units: 20, status: 'Active', manager: 'Omar Sheikh', year: 2021 },
    { id: 4, name: 'JBR Ocean View', location: 'Jumeirah Beach Residence', units: 16, status: 'Active', manager: 'Fatima Al Zaabi', year: 2022 },
    { id: 5, name: 'DIFC Office Complex', location: 'DIFC', units: 12, status: 'Active', manager: 'Rami Nasser', year: 2021 }
  ],

  properties: [
    { id: 1, projectId: 1, name: 'Marina Tower A', ref: 'MTA-001', type: 'Residential', location: 'Dubai Marina', units: 24, occupied: 18, booked: 3, vacant: 3, admin: 'Khalid Hassan' },
    { id: 2, projectId: 1, name: 'Marina Tower B', ref: 'MTB-002', type: 'Residential', location: 'Dubai Marina', units: 24, occupied: 20, booked: 2, vacant: 2, admin: 'Khalid Hassan' },
    { id: 3, projectId: 2, name: 'Downtown Heights Block 1', ref: 'DTH-001', type: 'Residential', location: 'Downtown Dubai', units: 16, occupied: 12, booked: 1, vacant: 3, admin: 'Sara Al Mansoori' },
    { id: 4, projectId: 2, name: 'Downtown Heights Block 2', ref: 'DTH-002', type: 'Residential', location: 'Downtown Dubai', units: 16, occupied: 10, booked: 2, vacant: 4, admin: 'Sara Al Mansoori' },
    { id: 5, projectId: 3, name: 'Bay View Suites', ref: 'BVS-001', type: 'Residential', location: 'Business Bay', units: 20, occupied: 14, booked: 3, vacant: 3, admin: 'Omar Sheikh' },
    { id: 6, projectId: 4, name: 'JBR Beachfront Apartments', ref: 'JBR-001', type: 'Residential', location: 'JBR', units: 16, occupied: 11, booked: 2, vacant: 3, admin: 'Fatima Al Zaabi' },
    { id: 7, projectId: 5, name: 'DIFC Gate Office', ref: 'DGO-001', type: 'Commercial', location: 'DIFC', units: 12, occupied: 8, booked: 2, vacant: 2, admin: 'Rami Nasser' }
  ],

  units: [
    { id: 1, propertyId: 1, unitNo: 'A-101', model: '1BR Apartment', layout: 'Type A', block: 'Block A', use: 'Residential', status: 'Occupied', area: 850, rent: 75000 },
    { id: 2, propertyId: 1, unitNo: 'A-102', model: '2BR Apartment', layout: 'Type B', block: 'Block A', use: 'Residential', status: 'Occupied', area: 1200, rent: 110000 },
    { id: 3, propertyId: 1, unitNo: 'A-201', model: 'Studio', layout: 'Type S', block: 'Block A', use: 'Residential', status: 'Vacant', area: 550, rent: 55000 },
    { id: 4, propertyId: 1, unitNo: 'A-202', model: '3BR Apartment', layout: 'Type C', block: 'Block A', use: 'Residential', status: 'Booked', area: 1650, rent: 155000 },
    { id: 5, propertyId: 2, unitNo: 'B-101', model: '1BR Apartment', layout: 'Type A', block: 'Block B', use: 'Residential', status: 'Occupied', area: 870, rent: 80000 },
    { id: 6, propertyId: 2, unitNo: 'B-102', model: '2BR Apartment', layout: 'Type B', block: 'Block B', use: 'Residential', status: 'Occupied', area: 1250, rent: 115000 },
    { id: 7, propertyId: 3, unitNo: 'D1-501', model: '1BR Apartment', layout: 'Type A', block: 'Tower 1', use: 'Residential', status: 'Occupied', area: 900, rent: 90000 },
    { id: 8, propertyId: 3, unitNo: 'D1-502', model: '2BR Apartment', layout: 'Type B', block: 'Tower 1', use: 'Residential', status: 'Vacant', area: 1300, rent: 125000 },
    { id: 9, propertyId: 5, unitNo: 'BB-301', model: '1BR Suite', layout: 'Type S1', block: 'Main', use: 'Residential', status: 'Occupied', area: 800, rent: 85000 },
    { id: 10, propertyId: 7, unitNo: 'DF-201', model: 'Office Unit', layout: 'Office L', block: 'Gate', use: 'Commercial', status: 'Occupied', area: 1800, rent: 200000 },
    { id: 11, propertyId: 7, unitNo: 'DF-202', model: 'Office Unit', layout: 'Office M', block: 'Gate', use: 'Commercial', status: 'Booked', area: 1200, rent: 150000 },
    { id: 12, propertyId: 6, unitNo: 'JBR-401', model: '2BR Sea View', layout: 'Type SV', block: 'Tower 4', use: 'Residential', status: 'Occupied', area: 1400, rent: 140000 }
  ],

  lessors: [
    { id: 1, name: 'Sheikh Mohammed Al Rashidi', email: 'mrashidi@gmail.com', phone: '+971 50 123 4567', eid: '784-1980-1234567-1', properties: 3, totalUnits: 48 },
    { id: 2, name: 'Fatima Holdings LLC', email: 'fm.holdings@ae.com', phone: '+971 4 321 7890', eid: 'N/A (Company)', properties: 2, totalUnits: 32 },
    { id: 3, name: 'Omar Al Mansoori Investment', email: 'oma.invest@gmail.com', phone: '+971 55 987 6543', eid: '784-1975-7654321-3', properties: 2, totalUnits: 28 }
  ],

  tenants: [
    { id: 1, name: 'Aisha Al Farsi', email: 'aisha.alfarsi@gmail.com', phone: '+971 50 234 5678', eid: '784-1990-2345678-1', nationality: 'UAE', verified: true, unitId: 1, contractId: 1 },
    { id: 2, name: 'James Robertson', email: 'james.r@company.com', phone: '+971 55 345 6789', eid: 'PASS-GB-12345678', nationality: 'UK', verified: true, unitId: 2, contractId: 2 },
    { id: 3, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+971 52 456 7890', eid: 'PASS-IN-98765432', nationality: 'India', verified: false, unitId: 5, contractId: 3 },
    { id: 4, name: 'Mohammed Al Zaabi', email: 'm.alzaabi@business.ae', phone: '+971 50 567 8901', eid: '784-1985-5678901-2', nationality: 'UAE', verified: true, unitId: 7, contractId: 4 },
    { id: 5, name: 'Chen Wei', email: 'chen.wei@corp.cn', phone: '+971 56 678 9012', eid: 'PASS-CN-55678901', nationality: 'China', verified: true, unitId: 9, contractId: 5 },
    { id: 6, name: 'Sarah Johnson', email: 'sarah.j@firm.com', phone: '+971 54 789 0123', eid: 'PASS-US-67890123', nationality: 'USA', verified: false, unitId: 6, contractId: 6 },
    { id: 7, name: 'Khalifa Al Hamdan', email: 'khalifa.alhamdan@gmail.com', phone: '+971 50 890 1234', eid: '784-1978-8901234-3', nationality: 'UAE', verified: true, unitId: 10, contractId: 7 },
    { id: 8, name: 'Elena Petrov', email: 'elena.petrov@email.ru', phone: '+971 55 901 2345', eid: 'PASS-RU-78901234', nationality: 'Russia', verified: true, unitId: 12, contractId: 8 }
  ],

  agents: [
    { id: 1, name: 'Hassan Al Bloushi', email: 'hassan@asico.ae', phone: '+971 50 111 2233', license: 'RERA-12345', commission: '2%', activeLeads: 8 },
    { id: 2, name: 'Nadia Karimi', email: 'nadia@asico.ae', phone: '+971 55 222 3344', license: 'RERA-23456', commission: '2%', activeLeads: 5 },
    { id: 3, name: 'Tariq Al Muhairi', email: 'tariq@asico.ae', phone: '+971 52 333 4455', license: 'RERA-34567', commission: '1.5%', activeLeads: 6 }
  ],

  leads: [
    { id: 1, name: 'Abdullah Al Kaabi', email: 'abdullah@gmail.com', phone: '+971 50 444 5566', source: 'Website', interest: '2BR Dubai Marina', status: 'New', date: '2026-04-28', agentId: 1 },
    { id: 2, name: 'Michael Torres', email: 'mtorres@company.com', phone: '+971 55 555 6677', source: 'Referral', interest: '3BR Downtown', status: 'Contacted', date: '2026-04-26', agentId: 2 },
    { id: 3, name: 'Lina Al Amri', email: 'lina@email.com', phone: '+971 56 666 7788', source: 'Bayut', interest: 'Studio Marina', status: 'Qualified', date: '2026-04-24', agentId: 1 },
    { id: 4, name: 'Raj Patel', email: 'raj.patel@corp.in', phone: '+971 52 777 8899', source: 'Property Finder', interest: 'Office DIFC', status: 'Proposal', date: '2026-04-20', agentId: 3 },
    { id: 5, name: 'Sofia Al Rashidi', email: 'sofia@gmail.com', phone: '+971 54 888 9900', source: 'Walk-in', interest: '1BR Business Bay', status: 'New', date: '2026-05-02', agentId: 2 }
  ],

  leasingRequests: [
    { id: 1, crmNo: 'CRM-2026-001', leadId: 3, unitId: 3, reqRent: 55000, reqCommission: 1100, reqSecDeposit: 5500, reqMgmtFee: 2750, reqInstallments: 2, reqFreeDays: 15, status: 'Pending', date: '2026-04-25' },
    { id: 2, crmNo: 'CRM-2026-002', leadId: 4, unitId: 11, reqRent: 148000, reqCommission: 2960, reqSecDeposit: 14800, reqMgmtFee: 7400, reqInstallments: 4, reqFreeDays: 30, status: 'Approved', date: '2026-04-21' }
  ],

  bookings: [
    { id: 1, crmNo: 'BKG-2026-001', leadId: 4, unitId: 11, rent: 148000, commission: 2960, secDeposit: 14800, mgmtFee: 7400, installments: 4, status: 'Confirmed', date: '2026-04-23', startDate: '2026-06-01' }
  ],

  contracts: [
    { id: 1, contractNo: 'ASIC-2024-0000673', tenantId: 1, unitId: 1, startDate: '2024-03-01', endDate: '2025-02-28', value: 75000, installments: 4, status: 'Active', ejari: 'EJR-12345', signed: true },
    { id: 2, contractNo: 'ASIC-2024-0000701', tenantId: 2, unitId: 2, startDate: '2024-05-01', endDate: '2025-04-30', value: 110000, installments: 2, status: 'Under Renewal', ejari: 'EJR-23456', signed: true },
    { id: 3, contractNo: 'ASIC-2024-0000722', tenantId: 3, unitId: 5, startDate: '2024-06-15', endDate: '2025-06-14', value: 80000, installments: 4, status: 'Active', ejari: 'EJR-34567', signed: true },
    { id: 4, contractNo: 'ASIC-2023-0000589', tenantId: 4, unitId: 7, startDate: '2023-09-01', endDate: '2024-08-31', value: 90000, installments: 2, status: 'Expired', ejari: 'EJR-45678', signed: true },
    { id: 5, contractNo: 'ASIC-2025-0000800', tenantId: 5, unitId: 9, startDate: '2025-01-01', endDate: '2025-12-31', value: 85000, installments: 4, status: 'Expiring Soon', ejari: 'EJR-56789', signed: true },
    { id: 6, contractNo: 'ASIC-2024-0000755', tenantId: 6, unitId: 6, startDate: '2024-08-01', endDate: '2025-07-31', value: 115000, installments: 2, status: 'Active', ejari: 'EJR-67890', signed: true },
    { id: 7, contractNo: 'ASIC-2024-0000780', tenantId: 7, unitId: 10, startDate: '2024-10-01', endDate: '2025-09-30', value: 200000, installments: 4, status: 'Under Legal', ejari: 'EJR-78901', signed: true },
    { id: 8, contractNo: 'ASIC-2025-0000830', tenantId: 8, unitId: 12, startDate: '2025-03-01', endDate: '2026-02-28', value: 140000, installments: 2, status: 'Active', ejari: 'EJR-89012', signed: true }
  ],

  renewals: [
    { id: 1, contractId: 2, tenantId: 2, unitId: 2, currentRent: 110000, proposedRent: 118000, approvedRent: 115000, decision: 'Renewing', decisionDate: '2026-03-15', remarks: 'Tenant agreed on AED 115K', status: 'Pending' },
    { id: 2, contractId: 5, tenantId: 5, unitId: 9, currentRent: 85000, proposedRent: 92000, approvedRent: null, decision: 'Pending', decisionDate: null, remarks: '', status: 'Awaiting Decision' }
  ],

  approvals: [
    { id: 1, type: 'Quote Approval', ref: 'CRM-2026-001', description: 'Leasing quote for Studio A-201, Marina Tower A', requestedBy: 'Hassan Al Bloushi', amount: 55000, status: 'Pending', date: '2026-04-25' },
    { id: 2, type: 'Contract Release', ref: 'ASIC-2024-0000701', description: 'Special contract release request for renewal', requestedBy: 'Sara Al Mansoori', amount: 115000, status: 'Approved', date: '2026-04-20' },
    { id: 3, type: 'Renewal Approval', ref: 'REN-2026-001', description: 'Renewal approval for 2BR Marina Tower A-102', requestedBy: 'Nadia Karimi', amount: 115000, status: 'Pending', date: '2026-04-28' }
  ],

  legal: [
    { id: 1, contractId: 7, tenantId: 7, unitId: 10, ref: 'LEG-2024-001', reason: 'Rent arrears — 3 months outstanding', filedDate: '2025-01-15', hearingDate: '2026-05-20', status: 'Under Proceeding', notes: [
      { date: '2025-01-15', note: 'Case filed at Dubai Rental Dispute Center' },
      { date: '2025-03-10', note: 'First hearing completed — awaiting judgment' },
      { date: '2025-06-20', note: 'Judgment in favour of landlord — eviction ordered' }
    ]},
    { id: 2, contractId: 4, tenantId: 4, unitId: 7, ref: 'LEG-2023-002', reason: 'Property damage beyond normal wear', filedDate: '2024-10-05', hearingDate: null, status: 'Resolved', notes: [
      { date: '2024-10-05', note: 'Dispute filed' },
      { date: '2024-12-18', note: 'Settled amicably — tenant paid AED 15,000 damages' }
    ]}
  ],

  maintenance: [
    { id: 1, reqNo: 'MNT-2026-001', unitId: 1, tenantId: 1, title: 'AC not cooling', category: 'HVAC', priority: 'High', status: 'In Progress', scheduledDate: '2026-05-06', reportedDate: '2026-05-01', assignedTo: 'Cool Tech Services', remarks: [], feedback: [] },
    { id: 2, reqNo: 'MNT-2026-002', unitId: 2, tenantId: 2, title: 'Leaking pipe under kitchen sink', category: 'Plumbing', priority: 'Emergency', status: 'Scheduled', scheduledDate: '2026-05-05', reportedDate: '2026-05-04', assignedTo: 'Al Ain Plumbers', remarks: [], feedback: [] },
    { id: 3, reqNo: 'MNT-2025-089', unitId: 5, tenantId: 3, title: 'Light fitting replacement — Living Room', category: 'Electrical', priority: 'Normal', status: 'Completed', scheduledDate: '2026-04-15', reportedDate: '2026-04-10', assignedTo: 'Spark Electrical', remarks: [{ user: 'Khalid Tech', date: '2026-04-15', text: 'Replaced 3 LED fixtures, all working.' }], feedback: [{ by: 'Priya Sharma', desc: 'Fast and professional service.' }] },
    { id: 4, reqNo: 'MNT-2026-003', unitId: 7, tenantId: 4, title: 'Bathroom tiles cracked', category: 'Civil', priority: 'Medium', status: 'Pending', scheduledDate: null, reportedDate: '2026-05-02', assignedTo: null, remarks: [], feedback: [] },
    { id: 5, reqNo: 'MNT-2026-004', unitId: 12, tenantId: 8, title: 'Gym equipment in building not working', category: 'Facilities', priority: 'Normal', status: 'Pending', scheduledDate: null, reportedDate: '2026-05-03', assignedTo: null, remarks: [], feedback: [] }
  ],

  inspections: {
    moveIn: [
      { id: 1, unitId: 1, tenantId: 1, contractId: 1, date: '2024-03-01', inspector: 'Khalid Hassan', status: 'Completed', condition: 'Good', notes: 'Minor scuff on bedroom wall noted. AC filters replaced.', images: 4 },
      { id: 2, unitId: 5, tenantId: 3, contractId: 3, date: '2024-06-15', inspector: 'Fatima Al Zaabi', status: 'Completed', condition: 'Excellent', notes: 'Unit in pristine condition.', images: 6 },
      { id: 3, unitId: 12, tenantId: 8, contractId: 8, date: '2025-03-01', inspector: 'Omar Sheikh', status: 'Completed', condition: 'Good', notes: 'All fixtures working.', images: 5 }
    ],
    moveOut: [
      { id: 1, unitId: 7, tenantId: 4, contractId: 4, date: '2024-09-05', inspector: 'Khalid Hassan', status: 'Completed', condition: 'Fair', notes: 'Bathroom tiles damaged, kitchen appliance scratched.', deduction: 15000, images: 8 },
      { id: 2, unitId: 3, tenantId: null, contractId: null, date: null, inspector: null, status: 'Pending', condition: null, notes: '', deduction: 0, images: 0 }
    ]
  },

  directDebits: [
    { id: 1, contractId: 1, tenantId: 1, unitId: 1, mandateId: 'DD-2024-001', bank: 'Emirates NBD', iban: 'AE07 0331 2345 6789 0123 456', firstDueDate: '2024-04-01', status: 'Active', amount: 18750 },
    { id: 2, contractId: 3, tenantId: 3, unitId: 5, mandateId: 'DD-2024-002', bank: 'Abu Dhabi Islamic Bank', iban: 'AE28 0350 0000 9876 5432 101', firstDueDate: '2024-07-15', status: 'Active', amount: 20000 },
    { id: 3, contractId: 6, tenantId: 6, unitId: 6, mandateId: 'DD-2024-003', bank: 'Mashreq Bank', iban: 'AE21 0330 1234 5678 9012 345', firstDueDate: '2024-09-01', status: 'Failed', amount: 57500 }
  ],

  collection: [
    { id: 1, contractId: 1, tenantId: 1, chequeNo: 'CHQ001234', amount: 18750, dueDate: '2026-03-01', status: 'Deposited', bank: 'Emirates NBD', mode: 'Cheque' },
    { id: 2, contractId: 2, tenantId: 2, chequeNo: 'CHQ005678', amount: 57500, dueDate: '2026-05-01', status: 'Pending', bank: 'HSBC', mode: 'Cheque' },
    { id: 3, contractId: 3, tenantId: 3, chequeNo: 'CHQ009012', amount: 20000, dueDate: '2026-04-15', status: 'Bounced', bank: 'ADIB', mode: 'Cheque' },
    { id: 4, contractId: 5, tenantId: 5, chequeNo: null, amount: 21250, dueDate: '2026-04-01', status: 'Deposited', bank: 'CBD', mode: 'Direct Debit' },
    { id: 5, contractId: 8, tenantId: 8, chequeNo: 'CHQ012345', amount: 70000, dueDate: '2026-06-01', status: 'Pending', bank: 'RAK Bank', mode: 'Cheque' }
  ],

  bankDeposits: [
    { id: 1, collectionId: 1, depositDate: '2026-03-03', depositRef: 'DEP-2026-001', amount: 18750, bank: 'Emirates NBD', status: 'Confirmed' },
    { id: 2, collectionId: 4, depositDate: '2026-04-02', depositRef: 'DEP-2026-002', amount: 21250, bank: 'CBD', status: 'Confirmed' }
  ],

  mailbox: {
    inbox: [
      { id: 1, from: 'dubai.courts@rop.gov.ae', subject: 'Case Hearing Notification — LEG-2024-001', date: '2026-05-02', read: false, body: 'Your case hearing has been scheduled for 20 May 2026 at 10:00 AM at Dubai Rental Dispute Center, Room 305.' },
      { id: 2, from: 'tenant2@company.com', subject: 'Renewal Confirmation — ASIC-2024-0000701', date: '2026-04-30', read: false, body: 'We confirm our agreement to renew the lease at AED 115,000 per annum as discussed.' },
      { id: 3, from: 'ejari@dubailand.gov.ae', subject: 'Ejari Registration Complete', date: '2026-04-28', read: true, body: 'Your Ejari registration EJR-89012 has been successfully completed.' },
      { id: 4, from: 'dewa@dewa.gov.ae', subject: 'DEWA Connection for Unit JBR-401', date: '2026-04-25', read: true, body: 'DEWA connection for unit JBR-401 has been activated.' },
      { id: 5, from: 'maintenance@cooltech.ae', subject: 'Work Order Update — MNT-2026-001', date: '2026-05-01', read: false, body: 'Technician scheduled for 6 May 2026 between 9 AM - 12 PM for AC servicing.' }
    ],
    sent: [
      { id: 1, to: 'tenant1@gmail.com', subject: 'Lease Renewal Notice — ASIC-2024-0000673', date: '2026-04-15', body: 'Dear Aisha, your lease is due for renewal on 28 Feb 2025. Please advise your intentions.' },
      { id: 2, to: 'tenant5@corp.cn', subject: 'Payment Reminder — Installment Due', date: '2026-04-01', body: 'Dear Chen Wei, your rent installment of AED 21,250 is due on 1 April 2026.' },
      { id: 3, to: 'hassan@asico.ae', subject: 'Quote Approval Requested — CRM-2026-001', date: '2026-04-25', body: 'Please review and approve the attached quote for Studio A-201.' }
    ]
  },

  notifications: [
    { id: 1, text: 'Contract ASIC-2024-0000673 expiring in 28 days', unitNo: 'A-101', property: 'Marina Tower A', location: 'Dubai Marina', crm: 'Active', crmNo: 'ASIC-2024-0000673', read: false, time: '2h ago' },
    { id: 2, text: 'Cheque CHQ009012 bounced — tenant Priya Sharma', unitNo: 'B-101', property: 'Marina Tower B', location: 'Dubai Marina', crm: 'Collection', crmNo: 'CHQ009012', read: false, time: '4h ago' },
    { id: 3, text: 'New maintenance request MNT-2026-002 — Emergency', unitNo: 'A-102', property: 'Marina Tower A', location: 'Dubai Marina', crm: 'Maintenance', crmNo: 'MNT-2026-002', read: false, time: '5h ago' },
    { id: 4, text: 'Quote CRM-2026-001 pending your approval', unitNo: 'A-201', property: 'Marina Tower A', location: 'Dubai Marina', crm: 'Approvals', crmNo: 'CRM-2026-001', read: false, time: '1d ago' },
    { id: 5, text: 'Legal hearing LEG-2024-001 scheduled for 20 May', unitNo: 'DF-201', property: 'DIFC Gate Office', location: 'DIFC', crm: 'Legal', crmNo: 'LEG-2024-001', read: false, time: '2d ago' }
  ],

  workboard: {
    todo: [
      { id: 1, title: 'Follow up with Michael Torres', desc: 'Interested in 3BR Downtown', priority: 'High', due: '2026-05-07', tag: 'CRM' },
      { id: 2, title: 'Prepare renewal offer for James Robertson', desc: 'Current rate: 110K, propose 115K', priority: 'Medium', due: '2026-05-10', tag: 'Renewal' }
    ],
    inProgress: [
      { id: 3, title: 'Ejari registration for contract ASIC-2025-0000830', desc: 'Documents submitted, awaiting DLD', priority: 'High', due: '2026-05-05', tag: 'Legal' },
      { id: 4, title: 'AC repair for unit A-101', desc: 'Technician scheduled for 6 May', priority: 'High', due: '2026-05-06', tag: 'Maintenance' }
    ],
    done: [
      { id: 5, title: 'Bounced cheque follow-up — Priya Sharma', desc: 'Tenant issued replacement cheque', priority: 'Normal', due: '2026-05-01', tag: 'Finance' },
      { id: 6, title: 'Move-in inspection — JBR-401', desc: 'Completed and signed off', priority: 'Normal', due: '2026-03-01', tag: 'Inspection' }
    ]
  },

  settings: {
    roles: [
      { id: 1, name: 'Super Admin', modules: 'All Modules', users: 2 },
      { id: 2, name: 'Property Manager', modules: 'Properties, Units, Contracts, Maintenance', users: 5 },
      { id: 3, name: 'Accounts Officer', modules: 'Accounts, Collection, Reports', users: 3 },
      { id: 4, name: 'Agent', modules: 'CRM, Leads, Leasing Request, Booking', users: 3 },
      { id: 5, name: 'Viewer', modules: 'Dashboard, Reports (Read Only)', users: 4 }
    ],
    users: [
      { id: 1, name: 'Sheeraz Shaikh', email: 'admin@asico.ae', role: 'Super Admin', status: 'Active', lastLogin: '2026-05-04' },
      { id: 2, name: 'Sara Al Mansoori', email: 'sara@asico.ae', role: 'Property Manager', status: 'Active', lastLogin: '2026-05-03' },
      { id: 3, name: 'Hassan Al Bloushi', email: 'hassan@asico.ae', role: 'Agent', status: 'Active', lastLogin: '2026-05-04' },
      { id: 4, name: 'Khalid Hassan', email: 'khalid@asico.ae', role: 'Property Manager', status: 'Active', lastLogin: '2026-05-02' },
      { id: 5, name: 'Fatima Al Zaabi', email: 'fatima@asico.ae', role: 'Accounts Officer', status: 'Active', lastLogin: '2026-05-01' }
    ]
  }
};

/* Computed dashboard stats */
DB.getDashStats = function() {
  const contracts = this.contracts;
  const units = this.units;
  const totalOccupied = units.filter(u => u.status === 'Occupied').length;
  const totalUnits = units.length;
  return {
    TConValue: contracts.reduce((s, c) => s + c.value, 0),
    TUnrealiseCol: 1240000,
    TEstCol: 2350000,
    TLead: this.leads.length,
    TLeasingRequest: this.leasingRequests.length,
    TBooking: this.bookings.length,
    TContract: contracts.length,
    TNewContract: contracts.filter(c => c.status === 'Active').length,
    TRenewedContract: 12,
    TExpAndRenewal: contracts.filter(c => c.status === 'Under Renewal').length,
    TNearToExpiry: contracts.filter(c => c.status === 'Expiring Soon').length,
    TExpiredContract: contracts.filter(c => c.status === 'Expired').length,
    TUnderNoticeCont: 1,
    totalUnits,
    totalOccupied,
    totalVacant: units.filter(u => u.status === 'Vacant').length,
    totalBooked: units.filter(u => u.status === 'Booked').length,
    occupancyPct: Math.round((totalOccupied / totalUnits) * 100)
  };
};

/* Helpers */
DB.getTenant = id => DB.tenants.find(t => t.id === id);
DB.getUnit    = id => DB.units.find(u => u.id === id);
DB.getProperty = id => DB.properties.find(p => p.id === id);
DB.getContract = id => DB.contracts.find(c => c.id === id);

DB.fmtAED = n => `<img src="dhiram-sign.svg" style="height: 0.85em; width: auto; vertical-align: middle; margin-right: 4px; margin-bottom: 2px;" alt="AED" />` + Number(n).toLocaleString('en-AE');
DB.fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
DB.initials = name => name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
