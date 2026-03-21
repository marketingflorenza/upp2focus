import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Sector,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  Search, 
  RefreshCw, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  Filter,
  MapPin,
  ChevronDown,
  Tag,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  Wallet,
  CheckCircle2,
  UserCheck,
  Phone,
  Save,
  Loader2,
  MessageSquare,
  X
} from 'lucide-react';

// --- Constants & Config ---
const SHEETS = {
  'Choc': '1F2bTvP1ySUT1q6fzRPQu7UpKNW_ze8GtKkd2rmRUjkI',
  'Bangyai': '1JU-rhoWIEHH4oSwIWApo8mUC8zQpNcT0Xd-70E_6CNM',
  'Sriracha': '1PdYqXkrrRGIv-6cCgOn8VXE6MpQhMlBGpFw7BbfzFbI',
  'Ram': '1LFoETe4YdPIxxj27bXxNRip9dKJ-sL7bbDv820ExEtk',
  'Bornsong': '1dlgM7YaQmJQTuiuNdAMb6tjKHllPgIs8MjfgGZnp8jU'
};

const BRANCH_NAMES = {
  'Choc': 'เชียงใหม่ (FRC)',
  'Bangyai': 'บางใหญ่ (FRB)',
  'Sriracha': 'ศรีราชา (FRS)',
  'Ram': 'รามอินทรา (FRR)',
  'Bornsong': 'บรอนซอง (BSK)'
};

const AIRTABLE_PAT = 'patEpm1a9qbA4UNmI.e4e04718b6440936eeb4ba95176697b096ce4d46feaed2a62da855d11034f3a5'; 
const AIRTABLE_BASE_ID = 'appuQaGsJFGRrcw85'; 
const AIRTABLE_TABLE_NAME = 'Note_Storage'; 

const COLORS = {
  target: '#0ea5e9',
  allUp: '#6366f1',
  p1: '#10b981',
  upP2: '#f59e0b',
  none: '#f43f5e',
};

const getThaiYMD = (date) => {
  const thaiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const y = thaiDate.getFullYear();
  const m = String(thaiDate.getMonth() + 1).padStart(2, '0');
  const d = String(thaiDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseCSV = (str) => {
  const arr = [];
  let quote = false;
  let row = 0, col = 0;
  for (let c = 0; c < str.length; c++) {
    let cc = str[c], nc = str[c+1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }
    arr[row][col] += cc;
  }
  return arr;
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 6) * cos;
  const sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  return (
    <g>
      <text x={cx} y={cy - 5} dy={8} textAnchor="middle" fill="#1e293b" className="font-black text-lg">{value}</text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#94a3b8" className="font-bold text-[9px] uppercase tracking-tighter">ราย</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={4} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="#1e293b" className="text-[10px] font-black">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={12} textAnchor={textAnchor} fill="#64748b" className="text-[9px] font-medium">{`${(percent * 100).toFixed(1)}%`}</text>
    </g>
  );
};

const NoteCell = ({ branchId, rowId, initialNote, airtableRecordId, onNoteSaved }) => {
  const [text, setText] = useState(initialNote || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => { setText(initialNote || ''); }, [initialNote]);

  const handleSave = async () => {
    if (!AIRTABLE_PAT) { alert(`ไม่พบ Airtable Token`); return; }
    setIsSaving(true); setIsSuccess(false);
    try {
      const isUpdate = !!airtableRecordId;
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
      const method = isUpdate ? 'PATCH' : 'POST';
      const bodyData = { records: [ isUpdate ? { id: airtableRecordId, fields: { "Notes": text } } : { fields: { "ID": rowId, "Notes": text, "Branch": branchId } } ] };
      const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) });
      if (!response.ok) throw new Error('Airtable API response not OK');
      const responseData = await response.json();
      const newRecordId = responseData.records[0].id;
      setIsSuccess(true);
      onNoteSaved(rowId, text, newRecordId);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกไปที่ Airtable");
    } finally { setIsSaving(false); }
  };

  return (
    <div className="flex items-start gap-2">
      <div className="relative flex-1">
        <MessageSquare size={12} className="absolute left-2 top-2.5 text-rose-300" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="พิมพ์บันทึก..." className="w-full bg-white border border-rose-200 rounded-md py-1.5 pl-7 pr-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent min-h-[32px] resize-y" rows={1} />
      </div>
      <button onClick={handleSave} disabled={isSaving || text === initialNote} className={`p-1.5 rounded-md flex-shrink-0 transition-all ${isSuccess ? 'bg-emerald-100 text-emerald-600' : (isSaving || text === initialNote) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-rose-100 text-rose-600 hover:bg-rose-200 shadow-sm'}`} title="บันทึกย่อ">
        {isSaving ? <Loader2 size={16} className="animate-spin" /> : isSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
      </button>
    </div>
  );
};

