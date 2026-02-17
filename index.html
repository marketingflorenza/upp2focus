import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  Filter,
  MapPin,
  ChevronDown,
  Tag,
  PieChart as PieIcon
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
  'Ram': 'รามคำแหง (FRR)',
  'Bornsong': 'BSK'
};

const COLORS = {
  p1: '#10b981',    // Emerald 500
  upP2: '#f59e0b',  // Amber 500
  none: '#ef4444',  // Red 500 (ให้เด่นขึ้นในกรณีค้างติดตาม)
  total: '#6366f1'  // Indigo 500
};

// --- Custom Active Shape for Pie ---
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-sm">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs font-bold">{`${value} ราย`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} fill="#64748b" className="text-[10px]">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const App = () => {
  const [selectedBranch, setSelectedBranch] = useState('Choc');
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const id = SHEETS[selectedBranch];
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      const parsed = parseCSV(text);
      setRawData(parsed);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบการแชร์ Google Sheet หรือการเชื่อมต่ออินเทอร์เน็ต");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranch]);

  // --- Helper Functions ---
  const parseCSV = (text) => {
    if (!text) return [];
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    return lines.slice(1).map(line => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] ? values[i].replace(/"/g, '').trim() : '';
      });
      return obj;
    });
  };

  const parseDate = (s) => {
    if (!s) return null;
    const parts = s.split(/[\/\-\.]/);
    if (parts.length < 3) return null;
    
    let d, m, y;
    // Handle formats like DD/MM/YYYY or YYYY-MM-DD
    if (parts[0].length === 4) {
      y = parseInt(parts[0]);
      m = parseInt(parts[1]);
      d = parseInt(parts[2]);
    } else {
      d = parseInt(parts[0]);
      m = parseInt(parts[1]);
      y = parseInt(parts[2]);
    }

    if (m > 12) [d, m] = [m, d]; 
    if (y > 2500) y -= 543; // Buddhist to Gregorian
    if (y < 100) y += 2000;
    
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  };

  const getVal = (row, keyName) => {
    if (!row) return '';
    // Exact match
    if (row[keyName] !== undefined) return row[keyName];
    // Normalized match (ignore spaces and case)
    const target = keyName.replace(/\s+/g, '').toLowerCase();
    for (let k in row) {
      if (k.replace(/\s+/g, '').toLowerCase() === target) return row[k];
    }
    return '';
  };

  const parseAmount = (val) => {
    if (!val || val === '') return 0;
    const cleaned = String(val).replace(/[^0-9.-]+/g, '');
    return parseFloat(cleaned) || 0;
  };

  // --- Data Processing ---
  const processed = useMemo(() => {
    if (!rawData.length) return null;

    const start = new Date(dateRange.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    const userHistory = {};
    rawData.forEach(row => {
      const phone = getVal(row, 'เบอร์ติดต่อ')?.trim();
      const dateStr = getVal(row, 'วันที่');
      const date = parseDate(dateStr);
      
      if (!phone || !date) return;
      if (!userHistory[phone]) userHistory[phone] = [];
      userHistory[phone].push({ ...row, _date: date });
    });

    let stats = {
      targetP2: 0,
      convP1: 0,
      convUpP2: 0,
      totalUpP2Bills: 0,
      totalRevenue: 0
    };

    const successList = [];
    const pendingList = [];
    const checkedP2Keys = new Set();
    const checkedUpKeys = new Set();

    // Loop through all history to find success and funnel targets
    for (const phone in userHistory) {
      const logs = userHistory[phone].sort((a, b) => a._date - b._date);
      
      logs.forEach((log, idx) => {
        const isCurrentRange = log._date >= start && log._date <= end;
        
        // 1. Check Success (UP P2) for current range
        if (isCurrentRange) {
          const amt = parseAmount(getVal(log, 'ยอดอัพ P2'));
          const note = getVal(log, 'หมายเหตุ')?.toUpperCase();
          const key = `${phone}_${log._date.getTime()}`;

          if ((note === 'UP P2' || amt > 0) && !checkedUpKeys.has(key)) {
            stats.totalUpP2Bills++;
            stats.totalRevenue += amt;
            checkedUpKeys.add(key);
            successList.push({
              name: getVal(log, 'ชื่อลูกค้า'),
              phone: phone,
              item: getVal(log, 'รายการที่สนใจ'),
              amount: amt,
              date: log._date,
              sale: getVal(log, 'Sale'),
              status: 'UP P2'
            });
          }
        }

        // 2. Check P2 Funnel targets
        if (isCurrentRange) {
          const note = getVal(log, 'หมายเหตุ')?.toUpperCase();
          const p2Col = getVal(log, 'P2');
          const key = `${phone}_${log._date.getTime()}`;

          if ((note === 'P2' || p2Col === '1' || p2Col === 1) && !checkedP2Keys.has(key)) {
            stats.targetP2++;
            checkedP2Keys.add(key);

            let converted = false;
            // Immediate conversion
            if (parseAmount(getVal(log, 'ยอดอัพ P1')) > 0) {
              stats.convP1++;
              converted = true;
            } else if (parseAmount(getVal(log, 'ยอดอัพ P2')) > 0) {
              stats.convUpP2++;
              converted = true;
            }

            // Future conversion lookup
            if (!converted) {
              for (let i = idx + 1; i < logs.length; i++) {
                const next = logs[i];
                const nextP1 = parseAmount(getVal(next, 'ยอดอัพ P1'));
                const nextUp = parseAmount(getVal(next, 'ยอดอัพ P2'));
                const nextNote = getVal(next, 'หมายเหตุ')?.toUpperCase();

                if (nextNote === 'P1' || nextP1 > 0) {
                  stats.convP1++;
                  converted = true;
                  break;
                } else if (nextNote === 'UP P2' || nextUp > 0) {
                  stats.convUpP2++;
                  converted = true;
                  break;
                }
              }
            }

            if (!converted) {
              pendingList.push({
                date: log._date,
                name: getVal(log, 'ชื่อลูกค้า'),
                phone: phone,
                sale: getVal(log, 'Sale') || '-',
                interest: getVal(log, 'รายการที่สนใจ') || '-',
                serviceDate: getVal(log, 'วันที่เข้าใช้บริการ') || 'ยังไม่มีระบุ'
              });
            }
          }
        }
      });
    }

    return { stats, successList, pendingList };
  }, [rawData, dateRange]);

  const pieData = useMemo(() => {
    if (!processed || processed.stats.targetP2 === 0) return [];
    const noneCount = Math.max(0, processed.stats.targetP2 - (processed.stats.convP1 + processed.stats.convUpP2));
    
    return [
      { name: 'เปลี่ยนเป็น P1', value: processed.stats.convP1, color: COLORS.p1 },
      { name: 'อัพเกรด UP P2', value: processed.stats.convUpP2, color: COLORS.upP2 },
      { name: 'ค้างติดตาม', value: noneCount, color: COLORS.none }
    ].filter(d => d.value > 0);
  }, [processed]);

  const filteredSuccess = useMemo(() => {
    if (!processed) return [];
    return processed.successList.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.phone.includes(searchTerm) ||
      item.sale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processed, searchTerm]);

  const filteredPending = useMemo(() => {
    if (!processed) return [];
    return processed.pendingList.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.phone.includes(searchTerm) ||
      item.sale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interest.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processed, searchTerm]);

  const StatCard = ({ title, value, sub, colorClass, icon: Icon }) => (
    <div className={`bg-white p-6 rounded-2xl border-l-4 ${colorClass} shadow-sm transition-all hover:shadow-md hover:scale-[1.01]`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg opacity-80 ${colorClass.replace('border-', 'bg-')}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
      <p className="text-[10px] text-slate-400 mt-1 font-semibold">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2 text-indigo-800">
              <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100">
                <ArrowUpRight size={24} />
              </span>
              P2 Sales Analysis Pro
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-medium italic">Tracking real-time conversion & sales performance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BRANCH:</span>
              <div className="relative">
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="appearance-none bg-slate-100 border-none rounded-xl pl-4 pr-10 py-2.5 text-xs font-black text-indigo-700 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer hover:bg-slate-200"
                >
                  {Object.entries(BRANCH_NAMES).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
            </div>
            
            <button 
              onClick={fetchData} 
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Filters & KPI Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
               <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-500"><Filter size={14} /> FILTER ENGINE</h4>
               <div className="space-y-3">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">Start Date</label>
                   <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                    className="w-full bg-slate-50 border-none rounded-xl p-2.5 text-xs ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">End Date</label>
                   <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                    className="w-full bg-slate-50 border-none rounded-xl p-2.5 text-xs ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                   />
                 </div>
               </div>
               <div className="pt-2">
                 <div className="relative">
                   <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ/เบอร์/Sale..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                 </div>
               </div>
             </div>

             {/* Pie Chart Analysis Section */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-500 mb-4"><PieIcon size={14} className="text-indigo-500" /> CONVERSION RATE</h4>
               {pieData.length > 0 ? (
                 <>
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={pieData}
                            innerRadius={55}
                            outerRadius={75}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-4 grid grid-cols-1 gap-2">
                      {pieData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase">{item.name}</span>
                          </div>
                          <span className="text-[11px] font-black text-slate-800">{item.value} <small className="text-slate-400 font-normal tracking-normal">ราย</small></span>
                        </div>
                      ))}
                   </div>
                 </>
               ) : (
                 <div className="h-[250px] flex flex-col items-center justify-center text-slate-300 space-y-2 italic">
                   <AlertCircle size={32} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">No Data in Range</p>
                 </div>
               )}
             </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                title="P2 Targets" 
                value={processed?.stats.targetP2 || 0} 
                sub="จำนวนบิล P2 ทั้งหมด"
                colorClass="border-indigo-500"
                icon={Users}
              />
              <StatCard 
                title="UP P2 Count" 
                value={processed?.stats.totalUpP2Bills || 0} 
                sub="จำนวนบิลที่มีการ UP P2"
                colorClass="border-purple-500"
                icon={ArrowUpRight}
              />
              <StatCard 
                title="Converted P1" 
                value={processed?.stats.convP1 || 0} 
                sub="เปลี่ยนสถานะเป็น P1"
                colorClass="border-emerald-500"
                icon={CheckCircle}
              />
              <StatCard 
                title="Converted UP P2" 
                value={processed?.stats.convUpP2 || 0} 
                sub="อัพเกรดเป็น UP P2"
                colorClass="border-amber-500"
                icon={ArrowUpRight}
              />
              <StatCard 
                title="Pending Case" 
                value={Math.max(0, (processed?.stats.targetP2 || 0) - ((processed?.stats.convP1 || 0) + (processed?.stats.convUpP2 || 0)))} 
                sub="รอติดตามสถานะ"
                colorClass="border-red-500"
                icon={AlertCircle}
              />
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-xl flex flex-col justify-center text-white border border-indigo-400">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">TOTAL REVENUE (UP P2)</p>
                <h3 className="text-3xl font-black italic tracking-tighter">฿ {processed?.stats.totalRevenue.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2">
                   <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-300 rounded-full transition-all duration-1000" style={{width: '70%'}}></div>
                   </div>
                   <span className="text-[9px] font-black opacity-60">TARGET REACHED</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              
              {/* Success Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/10">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-700 flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" /> SUCCESSFUL UP P2 LIST
                  </h3>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-100">
                    {filteredSuccess.length} ITEMS
                  </span>
                </div>
                <div className="overflow-x-auto max-h-[350px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Customer</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Product</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Amount</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Date</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Sale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredSuccess.length > 0 ? filteredSuccess.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{row.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{row.phone}</div>
                          </td>
                          <td className="p-4 text-slate-500 text-[11px] max-w-[140px] truncate" title={row.item}>{row.item}</td>
                          <td className="p-4 text-emerald-600 font-black tracking-tight">฿{row.amount.toLocaleString()}</td>
                          <td className="p-4 text-slate-400 whitespace-nowrap">{row.date.toLocaleDateString('th-TH')}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black border border-indigo-100 uppercase">
                              {row.sale}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest italic">No successful records found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-rose-50/10">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-700 flex items-center gap-2">
                    <AlertCircle size={14} className="text-rose-500" /> PENDING FOLLOW-UP LIST
                  </h3>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-100">
                    {filteredPending.length} ITEMS
                  </span>
                </div>
                <div className="overflow-x-auto max-h-[350px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">P2 Date</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Customer</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Interested Item</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Sale</th>
                        <th className="p-4 font-black text-slate-400 uppercase tracking-tighter border-b border-slate-200">Service Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredPending.length > 0 ? filteredPending.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 text-slate-400 whitespace-nowrap">{row.date.toLocaleDateString('th-TH')}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{row.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{row.phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 max-w-[160px]">
                              <Tag size={12} className="text-slate-300" />
                              <span className="truncate" title={row.interest}>{row.interest}</span>
                            </div>
                          </td>
                          <td className="p-4 text-indigo-600 font-black uppercase whitespace-nowrap">{row.sale}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                              <MapPin size={10} className="text-indigo-500" /> {row.serviceDate}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="p-12 text-center text-emerald-500 font-black uppercase tracking-widest italic">All clear! No pending follow-ups</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </section>

        <footer className="pt-8 text-center text-slate-400 text-[9px] font-black uppercase tracking-[5px] opacity-40">
          PROPRIETARY ANALYTICS ENGINE &bull; DATA REFRESHED ON DEMAND
        </footer>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 shadow-xl shadow-indigo-100"></div>
          <p className="text-indigo-700 font-black text-xs tracking-[4px] uppercase animate-pulse">Syncing Engine</p>
        </div>
      )}
      
      {/* Error Notification */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-rose-500">
          <div className="bg-white/20 p-1.5 rounded-full">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Critical Error</p>
            <p className="text-[10px] font-medium opacity-80">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-4 hover:scale-110 transition-transform">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
