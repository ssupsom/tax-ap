export const TAX_CONFIG = {
  taxYear: 2025,
  
  expenses: {
    group1_2: { percent: 0.5, max: 100000 },
    group3: { percent: 0.5, max: 100000 },
    group5: { percent: 0.3 },
    group6_med: { percent: 0.6 },
    group6_gen: { percent: 0.3 },
    group7: { percent: 0.6 },
    group8: { percent: 0.6 } 
  },

  deductionLimits: {
    personal: 60000, 
    spouse: 60000, 
    parent: 30000,
    child: 30000,
    prenatal: 60000,
    disabledCare: 60000,
    disabledSelf: 190000,
    politicalDonation: 10000 // บริจาคพรรคการเมือง
  },
  
  insuranceLimits: {
    socialSecurity: 9000, 
    lifeInsurance: 100000, 
    lifeInsuranceSpouse: 10000,
    healthInsurance: 25000, 
    healthParents: 15000,
    lifeHealthMaxCombined: 100000 
  },

  retirementLimits: {
    grandTotalMax: 500000,
    ssfPercent: 0.3, ssfMax: 200000,
    rmfPercent: 0.3, rmfMax: 500000,
    pensionPercent: 0.15, pensionMax: 200000,
    pvdPercent: 0.15, pvdMax: 500000,
    gpfPercent: 0.30, gpfMax: 500000,
    teacherFundPercent: 0.15, teacherFundMax: 500000,
    nsfMax: 30000,
    thaiEsgPercent: 0.3, thaiEsgMax: 300000 
  },

  stimulusLimits: {
    easyReceiptMax: 50000,      // Easy E-Receipt 2.0
    homeConstructionMax: 100000, // สร้างบ้าน (ล้านละหมื่น)
    artMax: 100000,             // ซื้องานศิลปะ
    travelMax: 30000            // เที่ยวเมืองรอง (Max deduction)
  },

  propertyLimits: { homeLoanInterest: 100000 },
  
  taxBrackets: [
    { min: 0, max: 150000, rate: 0 },
    { min: 150001, max: 300000, rate: 0.05 },
    { min: 300001, max: 500000, rate: 0.10 },
    { min: 500001, max: 750000, rate: 0.15 },
    { min: 750001, max: 1000000, rate: 0.20 },
    { min: 1000001, max: 2000000, rate: 0.25 },
    { min: 2000001, max: 5000000, rate: 0.30 },
    { min: 5000001, max: Infinity, rate: 0.35 }
  ]
};