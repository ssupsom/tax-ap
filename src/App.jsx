import React, { useState, useEffect, useRef } from 'react';
import { calculateTax } from './taxLogic';
import { 
  Banknote, Users, ShieldCheck, TrendingUp, Home, 
  Calculator, Briefcase, Store, Copyright, HardHat, Stethoscope, Building,
  Plus, Trash2, Coins, ListChecks, Baby, HeartHandshake, Accessibility, Activity,
  Umbrella, HeartPulse, Clock, Heart,
  Sprout, Landmark, GraduationCap, PiggyBank, Leaf,
  Receipt, Palmtree, Palette, Hammer, Flag, Heart as HeartIcon,
  LayoutDashboard, Target, BarChart3, ChevronDown, ChevronUp, X, Check, ArrowRight
} from 'lucide-react';

// --- Config: รายได้ ---
const INCOME_OPTIONS = [
  { id: 'salary', label: 'เงินเดือน/โบนัส (40(1))', icon: Briefcase },
  { id: 'freelance', label: 'ฟรีแลนซ์/รับจ้าง (40(2))', icon: Users },
  { id: 'copyright', label: 'ค่าลิขสิทธิ์ (40(3))', icon: Copyright },
  { id: 'interest', label: 'ดอกเบี้ย/ปันผล (40(4))', icon: Coins },
  { id: 'rental', label: 'ค่าเช่าบ้าน/อาคาร (40(5))', icon: Building },
  { id: 'profMed', label: 'วิชาชีพแพทย์ (40(6))', icon: Stethoscope },
  { id: 'profGen', label: 'วิชาชีพอิสระอื่นๆ (40(6))', icon: Briefcase },
  { id: 'contractor', label: 'รับเหมาก่อสร้าง (40(7))', icon: HardHat },
  { id: 'onlineSales', label: 'ขายของออนไลน์ (40(8))', icon: Store },
  { id: 'business', label: 'ธุรกิจร้านอาหาร/อื่นๆ (40(8))', icon: Store },
];

// --- Config: ครอบครัว ---
const FAMILY_OPTIONS = [
  { id: 'disabledSelf', label: 'ผู้พิการ (ตัวเอง)', icon: Accessibility, type: 'boolean', note: 'ยกเว้นเงินได้ 190,000 บ.' },
  { id: 'spouse', label: 'คู่สมรส (ไม่มีเงินได้)', icon: HeartHandshake, type: 'boolean', note: 'ลดหย่อน 60,000 บ.' },
  { id: 'father', label: 'บิดา (อายุ 60+)', icon: Users, type: 'boolean', note: 'ลดหย่อน 30,000 บ.' },
  { id: 'mother', label: 'มารดา (อายุ 60+)', icon: Users, type: 'boolean', note: 'ลดหย่อน 30,000 บ.' },
  { id: 'spouseFather', label: 'บิดาคู่สมรส (อายุ 60+)', icon: Users, type: 'boolean', note: 'ลดหย่อน 30,000 บ.' },
  { id: 'spouseMother', label: 'มารดาคู่สมรส (อายุ 60+)', icon: Users, type: 'boolean', note: 'ลดหย่อน 30,000 บ.' },
  { id: 'childBio', label: 'บุตรชอบด้วยกฎหมาย', icon: Baby, type: 'number', suffix: 'คน', note: 'คนละ 30,000 บ.' },
  { id: 'childAdopted', label: 'บุตรบุญธรรม', icon: Baby, type: 'number', suffix: 'คน', note: 'คนละ 30,000 บ.' },
  { id: 'disabledCare', label: 'ค่าอุปการะผู้พิการ', icon: Accessibility, type: 'number', suffix: 'คน', note: 'คนละ 60,000 บ.' },
  { id: 'prenatal', label: 'ฝากครรภ์ & ทำคลอด', icon: Activity, type: 'amount', suffix: 'บาท', note: 'ตามจริงไม่เกิน 60,000 บ.' },
];