const App = () => {
  const [selectedBranch, setSelectedBranch] = useState('Choc');
  const [rawData, setRawData] = useState([]);
  const [rawNotes, setRawNotes] = useState({});
  const [airtableIds, setAirtableIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ NEW: State for interest filter in pending table
  const [interestFilter, setInterestFilter] = useState('');

  const updateLocalNote = (id, text, recordId) => {
    setRawNotes(prev => ({ ...prev, [id]: text }));
    if (recordId) setAirtableIds(prev => ({ ...prev, [id]: recordId }));
  };

  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    return { start: getThaiYMD(new Date(now.getFullYear(), now.getMonth(), 1)), end: getThaiYMD(now) };
  });

  const parseDate = (s) => {
    if (!s) return null;
    const parts = s.split(/[\/\-\.]/);
    if (parts.length < 3) return null;
    let p0 = parseInt(parts[0]), p1 = parseInt(parts[1]), p2 = parseInt(parts[2]);
    let d, m, y;
    if (p1 > 12) { m = p0; d = p1; y = p2; } else { m = p0; d = p1; y = p2; }
    if (y > 2500) y -= 543;
    if (y < 100) y += 2000;
    return new Date(y, m - 1, d);
  };

  const getVal = (row, keyName) => {
    if (!row) return '';
    if (row[keyName] !== undefined) return row[keyName];
    const target = keyName.replace(/\s+/g, '').toLowerCase();
    for (let k in row) { if (k.replace(/\s+/g, '').toLowerCase() === target) return row[k]; }
    return '';
  };

  const parseAmount = (str) => {
    if (!str) return 0;
    if (typeof str !== 'string') str = String(str);
    return parseFloat(str.replace(/,/g, '')) || 0;
  };

  const isWithin = (d, s, e) => {
    if (!d) return false;
    if (s && d < s) return false;
    if (e && d > e) return false;
    return true;
  };

  const fetchData = async () => {
    setLoading(true); setError(null);
    const id = SHEETS[selectedBranch];
    const cacheBuster = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mainUrl = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=Sum&tq=select%20*&_cb=${cacheBuster}`;
    try {
      const mainResponse = await fetch(mainUrl, { cache: 'no-store' });
      if (!mainResponse.ok) throw new Error("Network Response Error");
      const mainText = await mainResponse.text();
      const mainParsed = parseCSV(mainText);
      const headers = mainParsed[0].map(h => h.trim());
      const parsedData = mainParsed.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i] ? row[i].trim() : ''; });
        return obj;
      });
      setRawData(parsedData);
      let notesDict = {}, recordIdsDict = {};
      if (AIRTABLE_PAT) {
        try {
          const formula = `{Branch}='${selectedBranch}'`;
          const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${encodeURIComponent(formula)}`;
          const airtableResponse = await fetch(airtableUrl, { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` } });
          if (airtableResponse.ok) {
            const airtableData = await airtableResponse.json();
            airtableData.records.forEach(record => {
              const rowId = record.fields.ID;
              if (rowId) { notesDict[rowId] = record.fields.Notes || ''; recordIdsDict[rowId] = record.id; }
            });
          }
        } catch (e) { console.error("Error fetching Airtable data:", e); }
      }
      setRawNotes(notesDict); setAirtableIds(recordIdsDict);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้ ตรวจสอบการแชร์ของ Google Sheet");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedBranch]);

  const processed = useMemo(() => {
    if (!rawData.length) return null;
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const userHistory = {};
    rawData.forEach(row => {
      const phone = getVal(row, 'เบอร์ติดต่อ')?.trim() || 'NoPhone';
      const name = getVal(row, 'ชื่อลูกค้า')?.trim() || 'NoName';
      const date = parseDate(getVal(row, 'วันที่'));
      const note = getVal(row, 'หมายเหตุ')?.trim().toUpperCase();
      if (!date) return;
      const identityKey = `${phone}_${name}`;
      if (!userHistory[identityKey]) userHistory[identityKey] = [];
      userHistory[identityKey].push({ ...row, _date: date, _note: note, _phone: phone, _name: name, _identityKey: identityKey });
    });

    let countP2_Targets = 0, countP1_Converted = 0, countUpP2_Converted = 0, countTotal_UpP2_Bills = 0, totalRevenue = 0;
    const allUpP2SalesList = [], p1SuccessList = [], pendingDetails = [];
    const checkedKeysP2 = new Set(), checkedKeysAllUp = new Set();

    for (const identityKey in userHistory) {
      userHistory[identityKey].forEach(log => {
        if (!isWithin(log._date, start, end)) return;
        const dayKey = `${identityKey}_${log._date.getTime()}`;
        const amtUpP2 = parseAmount(getVal(log, 'ยอดอัพ P2'));
        if ((log._note === 'UP P2' || amtUpP2 > 0) && !checkedKeysAllUp.has(dayKey)) {
          countTotal_UpP2_Bills++; totalRevenue += amtUpP2; checkedKeysAllUp.add(dayKey);
          allUpP2SalesList.push({ name: log._name, status: 'UP P2', amt: amtUpP2, date: log._date, sale: getVal(log, 'Sale'), interest: getVal(log, 'รายการที่สนใจ') });
        }
      });
    }

    for (const identityKey in userHistory) {
      const logs = userHistory[identityKey].sort((a, b) => a._date - b._date);
      logs.forEach((log, idx) => {
        if (!isWithin(log._date, start, end)) return;
        const dayKey = `${identityKey}_${log._date.getTime()}`;
        if (log._note === 'P2' && !checkedKeysP2.has(dayKey)) {
          countP2_Targets++; checkedKeysP2.add(dayKey);
          let isConverted = false;
          const p1AmtSelf = parseAmount(getVal(log, 'P1')), upP2AmtSelf = parseAmount(getVal(log, 'ยอดอัพ P2'));
          if (p1AmtSelf > 0 || log._note === 'P1') {
            countP1_Converted++; p1SuccessList.push({ name: log._name, phone: log._phone, amt: p1AmtSelf, date: log._date, sale: getVal(log, 'Sale'), interest: getVal(log, 'รายการที่สนใจ'), p2Date: log._date }); isConverted = true;
          } else if (upP2AmtSelf > 0) { countUpP2_Converted++; isConverted = true; }
          if (!isConverted) {
            for (let i = idx + 1; i < logs.length; i++) {
              const next = logs[i];
              const p1AmtNext = parseAmount(getVal(next, 'P1')), upP2AmtNext = parseAmount(getVal(next, 'ยอดอัพ P2'));
              if (next._note === 'P1' || p1AmtNext > 0) {
                countP1_Converted++; p1SuccessList.push({ name: next._name, phone: next._phone, amt: p1AmtNext, date: next._date, sale: getVal(next, 'Sale'), interest: getVal(next, 'รายการที่สนใจ'), p2Date: log._date }); isConverted = true; break;
              } else if (next._note === 'UP P2' || upP2AmtNext > 0) { countUpP2_Converted++; isConverted = true; break; }
            }
          }
          if (!isConverted) {
            const rawArrivalDate = getVal(log, 'วันที่เข้าใช้บริการ');
            const parsedArrivalDate = parseDate(rawArrivalDate);
            pendingDetails.push({ id: log._identityKey, p2Date: log._date, name: log._name, phone: log._phone, sale: getVal(log, 'Sale') || '-', interest: getVal(log, 'รายการที่สนใจ') || '-', arrivalDate: parsedArrivalDate || rawArrivalDate || '-', note: rawNotes[log._identityKey] || '', airtableRecordId: airtableIds[log._identityKey] || null });
          }
        }
      });
    }

    const countNone = Math.max(0, countP2_Targets - (countP1_Converted + countUpP2_Converted));
    return { stats: { countP2_Targets, countTotal_UpP2_Bills, countP1_Converted, countUpP2_Converted, countNone, totalRevenue }, allUpP2SalesList, p1SuccessList, pendingDetails };
  }, [rawData, dateRange, rawNotes, airtableIds]);

  const pieData = useMemo(() => {
    if (!processed || processed.stats.countP2_Targets === 0) return [];
    return [
      { name: 'เปลี่ยนเป็น P1', value: processed.stats.countP1_Converted, color: COLORS.p1 },
      { name: 'อัพเกรด UP P2', value: processed.stats.countUpP2_Converted, color: COLORS.upP2 },
      { name: 'ค้างติดตาม', value: processed.stats.countNone, color: COLORS.none }
    ].filter(d => d.value > 0);
  }, [processed]);

  // ✅ Extract unique interest values — ใช้ค่าเต็มจากข้อมูลจริง ไม่ split
  const uniqueInterests = useMemo(() => {
    if (!processed) return [];
    const interests = new Set();
    processed.pendingDetails.forEach(row => {
      const val = (row.interest || '').trim();
      if (val && val !== '-') interests.add(val);
    });
    return Array.from(interests).sort((a, b) => a.localeCompare(b, 'th'));
  }, [processed]);

  const filteredUpP2 = useMemo(() => {
    if (!processed) return [];
    return processed.allUpP2SalesList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.sale && s.sale.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [processed, searchTerm]);

  const filteredP1 = useMemo(() => {
    if (!processed) return [];
    return processed.p1SuccessList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.sale && s.sale.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [processed, searchTerm]);

  // ✅ UPDATED: Apply both searchTerm AND interestFilter to pending list
  const filteredPending = useMemo(() => {
    if (!processed) return [];
    return processed.pendingDetails.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.phone.includes(searchTerm) ||
        (s.sale && s.sale.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.note && s.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesInterest = !interestFilter || 
        (s.interest || '').trim() === interestFilter;

      return matchesSearch && matchesInterest;
    });
  }, [processed, searchTerm, interestFilter]);

  const StatCard = ({ title, value, colorClass, sub, icon: Icon, percent }) => (
    <div className={`bg-white p-5 rounded-2xl border-l-4 ${colorClass} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{title}</p>
        <div className={`p-1.5 rounded-lg ${colorClass.replace('border-', 'bg-').replace('500', '100').replace('400', '100')}`}>
          <Icon size={14} className={colorClass.replace('border-', 'text-')} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        {percent && <span className="text-xs font-bold text-emerald-600">{percent}</span>}
      </div>
      <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-100"><TrendingUp size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Sales & Conversion Analysis</h1>
              <p className="text-slate-400 text-xs font-medium">Unique Identity Sync (Name + Phone) สำหรับสาขา {BRANCH_NAMES[selectedBranch]}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl px-4 py-2 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="bg-white p-1.5 rounded-lg shadow-sm"><MapPin size={18} className="text-indigo-600" /></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-400 uppercase leading-none mb-0.5">เลือกสาขาพื้นที่</span>
                <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-transparent border-none p-0 text-sm font-black text-indigo-900 outline-none cursor-pointer focus:ring-0 leading-tight">
                  {Object.entries(BRANCH_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                </select>
              </div>
            </div>
            <button onClick={fetchData} className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-md" disabled={loading}>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> {loading ? "กำลังโหลด..." : "อัปเดตข้อมูล"}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b pb-2"><Filter size={14} /> กรองข้อมูล</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">เริ่มต้น</label>
                  <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))} className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">สิ้นสุด</label>
                  <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))} className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="relative pt-2">
                  <Search size={14} className="absolute left-3 top-5 text-slate-400" />
                  <input type="text" placeholder="ค้นหาชื่อ/เบอร์/Sale/Note..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2.5 text-xs outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><PieIcon size={14} /> CONVERSION</h4>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">ALL P2</span>
              </div>
              <div className="h-[280px] w-full">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} innerRadius={55} outerRadius={75} dataKey="value" onMouseEnter={(_, index) => setActiveIndex(index)} paddingAngle={2}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-[10px] font-bold text-slate-600 uppercase ml-1">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-[10px] space-y-2">
                    <PieIcon size={40} className="opacity-20" /><p>ไม่มีข้อมูลในช่วงเวลานี้</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title="🎯 กลุ่มเป้าหมาย P2" value={processed?.stats.countP2_Targets || 0} sub="(คัดแยกชื่อ + เบอร์)" colorClass="border-sky-500" icon={Users} />
              <StatCard title="✅ เปลี่ยนเป็น P1" value={processed?.stats.countP1_Converted || 0} percent={processed?.stats.countP2_Targets > 0 ? ((processed.stats.countP1_Converted/processed.stats.countP2_Targets)*100).toFixed(1) + '%' : '0%'} sub="P2 to P1 Success" colorClass="border-emerald-500" icon={CheckCircle2} />
              <StatCard title="🚨 ค้างติดตาม P2" value={processed?.stats.countNone || 0} percent={processed?.stats.countP2_Targets > 0 ? ((processed.stats.countNone/processed.stats.countP2_Targets)*100).toFixed(1) + '%' : '0%'} sub="High Priority Follow-up" colorClass="border-rose-500" icon={AlertCircle} />
              <StatCard title="💜 บิล UP P2 ทั้งหมด" value={processed?.stats.countTotal_UpP2_Bills || 0} sub="(นับทุกใบเสร็จ UP P2)" colorClass="border-indigo-500" icon={Wallet} />
              <StatCard title="⚠️ Upgrade UP P2" value={processed?.stats.countUpP2_Converted || 0} percent={processed?.stats.countP2_Targets > 0 ? ((processed.stats.countUpP2_Converted/processed.stats.countP2_Targets)*100).toFixed(1) + '%' : '0%'} sub="P2 ที่เข้ามาตามเวลากำหนด" colorClass="border-amber-500" icon={ArrowUpRight} />
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-lg flex flex-col justify-center border-b-4 border-indigo-500">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-[2px]">Revenue (UP P2)</p>
                <h3 className="text-3xl font-black italic tracking-tighter">฿ {(processed?.stats.totalRevenue || 0).toLocaleString()}</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* ✅ UPDATED Pending Table with Interest Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-rose-100 overflow-hidden ring-4 ring-rose-50/50">
                <div className="p-4 border-b border-rose-100 bg-rose-50/30 space-y-3">
                  {/* Header row */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <h3 className="font-black text-sm uppercase tracking-wider text-rose-700 flex items-center gap-2">
                      <AlertCircle size={18} className="animate-pulse" /> ลูกค้า P2 ที่ต้องติดตาม (ยังไม่ปิดการขาย)
                    </h3>
                    <span className="text-[10px] font-black px-3 py-1 bg-rose-600 text-white rounded-full shadow-lg">
                      {filteredPending.length} รายการที่ค้าง
                    </span>
                  </div>

                  {/* ✅ Interest Filter — native select (reliable, no overlay bug) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-1">
                      <Tag size={11} /> กรองรายการที่สนใจ:
                    </span>

                    <div className="relative flex items-center">
                      <Filter size={11} className="absolute left-2.5 text-rose-400 pointer-events-none" />
                      <select
                        value={interestFilter}
                        onChange={(e) => setInterestFilter(e.target.value)}
                        className="pl-7 pr-8 py-1.5 text-[11px] font-bold bg-white border border-rose-200 rounded-lg text-rose-700 outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent cursor-pointer appearance-none shadow-sm hover:border-rose-400 transition-colors"
                      >
                        <option value="">— ทั้งหมด ({processed?.pendingDetails.length || 0} ราย) —</option>
                        {uniqueInterests.map(interest => {
                          const count = processed?.pendingDetails.filter(r =>
                            (r.interest || '').trim() === interest
                          ).length || 0;
                          return (
                            <option key={interest} value={interest}>
                              {interest} ({count} ราย)
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 text-rose-400 pointer-events-none" />
                    </div>

                    {/* Active filter badge + clear */}
                    {interestFilter && (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black shadow-md">
                        <span>{interestFilter}</span>
                        <button
                          onClick={() => setInterestFilter('')}
                          className="ml-0.5 hover:bg-rose-500 rounded-full p-0.5 transition-colors"
                          title="ล้างตัวกรอง"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50/50 sticky top-0 z-10 backdrop-blur-sm">
                      <tr>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] w-24">วันที่เป็น P2</th>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] w-40">ชื่อลูกค้า</th>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] w-28"><div className="flex items-center gap-1"><Clock size={12}/> วันที่เข้า</div></th>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] bg-rose-100/50 w-32"><div className="flex items-center gap-1"><Phone size={12}/> เบอร์โทรศัพท์</div></th>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            รายการที่สนใจ
                            {interestFilter && (
                              <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white rounded-full text-[8px] font-black">
                                ✓
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="p-3 font-black text-rose-800 uppercase text-[10px] min-w-[300px]">📝 บันทึกการติดตาม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {filteredPending.map((row, i) => (
                        <tr key={`${row.id}_${i}`} className="hover:bg-rose-50/30 transition-colors">
                          <td className="p-3 text-slate-500 font-medium">{row.p2Date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</td>
                          <td className="p-3"><div className="font-black text-slate-800 text-sm">{row.name}</div></td>
                          <td className="p-3">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-100/50 text-rose-700 font-bold text-[10px]">
                              {row.arrivalDate instanceof Date ? row.arrivalDate.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' }) : (row.arrivalDate !== '-' ? row.arrivalDate : 'ไม่ระบุ')}
                            </div>
                          </td>
                          <td className="p-3 bg-rose-50/20">
                            <a href={`tel:${row.phone}`} className="font-mono text-sm font-black text-rose-600 hover:underline flex items-center gap-1">{row.phone}</a>
                          </td>
                          <td className="p-3 text-slate-500 italic max-w-[150px] leading-tight break-words whitespace-pre-wrap">
                            {interestFilter && (row.interest || '').trim() === interestFilter ? (
                              <span className="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                {row.interest}
                              </span>
                            ) : row.interest}
                          </td>
                          <td className="p-3">
                            <NoteCell branchId={selectedBranch} rowId={row.id} initialNote={row.note} airtableRecordId={row.airtableRecordId} onNoteSaved={updateLocalNote} />
                          </td>
                        </tr>
                      ))}
                      {filteredPending.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-12 text-center">
                            {interestFilter ? (
                              <div className="space-y-2">
                                <p className="text-slate-400 font-black text-sm">ไม่พบลูกค้าที่สนใจ "{interestFilter}"</p>
                                <button onClick={() => setInterestFilter('')} className="text-[10px] font-bold text-rose-500 hover:underline">ล้างตัวกรอง</button>
                              </div>
                            ) : (
                              <p className="text-emerald-500 font-black text-lg">🎉 เยี่ยมมาก! ไม่มีงานค้างติดตามในช่วงนี้</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table P1 Success */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/20">
                  <h3 className="font-black text-xs uppercase tracking-widest text-emerald-700 flex items-center gap-2"><CheckCircle2 size={16} /> รายชื่อเปลี่ยนเป็น P1 สำเร็จ (Conversion)</h3>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-600 text-white rounded-full">{filteredP1.length} รายการ</span>
                </div>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-black text-slate-400 uppercase">Customer</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Interest</th>
                        <th className="p-4 font-black text-slate-400 uppercase text-emerald-700">Amount (P1)</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Date</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Sale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredP1.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4"><div className="font-bold text-slate-800">{row.name}</div><div className="text-[10px] text-slate-400 font-mono">{row.phone}</div></td>
                          <td className="p-4 text-slate-500 italic truncate max-w-[150px]">{row.interest}</td>
                          <td className="p-4 font-black text-emerald-600 text-sm">฿{row.amt.toLocaleString()}</td>
                          <td className="p-4 text-slate-400">{row.date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</td>
                          <td className="p-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-black text-[9px] uppercase">{row.sale}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table UP P2 Bills */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
                  <h3 className="font-black text-xs uppercase tracking-widest text-indigo-700 flex items-center gap-2"><ArrowUpRight size={16} /> รายชื่อยอดขาย UP P2 ทั้งหมด (ทุกบิล)</h3>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-indigo-600 text-white rounded-full">{filteredUpP2.length} บิล</span>
                </div>
                <div className="overflow-x-auto max-h-[350px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-black text-slate-400 uppercase">Customer</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Interest</th>
                        <th className="p-4 font-black text-slate-400 uppercase">UP P2 Amount</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Date</th>
                        <th className="p-4 font-black text-slate-400 uppercase">Sale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUpP2.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">{row.name}</td>
                          <td className="p-4 text-slate-500 italic truncate max-w-[150px]">{row.interest}</td>
                          <td className="p-4 font-black text-indigo-600 text-sm">฿{row.amt.toLocaleString()}</td>
                          <td className="p-4 text-slate-400">{row.date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</td>
                          <td className="p-4"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-black text-[9px] uppercase">{row.sale}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-8 text-center text-slate-400 text-[9px] font-black uppercase tracking-[5px] opacity-40">
          PROPRIETARY ANALYTICS ENGINE &bull; DATA REFRESHED ON DEMAND &bull; UNIQUE IDENTITY LOGIC ENABLED
        </footer>
      </div>
    </div>
  );
};

export default App;
