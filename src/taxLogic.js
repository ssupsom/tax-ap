export const calculateTax = (incomeSources, deductions) => {
    // 1. รวมรายได้
    let totalIncome = 0;
    Object.values(incomeSources).forEach(val => totalIncome += (val || 0));
  
    // 2. หักค่าใช้จ่าย (ตามกฎหมายแบบคร่าวๆ)
    let expenses = 0;
    
    // เงินเดือน 50% ไม่เกิน 100,000
    const salaryExp = Math.min((incomeSources.salary || 0) * 0.5, 100000);
    expenses += salaryExp;
  
    // ฟรีแลนซ์/วิชาชีพ (สมมติหักเหมา 60% เพื่อความง่ายในการ demo)
    if (incomeSources.freelance) expenses += incomeSources.freelance * 0.6;
    if (incomeSources.profMed) expenses += incomeSources.profMed * 0.6;
    if (incomeSources.profGen) expenses += incomeSources.profGen * 0.3; // วิชาชีพอิสระอื่นๆ หัก 30%
    if (incomeSources.contractor) expenses += incomeSources.contractor * 0.6; // รับเหมา 60% (จริง 70% ถ้าเหมาค่าแรง+ของ)
    if (incomeSources.onlineSales || incomeSources.business) expenses += (incomeSources.onlineSales || 0 + incomeSources.business || 0) * 0.6;
  
    const incomeAfterExpenses = totalIncome - expenses;
  
    // 3. หักลดหย่อน
    let totalDeductions = 0;
    const quotas = {}; // เก็บข้อมูลโควตาเพื่อส่งกลับไปแสดงผล
  
    // 3.1 ส่วนตัว & ครอบครัว
    totalDeductions += 60000; // ส่วนตัว
    if (deductions.spouse) totalDeductions += 60000;
    if (deductions.childBio > 0) totalDeductions += deductions.childBio * 30000;
    if (deductions.childAdopted > 0) totalDeductions += deductions.childAdopted * 30000; // จริงๆ มีเงื่อนไขลูกคนแรก/หลังปี 61 แต่คิดรวมง่ายๆ
    if (deductions.father) totalDeductions += 30000;
    if (deductions.mother) totalDeductions += 30000;
    if (deductions.spouseFather) totalDeductions += 30000;
    if (deductions.spouseMother) totalDeductions += 30000;
    if (deductions.disabledSelf) totalDeductions += 190000; // ยกเว้นเงินได้
    if (deductions.disabledCare > 0) totalDeductions += deductions.disabledCare * 60000;
    totalDeductions += Math.min(deductions.prenatal || 0, 60000);
  
    // 3.2 ประกันสังคม (สูงสุด 9,000)
    const socialSecurity = Math.min(deductions.socialSecurity || 0, 9000);
    totalDeductions += socialSecurity;
    quotas.socialSecurity = { used: socialSecurity, limit: 9000, remaining: 9000 - socialSecurity, over: Math.max((deductions.socialSecurity || 0) - 9000, 0) };
  
    // 3.3 ประกันชีวิต & สุขภาพ
    // ประกันสุขภาพตัวเอง (max 25,000)
    const healthSelf = Math.min(deductions.healthInsurance || 0, 25000);
    quotas.healthInsurance = { used: healthSelf, limit: 25000, remaining: 25000 - healthSelf, over: Math.max((deductions.healthInsurance || 0) - 25000, 0) };
  
    // ประกันชีวิตทั่วไป + สุขภาพตัวเอง (รวมกันไม่เกิน 100,000)
    const lifeGeneralRaw = deductions.lifeInsurance || 0;
    const lifeGeneral = Math.min(lifeGeneralRaw + healthSelf, 100000) - healthSelf; // ส่วนที่คิดภาษีได้จริงของชีวิต
    const lifeGeneralUsedTotal = lifeGeneral + healthSelf;
    
    totalDeductions += healthSelf + lifeGeneral;
    
    quotas.lifeInsurance = { 
        used: lifeGeneralRaw, 
        limit: 100000, 
        remaining: Math.max(100000 - lifeGeneralRaw - healthSelf, 0), // life shares quota with health
        over: Math.max((lifeGeneralRaw + healthSelf) - 100000, 0)
    };
  
    // ประกันสุขภาพพ่อแม่ (max 15,000)
    const healthPar = (deductions.healthFather || 0) + (deductions.healthMother || 0) + (deductions.healthSpouseFather || 0) + (deductions.healthSpouseMother || 0);
    const healthParDed = Math.min(healthPar, 15000);
    totalDeductions += healthParDed;
    quotas.healthParents = { used: healthPar, limit: 15000, remaining: 15000 - healthParDed, over: Math.max(healthPar - 15000, 0) };
    
    // ประกันคู่สมรส
    const lifeSpouse = Math.min(deductions.lifeInsuranceSpouse || 0, 10000);
    totalDeductions += lifeSpouse;
  
    // 3.4 กองทุนการออม (กลุ่มเกษียณ - รวมกันไม่เกิน 500,000)
    // RMF (30% ของรายได้ ไม่เกิน 500k)
    const limitRMF = Math.min(totalIncome * 0.3, 500000);
    const rmf = Math.min(deductions.rmf || 0, limitRMF);
    quotas.rmf = { used: deductions.rmf || 0, limit: limitRMF, remaining: limitRMF - rmf, over: Math.max((deductions.rmf || 0) - limitRMF, 0) };
  
    // SSF (30% ของรายได้ ไม่เกิน 200k)
    const limitSSF = Math.min(totalIncome * 0.3, 200000);
    const ssf = Math.min(deductions.ssf || 0, limitSSF);
    quotas.ssf = { used: deductions.ssf || 0, limit: limitSSF, remaining: limitSSF - ssf, over: Math.max((deductions.ssf || 0) - limitSSF, 0) };
  
    // PVD/สงเคราะห์ครู (15% รายได้ ไม่เกิน 500k)
    const pvd = Math.min(deductions.pvd || 0, totalIncome * 0.15); 
    const teacherFund = Math.min(deductions.teacherFund || 0, totalIncome * 0.15);
    
    // กบข (30% รายได้ ไม่เกิน 500k)
    const gpf = Math.min(deductions.gpf || 0, totalIncome * 0.30);
    
    // กอช (13,200)
    const nsf = Math.min(deductions.nsf || 0, 30000); // ปีใหม่ๆ อาจปรับเพิ่ม เช็คกฎหมายอีกที (ยึด 30k ไว้ก่อนตามปี 66)
  
    // ประกันบำนาญ (15% รายได้ ไม่เกิน 200k และถ้ารวมก้อนอื่นต้องไม่เกิน 500k)
    const limitPension = Math.min(totalIncome * 0.15, 200000); 
    const pension = Math.min(deductions.pension || 0, limitPension);
  
    // เช็คเพดาน 500,000
    const retirementSum = rmf + ssf + pvd + teacherFund + gpf + nsf + pension;
    const retirementDeduction = Math.min(retirementSum, 500000);
    totalDeductions += retirementDeduction;
  
    quotas.retirementGroup = { 
        used: retirementSum, 
        limit: 500000, 
        remaining: 500000 - retirementDeduction, 
        over: Math.max(retirementSum - 500000, 0) 
    };
  
    // 3.5 Thai ESG (30% ไม่เกิน 300,000) **New Logic 2024-2025**
    const limitThaiESG = Math.min(totalIncome * 0.3, 300000);
    const thaiESG = Math.min((deductions.thaiESG || 0) + (deductions.thaiESGX || 0) + (deductions.thaiESGLTF || 0), limitThaiESG);
    totalDeductions += thaiESG;
    quotas.thaiESG = { used: (deductions.thaiESG || 0), limit: limitThaiESG, remaining: limitThaiESG - thaiESG, over: Math.max((deductions.thaiESG || 0) - limitThaiESG, 0) };
  
    // 3.6 อสังหา & อื่นๆ
    const homeLoan = Math.min(deductions.homeLoan || 0, 100000);
    totalDeductions += homeLoan;
    quotas.homeLoan = { used: deductions.homeLoan || 0, limit: 100000, remaining: 100000 - homeLoan, over: Math.max((deductions.homeLoan || 0) - 100000, 0) };
  
    const easyReceipt = Math.min(deductions.easyReceipt || 0, 50000);
    totalDeductions += easyReceipt;
    quotas.easyReceipt = { used: deductions.easyReceipt || 0, limit: 50000, remaining: 50000 - easyReceipt, over: Math.max((deductions.easyReceipt || 0) - 50000, 0) };
  
    // ... อื่นๆ (Art, Travel, HomeConstruction) เพิ่มตามต้องการ
  
    // 4. เงินบริจาค (คิดเป็น Step สุดท้ายหลังจากหักทุกอย่างแล้ว)
    let incomeBeforeDonation = incomeAfterExpenses - totalDeductions;
    if (incomeBeforeDonation < 0) incomeBeforeDonation = 0;
  
    // บริจาคทั่วไป (ไม่เกิน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อน)
    const limitDonation = incomeBeforeDonation * 0.1;
    
    // บริจาคพิเศษ 2 เท่า (แต่ไม่เกิน 10% เมื่อรวมกับทั่วไป) - Logic ซับซ้อนนิดนึง ขอคิดแบบบริจาคทั่วไปรวมๆ ง่ายๆ ก่อน
    const donation = Math.min(deductions.donation || 0, limitDonation);
    totalDeductions += donation;
    quotas.donation = { used: deductions.donation || 0, limit: limitDonation, remaining: limitDonation - donation, over: Math.max((deductions.donation || 0) - limitDonation, 0) };
  
  
    // 5. คำนวณภาษี
    let netIncome = totalIncome - expenses - totalDeductions;
    if (netIncome < 0) netIncome = 0;
  
    let taxPayable = 0;
    const brackets = [
      { min: 0, max: 150000, rate: 0 },
      { min: 150000, max: 300000, rate: 0.05 },
      { min: 300000, max: 500000, rate: 0.10 },
      { min: 500000, max: 750000, rate: 0.15 },
      { min: 750000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: 2000000, rate: 0.25 },
      { min: 2000000, max: 5000000, rate: 0.30 },
      { min: 5000000, max: Infinity, rate: 0.35 },
    ];
  
    const taxBreakdown = [];
  
    for (let b of brackets) {
      if (netIncome > b.min) {
        const taxableAmount = Math.min(netIncome, b.max) - b.min;
        const taxInBracket = taxableAmount * b.rate;
        taxPayable += taxInBracket;
        if (taxInBracket > 0) {
            taxBreakdown.push({ rate: b.rate * 100, amount: taxableAmount, tax: taxInBracket });
        }
      }
    }
  
    return {
      income: totalIncome,
      expenses: expenses,
      totalDeductions: totalDeductions,
      netIncome: netIncome,
      taxPayable: taxPayable,
      taxBreakdown: taxBreakdown,
      quotas: quotas
    };
  };