// --- Config: ประกัน ---
const INSURANCE_OPTIONS = [
  { id: 'socialSecurity', label: 'ประกันสังคม', icon: Umbrella },
  { id: 'lifeInsurance', label: 'ประกันชีวิตทั่วไป', icon: Heart },
  { id: 'lifeInsuranceSpouse', label: 'ประกันชีวิต - คู่สมรส', icon: HeartHandshake },
  { id: 'pension', label: 'ประกันชีวิตแบบบำนาญ', icon: Clock },
  { id: 'healthInsurance', label: 'ประกันสุขภาพ - ตนเอง', icon: HeartPulse },
  { id: 'healthFather', label: 'ประกันสุขภาพ - พ่อ', icon: HeartPulse },
  { id: 'healthMother', label: 'ประกันสุขภาพ - แม่', icon: HeartPulse },
  { id: 'healthSpouseFather', label: 'ประกันสุขภาพ - พ่อคู่สมรส', icon: HeartPulse },
  { id: 'healthSpouseMother', label: 'ประกันสุขภาพ - แม่คู่สมรส', icon: HeartPulse },
];

// --- Config: การลงทุน ---
const INVESTMENT_OPTIONS = [
  { id: 'rmf', label: 'ค่าซื้อ RMF', icon: Sprout },
  { id: 'thaiESG', label: 'ค่าซื้อ Thai ESG', icon: Leaf },
  { id: 'thaiESGX', label: 'ค่าซื้อ Thai ESGX (New)', icon: Leaf },
  { id: 'thaiESGLTF', label: 'Thai ESGX (LTF)', icon: Leaf },
  { id: 'ssf', label: 'กองทุน SSF', icon: TrendingUp },
  { id: 'pvd', label: 'กองทุนสำรองเลี้ยงชีพ (PVD)', icon: Landmark },
  { id: 'gpf', label: 'กองทุน กบข. (GPF)', icon: Landmark },
  { id: 'teacherFund', label: 'กองทุนสงเคราะห์ครูเอกชน', icon: GraduationCap },
  { id: 'nsf', label: 'กองทุนการออมแห่งชาติ (กอช.)', icon: PiggyBank },
];

// --- Config: อสังหา & บริจาค ---
const PROPERTY_DONATION_OPTIONS = [
  { id: 'homeLoan', label: 'ดอกเบี้ยกู้บ้าน', icon: Home },
  { id: 'easyReceipt', label: 'Easy E-Receipt 2.0 (ปี 68)', icon: Receipt },
  { id: 'travelSecondary', label: 'เที่ยวเมืองรอง', icon: Palmtree },
  { id: 'art', label: 'ซื้องานศิลปะ', icon: Palette },
  { id: 'homeConstruction', label: 'ค่าสร้างบ้านใหม่', icon: Hammer },
  { id: 'politicalDonation', label: 'บริจาคพรรคการเมือง', icon: Flag },
  { id: 'donationSpecial', label: 'บริจาคพิเศษ (2เท่า)', icon: HeartIcon },
  { id: 'donation', label: 'บริจาคทั่วไป', icon: HeartIcon },
];

const DEDUCTION_LABELS = {
    disabledSelf: "ผู้พิการ (ตัวเอง)", spouse: "คู่สมรส", father: "บิดา", mother: "มารดา",
    spouseFather: "บิดาคู่สมรส", spouseMother: "มารดาคู่สมรส", childBio: "บุตร", childAdopted: "บุตรบุญธรรม", 
    disabledCare: "อุปการะผู้พิการ", prenatal: "ฝากครรภ์", socialSecurity: "ประกันสังคม", 
    lifeInsurance: "ประกันชีวิต", lifeInsuranceSpouse: "ประกันชีวิตคู่สมรส", healthInsurance: "ประกันสุขภาพ", 
    healthParents: "ประกันสุขภาพพ่อแม่", pension: "ประกันบำนาญ", ssf: "กองทุน SSF", 
    rmf: "ค่าซื้อ RMF", pvd: "PVD", gpf: "กบข.", teacherFund: "สงเคราะห์ครู", nsf: "กอช.",
    thaiESG: "Thai ESG", thaiESGX: "Thai ESGX", thaiESGLTF: "Thai ESGX (LTF)",
    homeLoan: "ดอกเบี้ยบ้าน", easyReceipt: "Easy E-Receipt", travel: "เที่ยวเมืองรอง",
    art: "ซื้องานศิลปะ", homeConstruction: "สร้างบ้านใหม่", politicalDonation: "บริจาคพรรคการเมือง",
    donationSpecial: "บริจาคพิเศษ (2เท่า)", donation: "บริจาคทั่วไป"
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
    <div className="p-2.5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl text-white shadow-lg shadow-teal-500/20">
      <Icon size={22} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const DynamicDeductionInput = ({ config, value, onChange, onRemove, quota }) => {
    const showProgress = value > 0 && quota && quota.limit > 0;
    const percent = showProgress ? Math.min((value / quota.limit) * 100, 100).toFixed(0) : 0;

    return (
      <div className="mb-5 animate-fade-in-up group">
        <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
               <config.icon size={16} className="text-teal-400" />
               {config.label}
            </label>
            <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1"><Trash2 size={12} /> ลบ</button>
        </div>
        {config.type === 'boolean' ? (
           <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-xl backdrop-blur-sm">
               <span className="text-sm text-slate-400">{config.note}</span>
               <div className="flex items-center gap-2 text-teal-400 font-bold text-xs bg-teal-400/10 px-3 py-1.5 rounded-lg border border-teal-400/20">
                  <Check size={12} /> ใช้สิทธิ์แล้ว
               </div>
           </div>
        ) : (
           <div>
               {value > 0 && quota && (
                  <div className="flex justify-end mb-1.5 text-xs font-medium">
                      {quota.over > 0 ? ( <span className="text-red-400">เกินสิทธิ์ {quota.over.toLocaleString()}</span> ) : ( <span className="text-emerald-400">เหลือลดหย่อนอีก {quota.remaining.toLocaleString()}</span> )}
                  </div>
               )}
               <div className="relative group">
                  <input 
                    type="number" 
                    inputMode="numeric" 
                    value={value || ''} 
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)} 
                    className={`block w-full pl-4 pr-12 py-3.5 bg-slate-900/60 border rounded-xl outline-none font-medium text-white transition-all placeholder:text-slate-600
                        ${value > 0 && quota?.over > 0 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 hover:border-white/20'}`} 
                    placeholder="0" 
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm font-medium">{config.suffix || "THB"}</span>
                  </div>
               </div>
               {showProgress && (
                  <div className="mt-2.5">
                    {/* เปอร์เซ็นต์ด้านซ้าย */}
                    <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-tighter">
                        <span className={quota.over > 0 ? 'text-red-400' : 'text-teal-400'}>{percent}%</span>
                        <span className="text-slate-600">used</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-500 ${quota.over > 0 ? 'bg-red-500 text-red-500' : 'bg-teal-400 text-teal-400'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
               )}
               {!showProgress && config.note && <p className="text-xs text-slate-500 mt-1.5">{config.note}</p>}
           </div>
        )}
      </div>
    );
};

const RemovableInput = ({ label, value, onChange, onRemove, icon: Icon }) => (
    <div className="mb-5 animate-fade-in-up">
      <div className="flex justify-between items-center mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
             <Icon size={16} className="text-yellow-400" />
             {label}
          </label>
          <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1"><Trash2 size={12} /> ลบ</button>
      </div>
      <div className="relative">
        <input 
            type="number" 
            inputMode="numeric" 
            value={value || ''} 
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)} 
            className="block w-full pl-4 pr-12 py-3.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none font-medium text-white placeholder:text-slate-600 hover:border-white/20 transition-all" 
            placeholder="0" 
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><span className="text-slate-500 text-sm">THB</span></div>
      </div>
    </div>
);

const QuotaProgressBarDashboard = ({ label, used = 0, limit = 0, color, maxCap }) => {
    const visualLimit = limit > 0 ? limit : (maxCap || 100000); 
    const percent = Math.min((used / visualLimit) * 100, 100).toFixed(0);
    const remaining = Math.max((limit || maxCap || 0) - used, 0);

    return (
        <div className="mb-4 last:mb-0">
             <div className="flex justify-between text-xs mb-1.5">
                 <span className="text-slate-300 font-medium">{label}</span>
                 <div className="font-mono text-slate-500">
                    <span>{used.toLocaleString()} / {(limit || maxCap || 0).toLocaleString()}</span>
                 </div>
             </div>
             <div className="w-full bg-slate-900 rounded-full h-2.5 relative overflow-hidden border border-white/5">
                 <div className={`h-full rounded-full ${color} shadow-[0_0_12px_currentColor] transition-all duration-500`} style={{width: `${percent}%`}}></div>
             </div>
             <div className="text-right mt-1">
                  <span className="text-[10px] text-teal-400 font-medium">เหลือลดหย่อนอีก {remaining.toLocaleString()}</span>
             </div>
        </div>
    );
};

const TaxBracketVisual = ({ netIncome }) => {
    const brackets = [
        { limit: 150000, rate: 0, nextRate: 5 },
        { limit: 300000, rate: 5, nextRate: 10 },
        { limit: 500000, rate: 10, nextRate: 15 },
        { limit: 750000, rate: 15, nextRate: 20 },
        { limit: 1000000, rate: 20, nextRate: 25 },
        { limit: 2000000, rate: 25, nextRate: 30 },
        { limit: 5000000, rate: 30, nextRate: 35 },
        { limit: Infinity, rate: 35, nextRate: null }
    ];

    let currentData = brackets[0];
    let prevLimit = 0;
    for (let i = 0; i < brackets.length; i++) {
        if (netIncome <= brackets[i].limit) { currentData = brackets[i]; break; }
        prevLimit = brackets[i].limit;
    }
    if (netIncome > 5000000) { currentData = brackets[brackets.length-1]; prevLimit = 5000000; }

    const { rate, nextRate, limit } = currentData;
    const amountToNext = limit - netIncome;
    const range = limit === Infinity ? 1 : limit - prevLimit;
    const progress = Math.min(Math.max((netIncome - prevLimit) / range * 100, 0), 100).toFixed(0);
    
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-white/10 mb-6 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 bg-blue-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
             <div className="flex justify-between items-end mb-3 relative z-10">
                 <div><p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">ฐานภาษีปัจจุบัน</p><p className="text-3xl font-bold text-white drop-shadow-md">{rate}%</p></div>
                 <div className="text-right"><p className="text-xs text-slate-400">เงินได้สุทธิ</p><p className="text-lg font-bold text-white">{netIncome.toLocaleString()}</p></div>
             </div>
             <div className="w-full bg-slate-950 rounded-full h-3 mb-3 relative overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{ width: `${progress}%` }}></div>
             </div>
             {nextRate !== null ? (
                 <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500">ฐาน {rate}%</span>
                     <span className="text-yellow-400 font-medium animate-pulse flex items-center gap-1">อีก {amountToNext.toLocaleString()} บาท จะขึ้นฐาน {nextRate}% <ArrowRight size={12}/></span>
                 </div>
             ) : (<div className="text-right text-xs text-emerald-400 font-medium">สูงสุดแล้ว (35%)</div>)}
        </div>
    );
};

const TaxBreakdownList = ({ incomeSources, deductions }) => {
    const activeIncomes = INCOME_OPTIONS.filter(opt => (incomeSources[opt.id] || 0) > 0).map(opt => ({ label: opt.label, value: incomeSources[opt.id] }));
    const activeDeductions = Object.keys(deductions).filter(key => {
        if (typeof deductions[key] === 'boolean') return deductions[key] === true;
        return (deductions[key] || 0) > 0;
    }).map(key => ({ label: DEDUCTION_LABELS[key] || key, value: deductions[key], isBoolean: typeof deductions[key] === 'boolean' }));

    if (activeIncomes.length === 0 && activeDeductions.length === 0) return null;

    return (
        <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 mt-6 shadow-xl">
             <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide flex items-center gap-2"><ListChecks size={16} className="text-teal-400"/> รายละเอียดรายการ</h4>
             {activeIncomes.length > 0 && (
                 <div className="mb-4">
                     <p className="text-xs font-semibold text-slate-500 mb-2">รายได้ที่นำมาคิด</p>
                     <div className="space-y-1">{activeIncomes.map((item, idx) => (<div key={idx} className="flex justify-between text-xs text-slate-300"><span>{item.label}</span><span className="font-mono text-white">{item.value.toLocaleString()}</span></div>))}</div>
                 </div>
             )}
             {activeIncomes.length > 0 && activeDeductions.length > 0 && <hr className="my-3 border-white/10"/>}
             {activeDeductions.length > 0 && (
                 <div>
                     <p className="text-xs font-semibold text-slate-500 mb-2">รายการลดหย่อนที่ใช้</p>
                     <div className="space-y-1">
                         <div className="flex justify-between text-xs text-slate-300"><span>ค่าลดหย่อนส่วนตัว</span><span className="font-mono text-white">60,000</span></div>
                         {activeDeductions.map((item, idx) => (<div key={idx} className="flex justify-between text-xs text-slate-300"><span>{item.label}</span><span className="font-mono text-white">{item.isBoolean ? 'ตามสิทธิ์' : item.value.toLocaleString()}</span></div>))}
                     </div>
                 </div>
             )}
        </div>
    );
};

export default function App() {
  const [incomeSources, setIncomeSources] = useState({});
  const [activeIncomeTypes, setActiveIncomeTypes] = useState(['salary']);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef(null);
  const [deductions, setDeductions] = useState({});
  const [activeFamilyTypes, setActiveFamilyTypes] = useState([]);
  const [showAddFamilyMenu, setShowAddFamilyMenu] = useState(false);
  const addFamilyMenuRef = useRef(null);
  const [activeInsuranceTypes, setActiveInsuranceTypes] = useState(['lifeInsurance', 'healthInsurance']);
  const [showAddInsuranceMenu, setShowAddInsuranceMenu] = useState(false);
  const addInsuranceMenuRef = useRef(null);
  const [activeInvestmentTypes, setActiveInvestmentTypes] = useState(['rmf', 'ssf']);
  const [showAddInvestmentMenu, setShowAddInvestmentMenu] = useState(false);
  const addInvestmentMenuRef = useRef(null);
  const [activePropDonTypes, setActivePropDonTypes] = useState(['homeLoan']);
  const [showAddPropDonMenu, setShowAddPropDonMenu] = useState(false);
  const addPropDonMenuRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  useEffect(() => { setResult(calculateTax(incomeSources, deductions)); }, [incomeSources, deductions]);

  useEffect(() => {
    function handleClickOutside(event) { 
        if (addMenuRef.current && !addMenuRef.current.contains(event.target)) setShowAddMenu(false); 
        if (addFamilyMenuRef.current && !addFamilyMenuRef.current.contains(event.target)) setShowAddFamilyMenu(false);
        if (addInsuranceMenuRef.current && !addInsuranceMenuRef.current.contains(event.target)) setShowAddInsuranceMenu(false);
        if (addInvestmentMenuRef.current && !addInvestmentMenuRef.current.contains(event.target)) setShowAddInvestmentMenu(false);
        if (addPropDonMenuRef.current && !addPropDonMenuRef.current.contains(event.target)) setShowAddPropDonMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateIncome = (f, v) => setIncomeSources(p => ({ ...p, [f]: v }));
  const addIncomeType = (id) => { if (!activeIncomeTypes.includes(id)) setActiveIncomeTypes([...activeIncomeTypes, id]); setShowAddMenu(false); };
  const removeIncomeType = (id) => { setActiveIncomeTypes(activeIncomeTypes.filter(t => t !== id)); updateIncome(id, 0); };
  const updateDeduction = (f, v) => setDeductions(p => ({ ...p, [f]: v }));
  const addFamilyType = (id, type) => { if (!activeFamilyTypes.includes(id)) setActiveFamilyTypes([...activeFamilyTypes, id]); if (type === 'boolean') updateDeduction(id, true); setShowAddFamilyMenu(false); };
  const removeFamilyType = (id) => { setActiveFamilyTypes(activeFamilyTypes.filter(t => t !== id)); updateDeduction(id, 0); };
  const addInsuranceType = (id) => { if (!activeInsuranceTypes.includes(id)) setActiveInsuranceTypes([...activeInsuranceTypes, id]); setShowAddInsuranceMenu(false); };
  const removeInsuranceType = (id) => { setActiveInsuranceTypes(activeInsuranceTypes.filter(t => t !== id)); updateDeduction(id, 0); };
  const addInvestmentType = (id) => { if (!activeInvestmentTypes.includes(id)) setActiveInvestmentTypes([...activeInvestmentTypes, id]); setShowAddInvestmentMenu(false); };
  const removeInvestmentType = (id) => { setActiveInvestmentTypes(activeInvestmentTypes.filter(t => t !== id)); updateDeduction(id, 0); };
  const addPropDonType = (id) => { if (!activePropDonTypes.includes(id)) setActivePropDonTypes([...activePropDonTypes, id]); setShowAddPropDonMenu(false); };
  const removePropDonType = (id) => { setActivePropDonTypes(activePropDonTypes.filter(t => t !== id)); updateDeduction(id, 0); };

  const availableIncomeOptions = INCOME_OPTIONS.filter(opt => !activeIncomeTypes.includes(opt.id));
  const availableFamilyOptions = FAMILY_OPTIONS.filter(opt => !activeFamilyTypes.includes(opt.id));
  const availableInsuranceOptions = INSURANCE_OPTIONS.filter(opt => !activeInsuranceTypes.includes(opt.id));
  const availableInvestmentOptions = INVESTMENT_OPTIONS.filter(opt => !activeInvestmentTypes.includes(opt.id));
  const availablePropDonOptions = PROPERTY_DONATION_OPTIONS.filter(opt => !activePropDonTypes.includes(opt.id));

  return (
    <div className="min-h-screen bg-[#020B2D] font-sans text-slate-200 selection:bg-teal-500 selection:text-white relative"> 
       <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap'); body { font-family: 'Kanit', sans-serif; }`}</style>

       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <Plus size={80} className="absolute top-20 left-10 opacity-10 text-blue-500 animate-bounce" />
          <X size={60} className="absolute top-1/3 right-20 opacity-10 text-pink-500 rotate-45 animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 opacity-10 rotate-12"></div>
       </div>

      <nav className="backdrop-blur-md bg-[#020B2D]/80 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#020B2D] border border-white/10 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/10">
                <Calculator className="text-yellow-400" size={20} />
            </div>
            <div className="flex flex-col"><span className="font-bold text-xl text-white tracking-tight leading-none">TAXPro</span><span className="text-[10px] text-teal-400 font-medium tracking-widest uppercase">Planning Tool</span></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
             {/* รายได้ Section (z-20 เพื่อให้เมนูเด้งทับ Layer อื่น) */}
             <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative z-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <SectionHeader icon={Banknote} title="รายได้ (Income)" subtitle="แหล่งที่มาของเงินได้" />
                <div className="space-y-2">
                    {activeIncomeTypes.map(typeId => { const option = INCOME_OPTIONS.find(o => o.id === typeId); return <RemovableInput key={typeId} label={option.label} icon={option.icon} value={incomeSources[typeId]} onChange={(v) => updateIncome(typeId, v)} onRemove={() => removeIncomeType(typeId)} />; })}
                </div>
                <div className="relative mt-6" ref={addMenuRef}>
                    <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-full py-4 border border-dashed border-slate-600 rounded-xl text-slate-400 font-medium hover:border-yellow-400 hover:text-yellow-400 transition-all flex items-center justify-center gap-2 group"><Plus size={20} className="group-hover:rotate-90 transition-transform"/> เพิ่มรายการรายได้</button>
                    {showAddMenu && (<div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-[100] p-2 max-h-60 overflow-y-auto">{availableIncomeOptions.map(option => (<button key={option.id} onClick={() => addIncomeType(option.id)} className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left w-full text-slate-300 hover:text-white"><option.icon size={18} className="text-yellow-400" /><span className="text-sm">{option.label}</span></button>))}</div>)}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                   <SectionHeader icon={Users} title="ครอบครัว" subtitle="ค่าลดหย่อนส่วนตัว & ครอบครัว" />
                   <div className="space-y-1">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-xl mb-4">
                           <div className="flex items-center gap-3"><Users size={18} className="text-teal-400"/><span className="text-sm font-semibold text-slate-200">ส่วนตัว</span></div>
                           <div className="font-bold text-white">60,000</div>
                      </div>
                      {activeFamilyTypes.map(typeId => { const option = FAMILY_OPTIONS.find(o => o.id === typeId); return <DynamicDeductionInput key={typeId} config={option} value={deductions[typeId]} onChange={(v) => updateDeduction(typeId, v)} onRemove={() => removeFamilyType(typeId)} />; })}
                   </div>
                   <div className="relative mt-4" ref={addFamilyMenuRef}>
                       <button onClick={() => setShowAddFamilyMenu(!showAddFamilyMenu)} className="w-full py-3 bg-slate-900/50 rounded-xl text-sm text-slate-400 hover:text-teal-400 transition-all flex justify-center items-center gap-2 group"><Plus size={16} className="group-hover:rotate-90 transition-transform"/> เพิ่มรายการลดหย่อน</button>
                       {showAddFamilyMenu && (<div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">{availableFamilyOptions.map(o => <button key={o.id} onClick={() => addFamilyType(o.id, o.type)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg w-full text-left"><o.icon size={16} className="text-teal-400" /> {o.label}</button>)}</div>)}
                   </div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <SectionHeader icon={ShieldCheck} title="ประกัน" subtitle="สร้างหลักประกัน & ลดหย่อน" />
                    {activeInsuranceTypes.map(typeId => { const option = INSURANCE_OPTIONS.find(o => o.id === typeId); return <DynamicDeductionInput key={typeId} config={option} value={deductions[typeId]} onChange={(v) => updateDeduction(typeId, v)} onRemove={() => removeInsuranceType(typeId)} quota={result?.quotas?.[typeId === 'healthFather' || typeId === 'healthMother' || typeId === 'healthSpouseFather' || typeId === 'healthSpouseMother' ? 'healthParents' : typeId]} />; })}
                    <div className="relative mt-4" ref={addInsuranceMenuRef}>
                        <button onClick={() => setShowAddInsuranceMenu(!showAddInsuranceMenu)} className="w-full py-3 bg-slate-900/50 rounded-xl text-sm text-slate-400 hover:text-teal-400 transition-all flex justify-center items-center gap-2 group"><Plus size={16} className="group-hover:rotate-90 transition-transform"/> เพิ่มรายการประกัน</button>
                        {showAddInsuranceMenu && (<div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">{availableInsuranceOptions.map(o => <button key={o.id} onClick={() => addInsuranceType(o.id)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg w-full text-left"><o.icon size={16} className="text-teal-400" /> {o.label}</button>)}</div>)}
                    </div>
                </div>
             </div>

             <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative z-0">
                  <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                          <SectionHeader icon={TrendingUp} title="การลงทุน" subtitle="Thai ESG / RMF / SSF" />
                          {activeInvestmentTypes.map(typeId => { const option = INVESTMENT_OPTIONS.find(o => o.id === typeId); let q = result?.quotas?.[typeId]; if (typeId.includes('thaiESG')) q = result?.quotas?.thaiESG; return <DynamicDeductionInput key={typeId} config={option} value={deductions[typeId]} onChange={(v) => updateDeduction(typeId, v)} onRemove={() => removeInvestmentType(typeId)} quota={q} />; })}
                          <div className="relative mt-2" ref={addInvestmentMenuRef}>
                              <button onClick={() => setShowAddInvestmentMenu(!showAddInvestmentMenu)} className="text-xs text-slate-500 hover:text-yellow-400 flex items-center gap-1 group"><Plus size={12} className="group-hover:rotate-90 transition-transform"/> เพิ่มกองทุน</button>
                              {showAddInvestmentMenu && (<div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 p-2 w-64">{availableInvestmentOptions.map(o => <button key={o.id} onClick={() => addInvestmentType(o.id)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg w-full text-left"><o.icon size={16} className="text-yellow-400" /> {o.label}</button>)}</div>)}
                          </div>
                      </div>
                      <div className="w-px bg-white/10 hidden md:block"></div>
                      <div className="flex-1">
                           <SectionHeader icon={Home} title="อื่นๆ" subtitle="บ้าน & บริจาค" />
                           {activePropDonTypes.map(typeId => { const option = PROPERTY_DONATION_OPTIONS.find(o => o.id === typeId); return <DynamicDeductionInput key={typeId} config={option} value={deductions[typeId]} onChange={(v) => updateDeduction(typeId, v)} onRemove={() => removePropDonType(typeId)} quota={result?.quotas?.[typeId]} />; })}
                           <div className="relative mt-2" ref={addPropDonMenuRef}>
                               <button onClick={() => setShowAddPropDonMenu(!showAddPropDonMenu)} className="text-xs text-slate-500 hover:text-yellow-400 flex items-center gap-1 group"><Plus size={12} className="group-hover:rotate-90 transition-transform"/> เพิ่มรายการ</button>
                               {showAddPropDonMenu && (<div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 p-2 w-64">{availablePropDonOptions.map(o => <button key={o.id} onClick={() => addPropDonType(o.id)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg w-full text-left"><o.icon size={16} className="text-yellow-400" /> {o.label}</button>)}</div>)}
                           </div>
                      </div>
                  </div>
             </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative group p-6">
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/20 rounded-full blur-[80px] group-hover:bg-teal-400/30 transition-all duration-1000"></div>
                  <div className="text-center mb-6 relative z-10">
                    <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">ภาษีที่ต้องชำระ</p>
                    <div className="text-5xl font-extrabold text-white flex justify-center items-baseline gap-2">{result?.taxPayable.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-xl font-medium text-slate-500">THB</span></div>
                  </div>
                  {result && <TaxBracketVisual netIncome={result.netIncome} />}
                  
                  {/* Dashboard Progress Bars */}
                  <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5 mb-6 relative z-10">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">รายการลดหย่อนภาษีที่สำคัญ</h5>
                      <QuotaProgressBarDashboard label="ประกันชีวิตทั่วไป" used={result?.quotas.lifeInsurance?.used} limit={result?.quotas.lifeInsurance?.limit} maxCap={100000} color="bg-pink-500 text-pink-500" />
                      <QuotaProgressBarDashboard label="ประกันสุขภาพ" used={result?.quotas.healthInsurance?.used} limit={result?.quotas.healthInsurance?.limit} maxCap={25000} color="bg-emerald-500 text-emerald-500" />
                      <QuotaProgressBarDashboard label="Thai ESG" used={result?.quotas.thaiESG?.used} limit={result?.quotas.thaiESG?.limit} maxCap={300000} color="bg-teal-500 text-teal-500" />
                      <QuotaProgressBarDashboard label="RMF" used={result?.quotas.rmf?.used} limit={result?.quotas.rmf?.limit} maxCap={500000} color="bg-blue-500 text-blue-500" />
                      <QuotaProgressBarDashboard label="SSF" used={result?.quotas.ssf?.used} limit={result?.quotas.ssf?.limit} maxCap={200000} color="bg-orange-500 text-orange-500" />
                  </div>
                  
                  {result?.taxPayable > 0 && (
                      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl p-4 flex gap-3 items-start relative z-10">
                          <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400"><Target size={18}/></div>
                          <div className="text-xs text-slate-300 leading-relaxed"><span className="text-teal-400 font-bold block mb-1">คำแนะนำเบื้องต้น</span>{result?.quotas?.lifeInsurance?.remaining > 0 ? "แนะนำทำประกันชีวิตและสุขภาพเพื่อลดหย่อนภาษี" : "ลองเพิ่ม Thai ESG หรือบริจาคเพื่อลดหย่อนภาษีเพิ่มเติม"}</div>
                      </div>
                  )}
              </div>
              <TaxBreakdownList incomeSources={incomeSources} deductions={deductions} />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-[#020B2D]/90 backdrop-blur-xl border-t border-white/10 p-4 lg:hidden z-50">
           {isMobileDetailOpen && (
              <div className="absolute bottom-full left-0 right-0 bg-[#020B2D] border-t border-white/10 p-6 rounded-t-2xl max-h-[75vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-white">สรุปรายละเอียด</h3><button onClick={() => setIsMobileDetailOpen(false)} className="p-1 bg-white/10 rounded-full"><X size={20} className="text-white" /></button></div>
                 {result && <TaxBracketVisual netIncome={result.netIncome} />}
                 <TaxBreakdownList incomeSources={incomeSources} deductions={deductions} />
              </div>
           )}
           <div className="flex justify-between items-center">
               <div><p className="text-xs text-slate-400">Tax Payable</p><p className="text-2xl font-bold text-white">{result?.taxPayable.toLocaleString()} THB</p></div>
               <button onClick={() => setIsMobileDetailOpen(!isMobileDetailOpen)} className="bg-yellow-400 text-[#020B2D] px-6 py-2 rounded-full font-bold text-sm">{isMobileDetailOpen ? 'Close' : 'Details'}</button>
           </div>
      </div>
    </div>
  );
}