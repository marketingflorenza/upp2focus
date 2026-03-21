<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clinic Sales Analytics Dashboard (Ultimate Pro - Full Feature Set)</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet">
    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <style>
        :root {
            --primary-color: #6366f1;
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
            --accent-color: #ec4899;
            --bg-body: #f3f4f6;
            --bg-card: #ffffff;
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --border-radius: 16px;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
            --font-family: 'Prompt', sans-serif;
            
            --tier-0: #94a3b8; --tier-1: #64748b; --tier-2: #3b82f6; --tier-3: #10b981;
            --tier-4: #f59e0b; --tier-5: #ea580c; --tier-6: #be123c;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: var(--font-family); 
            background-color: var(--bg-body);
            color: var(--text-main);
            min-height: 100vh;
            padding: 20px;
            background-image: 
                radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
            background-attachment: fixed;
        }

        .dashboard-container { 
            max-width: 1600px; margin: 0 auto; 
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px; box-shadow: var(--shadow-lg);
            backdrop-filter: blur(10px); overflow: hidden; 
        }

        .header { background: var(--primary-gradient); color: white; padding: 30px; text-align: center; }

        .controls-container { 
            background: white; padding: 20px 30px; border-bottom: 1px solid #e5e7eb; 
            display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; 
            position: sticky; top: 0; z-index: 100;
        }

        .input-group { display: flex; flex-direction: column; gap: 5px; }
        .input-group label { font-size: 0.85em; font-weight: 600; color: var(--text-muted); }
        .input-group input, .input-group select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: var(--font-family); }

        .btn-group { margin-left: auto; display: flex; gap: 10px; }
        button {
            border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer;
            font-weight: 600; font-family: var(--font-family); display: flex; align-items: center; gap: 8px;
            transition: all 0.2s;
        }
        .btn-primary { background: var(--text-main); color: white; }
        .btn-magic { background: var(--secondary-gradient); color: white; }
        .btn-sm { padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; background: #f3f4f6; color: var(--primary-color); border: 1px solid #e5e7eb; font-weight: 600; }
        .btn-sm:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        
        button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        button:disabled { background: #e5e7eb; cursor: not-allowed; }

        .main-content { padding: 30px; }

        .report-metadata {
            display: none; 
            background: #f8fafc;
            padding: 25px;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }
        .meta-item { display: flex; flex-direction: column; gap: 6px; }
        .meta-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-value { font-size: 15px; font-weight: 600; color: var(--text-main); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px; margin-bottom: 40px; }
        .stat-card { 
            background: white; padding: 15px; border-radius: var(--border-radius); 
            box-shadow: var(--shadow-sm); border: 1px solid #f3f4f6;
            display: flex; flex-direction: column; justify-content: center;
            min-height: 120px; page-break-inside: avoid;
        }
        .stat-value { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }

        .highlight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .highlight-card {
            padding: 25px; border-radius: 20px; color: white; position: relative; overflow: hidden;
            box-shadow: var(--shadow-md); transition: transform 0.3s;
        }
        .highlight-card:hover { transform: scale(1.02); }
        .highlight-card i { position: absolute; right: -10px; bottom: -10px; font-size: 5rem; opacity: 0.15; }
        .highlight-card .h-label { font-size: 0.9rem; font-weight: 600; opacity: 0.9; margin-bottom: 5px; }
        .highlight-card .h-val { font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .highlight-card .h-sub { font-size: 0.8rem; margin-top: 5px; opacity: 0.8; font-weight: 400; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        
        .highlight-card .badge { border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.2); color: white; }

        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(48%, 1fr)); gap: 25px; margin-bottom: 30px; }
        .chart-box { background: white; padding: 20px; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); height: 400px; position: relative; }

        .section-header { margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; display: flex; align-items: center; gap: 10px; }
        .section-header h2 { font-size: 1.4rem; font-weight: 700; color: var(--text-main); }

        .table-wrapper { background: white; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 30px; overflow: hidden; page-break-inside: avoid; }
        .table-header { padding: 15px 20px; background: #f9fafb; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
        .table-scroll { max-height: 500px; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f9fafb; padding: 12px 15px; text-align: left; font-size: 0.8rem; color: var(--text-muted); position: sticky; top: 0; z-index: 5; text-transform: uppercase; }
        td { padding: 12px 15px; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem; }
        tr:hover td { background: #f8fafc; }

        .badge { font-size: 0.65rem; padding: 3px 8px; border-radius: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
        .badge.pos { background: #dcfce7; color: #166534; }
        .badge.neg { background: #fee2e2; color: #991b1b; }
        .badge.neu { background: #f3f4f6; color: #4b5563; }

        .segment-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .segment-card { background: white; border-radius: 12px; padding: 15px; border-left: 5px solid #ddd; box-shadow: var(--shadow-sm); cursor: pointer; transition: transform 0.2s; }
        .segment-card:hover { transform: translateY(-3px); }
        .seg-label { font-weight: 700; font-size: 0.85rem; display: flex; justify-content: space-between; margin-bottom: 8px; }
        .seg-val { font-size: 1.1rem; font-weight: 700; color: var(--primary-color); }
        
        .clickable { color: var(--primary-color); font-weight: 600; cursor: pointer; text-decoration: none; }
        .clickable:hover { text-decoration: underline; }

        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
        .modal-content { background: white; margin: 5vh auto; width: 95%; max-width: 1200px; border-radius: 20px; display: flex; flex-direction: column; max-height: 90vh; animation: slideIn 0.3s; }
        .modal-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 20px; overflow-y: auto; }
        .modal-footer { padding: 15px 20px; border-top: 1px solid #eee; background: #f9fafb; text-align: right; border-radius: 0 0 20px 20px; }
        .close-btn { cursor: pointer; font-size: 1.5rem; color: #999; }
        textarea { width: 100%; height: 450px; padding: 15px; border-radius: 10px; border: 1px solid #ddd; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
        @keyframes slideIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* ===== RFM Model Styles (ADDED) ===== */
        .rfm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .rfm-card {
            border-radius: 20px; padding: 25px; cursor: pointer;
            transition: transform 0.25s, box-shadow 0.25s;
            position: relative; overflow: hidden;
            border: 2px solid transparent;
        }
        .rfm-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        .rfm-card .rfm-icon { font-size: 3rem; margin-bottom: 12px; display: block; }
        .rfm-card .rfm-title { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        .rfm-card .rfm-count { font-size: 2.2rem; font-weight: 800; line-height: 1; margin-bottom: 6px; }
        .rfm-card .rfm-sub { font-size: 0.8rem; opacity: 0.85; line-height: 1.8; white-space: pre-line; }
        .rfm-card .rfm-pct-bar { margin-top: 14px; background: rgba(255,255,255,0.25); border-radius: 10px; height: 6px; }
        .rfm-card .rfm-pct-fill { height: 6px; border-radius: 10px; background: rgba(255,255,255,0.8); transition: width 0.8s; }
        .rfm-card.rfm-active { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; border-color: #047857; }
        .rfm-card.rfm-fading { background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; border-color: #b45309; }
        .rfm-card.rfm-lost   { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; border-color: #b91c1c; }
        .rfm-donut-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; }
        .rfm-chart-box { background: white; padding: 20px; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); height: 320px; position: relative; }
        @media (max-width: 900px) {
            .rfm-grid { grid-template-columns: 1fr; }
            .rfm-donut-wrap { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <div class="dashboard-container">
        <div class="header">
            <h1><i class="fa-solid fa-chart-line"></i> Clinic Sales Intelligence Pro</h1>
            <p>ระบบวิเคราะห์ยอดขาย พฤติกรรมลูกค้า และประสิทธิภาพการจัดสรรบริการ</p>
        </div>

        <div class="controls-container">
            <div class="input-group" style="flex: 1;">
                <label><i class="fa-solid fa-file-excel"></i> เลือกไฟล์ข้อมูล</label>
                <input type="file" id="fileInput" accept=".xlsx, .xls, .csv">
            </div>
            <div class="input-group"><label>เริ่มต้น</label><input type="date" id="startDate" disabled></div>
            <div class="input-group"><label>สิ้นสุด</label><input type="date" id="endDate" disabled></div>
            <div class="input-group">
                <label>เปรียบเทียบ</label>
                <input type="checkbox" id="compareToggle" disabled>
            </div>
            <div id="compareRange" style="display:none; gap: 15px;">
                <div class="input-group"><label>เทียบจาก</label><input type="date" id="compareStartDate"></div>
                <div class="input-group"><label>ถึงวันที่</label><input type="date" id="compareEndDate"></div>
            </div>
            <div class="btn-group">
                <button class="btn-primary" id="filterBtn" onclick="applyFilters()" disabled><i class="fa-solid fa-sync"></i> ประมวลผล</button>
                <button class="btn-magic" id="aiBtn" onclick="showAIModal()" disabled><i class="fa-solid fa-wand-magic-sparkles"></i> AI Summary</button>
                <button style="background:#10b981; color:white;" id="exportPdfBtn" onclick="exportPDF()" disabled><i class="fa-solid fa-file-pdf"></i> PDF หน้าเดียว</button>
            </div>
        </div>

        <div id="dashboardView"> 
            <div class="main-content" style="background: white;">
                <div id="initialState" style="text-align:center; padding: 80px; color: #9ca3af;">
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 3.5rem; margin-bottom: 20px;"></i>
                    <h2>อัปโหลดไฟล์ Excel เพื่อแสดงผลข้อมูลเชิงลึก</h2>
                </div>

                <div id="dashboardDataView" style="display: none;">
                    
                    <div class="report-metadata" id="reportMetaSection">
                        <div class="meta-item">
                            <span class="meta-label">ชื่อไฟล์ข้อมูล</span>
                            <span class="meta-value" id="reportFileName">-</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">ช่วงเวลาข้อมูล</span>
                            <span class="meta-value" id="reportDateRange">-</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">วันที่ออกรายงาน</span>
                            <span class="meta-value" id="reportGenDate">-</span>
                        </div>
                    </div>

                    <!-- Section 1: Business Overview -->
                    <div class="section-header"><h2><i class="fa-solid fa-chart-pie"></i> ภาพรวมธุรกิจ (ยอดขายรวมทุกประเภทชำระ)</h2></div>
                    <div class="stats-grid">
                        <div class="stat-card"><div class="stat-value" id="statRevenue">-</div><div class="stat-label">ยอดขายรวม (บาท)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statAvgHead" style="color:var(--secondary-gradient)">-</div><div class="stat-label">ยอดต่อหัว (บาท/คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statNewSales" style="color:var(--primary-color)">-</div><div class="stat-label">ยอดขายลูกค้าใหม่ (บาท)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statOldSales">-</div><div class="stat-label">ยอดขายลูกค้าเก่ารวม (บาท)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statOldRepeatSales" style="color:var(--accent-color)">-</div><div class="stat-label">ยอดขายลูกค้าเก่ามาซ้ำ (บาท/คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statVisits">-</div><div class="stat-label">จำนวน Visit (ครั้ง)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statUniqueCust">-</div><div class="stat-label">ลูกค้าทั้งหมด (คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statNewReg" style="color:var(--primary-color)">-</div><div class="stat-label">ลูกค้าใหม่ (ลงทะเบียน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statOldCust">-</div><div class="stat-label">ลูกค้าเก่า (คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statNewPaying" style="color:var(--accent-color)">-</div><div class="stat-label">ลูกค้าใหม่จ่ายเงิน (คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statTotalPaying">-</div><div class="stat-label">ลูกค้าที่จ่ายเงิน (คน)</div></div>
                        <div class="stat-card"><div class="stat-value" id="statRepeatRate">-</div><div class="stat-label">อัตราลูกค้าเดิม (Repeat)</div></div>
                    </div>

                    <!-- Section 2: Customer Behavior Analysis -->
                    <div class="section-header"><h2><i class="fa-solid fa-users-viewfinder"></i> ประเภทลูกค้าและพฤติกรรมการซื้อ (เฉพาะชำระปกติ)</h2></div>
                    <div class="highlight-grid">
                        <div class="highlight-card" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%);">
                            <i class="fa-solid fa-wallet"></i>
                            <div class="h-label">ลูกค้าชำระเงินสุทธิ (ชำระปกติ)</div>
                            <div class="h-val" id="hlTotalPaying">-</div>
                            <div class="h-sub" id="hlTotalPayingRev">ยอดชำระปกติรวม: - บาท</div>
                        </div>
                        <div class="highlight-card" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                            <i class="fa-solid fa-layer-group"></i>
                            <div class="h-label">ลูกค้ากลุ่มซื้อแบบคอร์ส</div>
                            <div class="h-val" id="hlCourseCount">-</div>
                            <div class="h-sub" id="hlCourseRev">ยอดขายรวม: - บาท</div>
                        </div>
                        <div class="highlight-card" style="background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);">
                            <i class="fa-solid fa-basket-shopping"></i>
                            <div class="h-label">ลูกค้ากลุ่มซื้อครั้งเดียว</div>
                            <div class="h-val" id="hlSingleCount">-</div>
                            <div class="h-sub" id="hlSingleRev">ยอดขายรวม: - บาท</div>
                        </div>
                        <div class="highlight-card" style="background: linear-gradient(135deg, #be123c 0%, #e11d48 100%);">
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                            <div class="h-label">ลูกค้ามาชำระหนี้ (BL)</div>
                            <div class="h-val" id="hlDebtCount">-</div>
                            <div class="h-sub" id="hlDebtRev">ยอดชำระหนี้รวม: - บาท</div>
                        </div>
                    </div>

                    <h3 style="margin-bottom:15px;"><i class="fa-solid fa-tags"></i> แบ่งกลุ่มลูกค้าตามยอดชำระ</h3>
                    <div class="segment-grid" id="priceSegmentsContainer"></div>

                    <div class="section-header"><h2><i class="fa-solid fa-chart-area"></i> การวิเคราะห์เชิงลึก</h2></div>
                    <div class="charts-grid">
                        <div class="chart-box"><h4>📈 ยอดขายรายวัน (เทียบช่วงเวลา)</h4><canvas id="dailyChart"></canvas></div>
                        <div class="chart-box"><h4>📅 ยอดขายรายเดือน</h4><canvas id="monthlyChart"></canvas></div>
                        <div class="chart-box">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                                <h4 style="margin:0;">📊 Performance Matrix (Top 10 Items)</h4>
                                <span style="font-size: 0.65rem; color: #9ca3af;"><i class="fa-solid fa-circle-info"></i> ขนาดวงกลมตามรายได้รวม</span>
                            </div>
                            <canvas id="performanceMatrixChart"></canvas>
                        </div>
                        <div class="chart-box">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <h4 style="margin:0;">🔄 ความถี่การใช้บริการ (คลิกที่แท่งเพื่อดูรายชื่อ)</h4>
                                <button class="btn-sm" onclick="showFrequencySummary()"><i class="fa-solid fa-list-ol"></i> ตารางสรุป</button>
                            </div>
                            <canvas id="frequencyChart"></canvas>
                        </div>
                    </div>

                    <div class="section-header"><h2><i class="fa-solid fa-users-gear"></i> การวิเคราะห์ลูกค้าเชิงลึก (รายเดือน)</h2></div>
                    <div class="charts-grid">
                        <div class="chart-box" style="grid-column: span 2; height: 450px;">
                            <h4>📊 แนวโน้มลูกค้าใหม่ vs ลูกค้าเก่า (รายเดือน)</h4>
                            <canvas id="monthlyCustomerTrendChart"></canvas>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <div class="table-header"><h3>📅 ตารางเปรียบเทียบพฤติกรรมลูกค้า (รายเดือน)</h3></div>
                        <div class="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>เดือน/ปี</th>
                                        <th style="text-align:right">ยอดรวม (บาท)</th>
                                        <th style="text-align:right; color:#3b82f6;">ยอดลูกค้าเก่า</th>
                                        <th style="text-align:center">ลูกค้าทั้งหมด</th>
                                        <th style="text-align:center; color:#f59e0b;">ลูกค้าใหม่</th>
                                        <th style="text-align:center; color:#3b82f6;">ลูกค้าเก่า</th>
                                        <th style="text-align:center; color:#10b981;">จ่ายเงิน (คน)</th>
                                        <th style="text-align:center; color:#ec4899;">ตัดคอร์ส (คน)</th>
                                    </tr>
                                </thead>
                                <tbody id="monthlyAnalysisBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ===== RFM MODEL SECTION (ADDED) ===== -->
                    <div class="section-header"><h2><i class="fa-solid fa-circle-nodes"></i> RFM Model — การวิเคราะห์ความภักดีและกิจกรรมลูกค้า</h2></div>
                    <p style="color:#6b7280; margin-bottom:20px; font-size:0.9rem;"><i class="fa-solid fa-circle-info"></i> วิเคราะห์จากวันที่ขายล่าสุดในไฟล์ข้อมูล — <strong>คลิกที่การ์ด</strong>เพื่อดูรายชื่อลูกค้าในแต่ละกลุ่ม</p>
                    <div class="rfm-grid" id="rfmCardsContainer"></div>
                    <div class="rfm-donut-wrap">
                        <div class="rfm-chart-box"><canvas id="rfmDonutChart"></canvas></div>
                        <div class="rfm-chart-box"><canvas id="rfmRevenueChart"></canvas></div>
                    </div>
                    <!-- ===== END RFM SECTION ===== -->

                    <div class="section-header"><h2><i class="fa-solid fa-file-lines"></i> รายงานข้อมูลละเอียด</h2></div>
                    
                    <div class="table-wrapper">
                        <div class="table-header"><h3>📊 ยอดขายแยกตามหมวดหมู่ (คัดกรองละเอียด)</h3></div>
                        <div class="table-scroll">
                            <table id="categoryTable">
                                <thead>
                                    <tr id="categoryTableHead">
                                        <th>หมวดหมู่</th>
                                        <th>ตัวอย่างสินค้า (Items)</th>
                                        <th style="text-align:center">ลูกค้าทั้งหมด</th>
                                        <th style="text-align:center; color:#f59e0b;">ลูกค้าใหม่</th>
                                        <th style="text-align:center; color:#3b82f6;">ลูกค้าเก่า</th>
                                        <th style="text-align:center; color:#10b981;">จ่ายเงิน</th>
                                        <th style="text-align:center; color:#6366f1;">ตัดคอร์ส</th>
                                        <th style="text-align:right">ยอดรวม</th>
                                        <th style="text-align:center">Drilldown</th>
                                    </tr>
                                </thead>
                                <tbody id="categoryStatsBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <div class="table-header"><h3>🏆 10 อันดับบริการยอดฮิต</h3></div>
                        <div class="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="text-align:center">อันดับ</th>
                                        <th>รายการ</th>
                                        <th style="text-align:right">ยอดขาย (บาท)</th>
                                        <th style="text-align:center">จำนวนขาย</th>
                                        <th style="text-align:right">ราคาเฉลี่ย</th>
                                        <th style="text-align:center">ลูกค้าไม่ซ้ำ</th>
                                    </tr>
                                </thead>
                                <tbody id="performanceMatrixBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <div class="table-header">
                            <h3>👥 รายละเอียดลูกค้าทั้งหมด (Filter by Segment)</h3>
                            <select id="segmentFilter" onchange="renderDetailsTable()" style="padding:5px 10px; border-radius:5px; border:1px solid #ddd;">
                                <option value="all">แสดงทั้งหมด</option>
                            </select>
                        </div>
                        <div class="table-scroll">
                            <table>
                                <thead><tr><th>HN</th><th>ชื่อ-สกุล / เบอร์โทร</th><th>กลุ่มราคา</th><th style="text-align:right">ยอดรวม (บาท)</th><th>ล่าสุด</th></tr></thead>
                                <tbody id="detailsTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div id="aiModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3><i class="fa-solid fa-wand-magic-sparkles"></i> AI Strategic Prompt (Detailed Summary)</h3><span class="close-btn" onclick="closeModal('aiModal')">&times;</span></div>
            <div class="modal-body">
                <p style="margin-bottom:10px; font-size:14px; color:#555;">คัดลอกข้อมูลสรุปด้านล่าง นำไปวางในแชทบอท (Gemini/ChatGPT) เพื่อวิเคราะห์กลยุทธ์</p>
                <textarea id="aiText" readonly></textarea>
            </div>
            <div class="modal-footer"><button class="btn-primary" onclick="copyToClipboard()"><i class="fa-regular fa-copy"></i> คัดลอกข้อมูลทั้งหมด</button></div>
        </div>
    </div>
    
    <div id="listModal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3 id="listModalTitle"></h3><span class="close-btn" onclick="closeModal('listModal')">&times;</span></div>
            <div class="modal-body" id="listModalBody"></div>
        </div>
    </div>

    <div id="custModal" class="modal">
        <div class="modal-content" style="max-width:800px;">
            <div class="modal-header"><h3 id="custModalTitle"></h3><span class="close-btn" onclick="closeModal('custModal')">&times;</span></div>
            <div class="modal-body" id="custModalBody"></div>
        </div>
    </div>

    <div id="freqModal" class="modal"><div class="modal-content" style="max-width:500px;"><div class="modal-header"><h3>สรุปความถี่การใช้บริการ</h3><span class="close-btn" onclick="closeModal('freqModal')">&times;</span></div><div class="modal-body" id="freqModalBody"></div></div></div>

    <script>
        // --- Core Configuration ---
        Chart.defaults.font.family = "'Prompt', sans-serif";
        let rawData = [], filteredData = [], compareData = [], processedCustomers = [], compareCustomers = [];
        let uploadedFileName = ""; 
        let charts = {};
        
        const PRICE_RANGES = [
            { id: 'r0', label: '0 - 2k', limit: 2000, color: '#94a3b8' },
            { id: 'r1', label: '2k - 5k', limit: 5000, color: '#64748b' },
            { id: 'r2', label: '5k - 10k', limit: 10000, color: '#3b82f6' },
            { id: 'r3', label: '10k - 20k', limit: 20000, color: '#10b981' },
            { id: 'r4', label: '20k - 50k', limit: 50000, color: '#f59e0b' },
            { id: 'r5', label: '50k - 100k', limit: 100000, color: '#ea580c' },
            { id: 'r6', label: '100k UP', limit: Infinity, color: '#be123c' }
        ];

        document.getElementById('fileInput').addEventListener('change', handleFileUpload);
        document.getElementById('compareToggle').addEventListener('change', function() {
            document.getElementById('compareRange').style.display = this.checked ? 'flex' : 'none';
        });

        function parseThaiDate(s) { 
            if(!s) return null; 
            if (s instanceof Date) return s; 
            const str = s.toString().trim(); 
            const p = str.split(/[\/\-]/); 
            if(p.length !== 3) return null; 
            let d = parseInt(p[0]);
            let m = parseInt(p[1]) - 1;
            let y = parseInt(p[2]); 
            if(y > 2500) y -= 543; 
            return new Date(y, m, d, 12, 0, 0); 
        }

        function formatThaiDateLong(date) {
            if (!date) return '-';
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear() + 543;
            return `${d}/${m}/${y}`;
        }

        function getControlDate(id) {
            const val = document.getElementById(id).value;
            if(!val) return null;
            const p = val.split('-');
            return new Date(parseInt(p[0]), parseInt(p[1])-1, parseInt(p[2]), 12, 0, 0);
        }

        function handleFileUpload(e) {
            const file = e.target.files[0];
            if(!file) return;
            uploadedFileName = file.name;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const workbook = XLSX.read(new Uint8Array(evt.target.result), { type: 'array' });
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: false });
                rawData = json.map(row => {
                    let amt = row['ยอดชำระ'] ? (typeof row['ยอดชำระ'] === 'number' ? row['ยอดชำระ'] : parseFloat(row['ยอดชำระ'].toString().replace(/[,\s]/g, '')) || 0) : 0;
                    let regDate = row['วันลงทะเบียน'] || row['Register Date'] || row['RegDate'];
                    return { 
                        ...row, 
                        'ยอดชำระ': amt, 
                        '__date': parseThaiDate(row['วันที่ขาย']), 
                        '__regDate': parseThaiDate(regDate),
                        '__paymentType': row['ประเภทชำระ'] || row['PaymentType'] || row['ประเภทการชำระ'] || ''
                    };
                }).filter(r => r.__date);

                if (rawData.length > 0) {
                    const dates = rawData.map(r => r.__date).filter(d => d);
                    if (dates.length > 0) {
                        const minDate = dates.reduce((a, b) => (a < b ? a : b));
                        const maxDate = dates.reduce((a, b) => (a > b ? a : b));
                        
                        document.getElementById('startDate').value = minDate.toISOString().split('T')[0];
                        document.getElementById('endDate').value = maxDate.toISOString().split('T')[0];
                    }
                }
                ['startDate', 'endDate', 'compareToggle', 'filterBtn', 'aiBtn', 'exportPdfBtn'].forEach(id => document.getElementById(id).disabled = false);
                document.getElementById('initialState').style.display = 'none';
                document.getElementById('dashboardDataView').style.display = 'block';
                applyFilters();
            };
            reader.readAsArrayBuffer(file);
        }

        function applyFilters() {
            const start = getControlDate('startDate');
            const end = getControlDate('endDate');
            if(!start || !end) return;
            const startLimit = new Date(start); startLimit.setHours(0,0,0,0);
            const endLimit = new Date(end); endLimit.setHours(23,59,59,999);
            filteredData = rawData.filter(r => r.__date >= startLimit && r.__date <= endLimit);

            compareData = [];
            compareCustomers = [];
            if(document.getElementById('compareToggle').checked) {
                const cStart = getControlDate('compareStartDate');
                const cEnd = getControlDate('compareEndDate');
                if(cStart && cEnd) {
                    const cStartLimit = new Date(cStart); cStartLimit.setHours(0,0,0,0);
                    const cEndLimit = new Date(cEnd); cEndLimit.setHours(23,59,59,999);
                    compareData = rawData.filter(r => r.__date >= cStartLimit && r.__date <= cEndLimit);
                }
            }
            updateDashboard();
        }

        function updateDashboard() {
            processCustomerData();
            renderStats();
            renderSegments(); 
            renderCharts();
            updateCategoryStatsTable();
            updatePerformanceMatrix();
            renderDetailsTable();
            populateSegmentFilter();
            renderMonthlyDetailedAnalysis();
            renderRFMSection();

            document.getElementById('reportFileName').textContent = uploadedFileName || '-';
            const sDate = getControlDate('startDate');
            const eDate = getControlDate('endDate');
            document.getElementById('reportDateRange').textContent = `${formatThaiDateLong(sDate)} ถึง ${formatThaiDateLong(eDate)}`;
            document.getElementById('reportGenDate').textContent = new Date().toLocaleString('th-TH');
        }

        function processCustomerData() {
            const start = getControlDate('startDate');
            const end = getControlDate('endDate');
            const startLimit = start ? new Date(start).setHours(0,0,0,0) : 0;
            const endLimit = end ? new Date(end).setHours(23,59,59,999) : Infinity;

            const hnMap = {};
            filteredData.forEach(r => {
                if(!r.HN) return;
                const hn = r.HN.toString();
                if(!hnMap[hn]) {
                    hnMap[hn] = { 
                        hn: hn, 
                        name: r['ชื่อ-สกุล'] || '-', 
                        phone: r['เบอร์โทร'] || r['โทรศัพท์'] || '-', 
                        total: 0, 
                        totalRegular: 0, 
                        totalDebt: 0, 
                        visits: new Set(), 
                        items: new Set(), 
                        lastDate: r.__date, 
                        isNew: (r.__regDate && r.__regDate >= startLimit && r.__regDate <= endLimit),
                        isCourse: false,
                        categoryReason: ""
                    };
                }
                const amt = r['ยอดชำระ'] || 0;
                hnMap[hn].total += amt;
                
                if (r.__paymentType === 'ชำระปกติ') {
                    const itemName = (r['รายการ'] || '').toString().toLowerCase();
                    const quantity = parseFloat(r['จำนวน'] || 0);
                    const hasKeywords = itemName.includes('คอร์ส') || itemName.includes('course') || itemName.includes('package') || itemName.includes('pkg');
                    const isBotoxOrUnit = itemName.includes('botox') || itemName.includes('1u');
                    const hasHighQty = isBotoxOrUnit ? false : quantity > 1;
                    const isCutCourse = itemName.includes('[ตัดคอร์ส]');

                    if (!isCutCourse) {
                        hnMap[hn].totalRegular += amt;
                        if (hasKeywords || hasHighQty) {
                            if (!hnMap[hn].isCourse) {
                                hnMap[hn].isCourse = true;
                                hnMap[hn].categoryReason = hasKeywords ? "พบชื่อรายการ 'คอร์ส/Package'" : "พบรายการ 'จำนวน > 1'";
                            }
                        }
                    }
                } else if (r.__paymentType === 'ชำระหนี้') {
                    hnMap[hn].totalDebt += amt;
                }
                
                hnMap[hn].visits.add(r['วันที่ขาย']);
                if(r['รายการ']) hnMap[hn].items.add(r['รายการ']);
                if(r.__date > hnMap[hn].lastDate) hnMap[hn].lastDate = r.__date;
            });

            processedCustomers = Object.values(hnMap).map(c => {
                if (!c.isCourse) {
                    c.categoryReason = c.visits.size >= 2 
                        ? `ซื้อรายครั้งหลายรายการ (${c.visits.size} ครั้ง)` 
                        : "ชำระ 1 ครั้ง (สินค้าทั่วไป)";
                }
                const range = PRICE_RANGES.find(r => c.total <= r.limit) || PRICE_RANGES[PRICE_RANGES.length - 1];
                return { ...c, segmentLabel: range.label, segmentColor: range.color };
            }).sort((a,b) => b.total - a.total);

            // Process compare data if exists
            if(compareData.length > 0) {
                const cStart = getControlDate('compareStartDate');
                const cEnd = getControlDate('compareEndDate');
                const cStartLimit = cStart ? new Date(cStart).setHours(0,0,0,0) : 0;
                const cEndLimit = cEnd ? new Date(cEnd).setHours(23,59,59,999) : Infinity;

                const compareHnMap = {};
                compareData.forEach(r => {
                    if(!r.HN) return;
                    const hn = r.HN.toString();
                    if(!compareHnMap[hn]) {
                        compareHnMap[hn] = { 
                            hn: hn, 
                            total: 0, 
                            totalRegular: 0, 
                            totalDebt: 0, 
                            visits: new Set(),
                            isNew: (r.__regDate && r.__regDate >= cStartLimit && r.__regDate <= cEndLimit),
                            isCourse: false
                        };
                    }
                    const amt = r['ยอดชำระ'] || 0;
                    compareHnMap[hn].total += amt;
                    
                    if (r.__paymentType === 'ชำระปกติ') {
                        const iN = (r['รายการ'] || '').toString().toLowerCase();
                        const q = parseFloat(r['จำนวน'] || 0);
                        const isCutCourse = iN.includes('[ตัดคอร์ส]');
                        if(!isCutCourse) {
                            compareHnMap[hn].totalRegular += amt;
                            const hasKeywords = iN.includes('คอร์ส') || iN.includes('course') || iN.includes('package') || iN.includes('pkg');
                            const isBotoxOrUnit = iN.includes('botox') || iN.includes('1u');
                            if (hasKeywords || (isBotoxOrUnit ? false : q > 1)) {
                                compareHnMap[hn].isCourse = true;
                            }
                        }
                    } else if (r.__paymentType === 'ชำระหนี้') {
                        compareHnMap[hn].totalDebt += amt;
                    }
                    
                    compareHnMap[hn].visits.add(r['วันที่ขาย']);
                });

                compareCustomers = Object.values(compareHnMap);
            }
        }

        function calculateMetrics(dataset, customers) {
            const rev = dataset.reduce((s,r) => s + r['ยอดชำระ'], 0);
            const visits = new Set(dataset.map(r => r.HN + r['วันที่ขาย'])).size;
            const unique = customers.length;
            const regularDataset = dataset.filter(r => r.__paymentType === 'ชำระปกติ' && !(r['รายการ'] || '').includes('[ตัดคอร์ส]'));
            const regularRev = regularDataset.reduce((s,r) => s + r['ยอดชำระ'], 0);
            const debtRev = dataset.filter(r => r.__paymentType === 'ชำระหนี้').reduce((s,r) => s + r['ยอดชำระ'], 0);
            
            const payingCustomers = customers.filter(c => (c.totalRegular + c.totalDebt) > 0);
            const regularPayingCustomers = customers.filter(c => c.totalRegular > 0);
            const debtOnlyPayingCustomers = customers.filter(c => c.totalDebt > 0);
            const courseCusts = customers.filter(c => c.isCourse && c.totalRegular > 0);
            const singleCusts = customers.filter(c => !c.isCourse && c.totalRegular > 0);
            const courseSales = courseCusts.reduce((s,c) => s + c.totalRegular, 0);
            const singleSales = singleCusts.reduce((s,c) => s + c.totalRegular, 0);
            const newReg = customers.filter(c => c.isNew);
            const newSales = newReg.reduce((s,c) => s + c.total, 0); 
            const repeatCusts = customers.filter(c => c.visits.size > 1);
            const oldRepeatCusts = customers.filter(c => !c.isNew && c.visits.size > 1);
            const oldRepeatSales = oldRepeatCusts.reduce((s,c) => s + c.total, 0);
            
            return {
                rev, visits, unique, payingCount: payingCustomers.length,
                newSales, oldSales: rev - newSales, 
                oldRepeatSales, 
                oldRepeatCount: oldRepeatCusts.length,
                newReg: newReg.length,
                oldCust: unique - newReg.length,
                newPaying: newReg.filter(c => (c.totalRegular + c.totalDebt) > 0).length,
                totalPaying: payingCustomers.length,
                regularPayingCount: regularPayingCustomers.length,
                repeatRate: unique ? (repeatCusts.length / unique) * 100 : 0,
                avgHead: payingCustomers.length ? rev / payingCustomers.length : 0,
                regularRev,
                debtRev, 
                debtCount: debtOnlyPayingCustomers.length, 
                courseCount: courseCusts.length,
                courseSales: courseSales,
                singleCount: singleCusts.length,
                singleSales: singleSales
            };
        }

        function renderStats() {
            const cur = calculateMetrics(filteredData, processedCustomers);
            
            let prev = null;
            if(document.getElementById('compareToggle').checked && compareData.length > 0 && compareCustomers.length > 0) {
                prev = calculateMetrics(compareData, compareCustomers);
            }

            const format = (id, val, pVal, isMoney = true, isPct = false, extraText = "") => {
                const el = document.getElementById(id);
                if(!el) return;
                let txt = val.toLocaleString(undefined, {minimumFractionDigits: isMoney?2:0, maximumFractionDigits: isMoney?2:1});
                if(isPct) txt += '%';
                if(extraText) txt += ` ${extraText}`;
                let badge = '';
                if(pVal !== null && pVal !== undefined) {
                    const diff = val - pVal;
                    const pct = pVal === 0 ? (val > 0 ? 100 : 0) : (diff / pVal) * 100;
                    const diffTxt = (diff >= 0 ? '+' : '') + diff.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    badge = `<span class="badge ${diff>0?'pos':'neg'}" title="ต่างกัน ${diffTxt}"><i class="fa-solid ${diff>0?'fa-caret-up':'fa-caret-down'}"></i> ${diffTxt} (${Math.abs(pct).toFixed(1)}%)</span>`;
                }
                el.innerHTML = `<div>${txt}</div>${badge}`;
            };

            format('statRevenue', cur.rev, prev?.rev); 
            format('statAvgHead', cur.avgHead, prev?.avgHead);
            format('statNewSales', cur.newSales, prev?.newSales);
            format('statOldSales', cur.oldSales, prev?.oldSales);
            format('statOldRepeatSales', cur.oldRepeatSales, prev?.oldRepeatSales, true, false, `(${cur.oldRepeatCount.toLocaleString()} คน)`); 
            format('statVisits', cur.visits, prev?.visits, false);
            format('statUniqueCust', cur.unique, prev?.unique, false);
            format('statNewReg', cur.newReg, prev?.newReg, false);
            format('statOldCust', cur.oldCust, prev?.oldCust, false);
            format('statNewPaying', cur.newPaying, prev?.newPaying, false);
            format('statTotalPaying', cur.totalPaying, prev?.totalPaying, false);
            format('statRepeatRate', cur.repeatRate, prev?.repeatRate, false, true);

            format('hlTotalPaying', cur.regularPayingCount, prev?.regularPayingCount, false, false, "คน");
            format('hlTotalPayingRev', cur.regularRev, prev?.regularRev, true, false, "บาท");
            format('hlCourseCount', cur.courseCount, prev?.courseCount, false, false, "คน");
            format('hlCourseRev', cur.courseSales, prev?.courseSales, true, false, "บาท");
            format('hlSingleCount', cur.singleCount, prev?.singleCount, false, false, "คน");
            format('hlSingleRev', cur.singleSales, prev?.singleSales, true, false, "บาท");
            format('hlDebtCount', cur.debtCount, prev?.debtCount, false, false, "คน");
            format('hlDebtRev', cur.debtRev, prev?.debtRev, true, false, "บาท");
        }

        function renderSegments() {
            const container = document.getElementById('priceSegmentsContainer');
            if(!container) return;
            container.innerHTML = PRICE_RANGES.map(range => {
                const members = processedCustomers.filter(c => c.segmentLabel === range.label);
                const sum = members.reduce((s, c) => s + c.total, 0);
                return `<div class="segment-card" style="border-left-color: ${range.color};" onclick="filterBySegment('${range.label}')">
                    <div class="seg-label"><span>${range.label}</span><span>${((members.length / (processedCustomers.length || 1)) * 100).toFixed(1)}%</span></div>
                    <div class="seg-val">${members.length.toLocaleString()} คน</div>
                    <div style="font-size:0.75rem; color:#999">ยอดรวม: ${sum.toLocaleString()} บ.</div>
                </div>`;
            }).join('');
        }

        function getCategoryForRow(row) {
            let name = (row['รายการ'] || '').toString().toLowerCase().trim();
            if (!name) return 'อื่นๆ / ไม่ระบุรายการ';
            
            if (name.includes('วงเงิน-vip') || name.includes('เปิดบัตร flora vvip card') || name.includes('เปิดบัตร flora card')) return 'Floracard';

            // ===== ร้อยไหม (Thread Lift) =====
            if (name.includes('ร้อยไหม') || name.includes('thread lift') || name.includes('threadlift') ||
                name.includes('mono thread') || name.includes('cog thread') || name.includes('pdo thread') ||
                name.includes('pcl thread') || name.includes('plla thread') || name.includes('silhouette') ||
                name.includes('เส้นไหม') || name.includes('ไหมร้อย') ||
                name.includes('ไหมล็อค') || name.includes('ไหม lock') || name.includes('ไหม log') ||
                (name.includes('thread') && !name.includes('instagram') && !name.includes('twitter'))) return 'ร้อยไหม';
            // ===== END ร้อยไหม =====

            // ===== VITARAN =====
            if (name.includes('vitaran')) return 'VITARAN';
            // ===== END VITARAN =====

            if (name.includes('mounjaro')) return 'Mounjaro';
            if (name.includes('e-jal') || name.includes('ejal')) return 'E-Jal';
            if (name.includes('ultra for mer') || name.includes('ultraformer') || name.includes('ultra fromer') || name.includes('ultra former')) return 'Ultrafomer';
            if (name.includes('aesthefill') || name.includes('aesthe fill')) return 'Aesthe Fill'; 
            if (name.includes('profhilo')) return 'Profhilo';
            if (name.includes('sculptra')) return 'Sculptra';
            if (name.includes('rejuran')) return 'Rejuran';
            if (name.includes('juvelook')) return 'Juvelook';
            if (name.includes('exosome')) return 'Exosome';
            if (name.includes('morpheus')) return 'Morpheus8'; 
            if (name.includes('chanel') || name.includes("l'ebss") || name.includes('inno') || 
                name.includes('sakura') || name.includes('meso') || name.includes('made') || 
                name.includes('ฉีดหน้า') || name.includes('prp') || name.includes('guna collagen') || 
                name.includes('derma care') || name.includes('dermacare') || name.includes('neuraderm') ||
                name.includes('reborn glass skin') || name.includes('seenskin') || name.includes('seen skin') ||
                name.includes('ssdn') || name.includes('สะกิด')) return 'Meso / Skin Booster';
            if (name.includes('ค่าเข้ารับการปรึกษาแพทย์')) return 'ค่าเข้ารับการปรึกษาแพทย์';
            if (name.includes('melasma') || name.includes('ฉีดฝ้า')) return 'Melasma';
            if (name.includes('q switch') || name.includes('q-switch')) return 'Q Switch';
            if (name.includes('bsam')) return 'BSAM';
            if (name.includes('keloid')) return 'Keloid';
            if (name.includes('nad')) return 'NAD'; 
            if (name.includes('ปากกาลดน้ำหนัก') || name.includes('weight loss pen') || name.includes('saxenda')) return 'ปากกาลดน้ำหนัก'; 
            if (name.includes('peelling') || name.includes('peeling')) return 'Peelling'; 
            if (name.includes('subsicion') || name.includes('subcision')) return 'Subsicion';
            if (name.includes('antidark')) return 'Antidark';
            if (name.includes('helios')) return 'Helios';
            if (name.includes('vella') || name.includes('vela')) return 'Vela';
            if (name.includes('viva')) return 'Viva';
            if (name.includes('virgin repair') || name.includes('vergin repair') || name.includes('เก้าอี้มหัศจรรย์')) return 'Virgin Repair';
            if (name.includes('body s')) return 'Body S';
            if (name.includes('g5')) return 'G5';
            if (name.includes('transamin') || name.includes('whitening program')) return 'Transamin / Whitening';
            if (name.includes('rf')) return 'RF';
            if (name.includes('gc 50000') || name.includes('vitc') || name.includes('push vit c')) return 'Push (Vit C)';
            if (name.includes('ฉีดเปปไทด์')) return 'Peptide';
            if (name.includes('evo')) return 'EVO';
            if (name.includes('cpl')) return 'CPL';
            if (name.includes('วงเงินเหลือ') || name.includes('บัตร bornsong card 35,000')) return 'วงเงินเหลือ';
            if (name.includes('liporase')) return 'Liporase';
            if (name.includes('pms')) return 'PMS';
            
            if (name.includes('drip') || name.includes('diamond') || name.includes('daimond') || name.includes('celeb') || name.includes('detox') || name.includes('vitamin') || name.includes('วิตามิน') || name.includes('healthy bright') || name.includes('vit-c') || name.includes('glow vital white') || name.includes('bornie secret white') || name.includes('extra white plus') || name.includes('onny white') || name.includes('oppα white') || name.includes('glow super glow') || name.includes('aura')) return 'Drip Vitamin';
            if ((name.includes('ศัลยกรรม') || name.includes('เสริมจมูก') || name.includes('ตา') || name.includes('คาง')) && !name.includes('โทรตาม') && !name.includes('botox')) return 'Surgery';
            if (name.includes('co2')) return 'Co2 Laser';
            if (name.includes('slimnow') || name.includes('peptide') || name.includes('คุมหิว')) return 'Slimnow';
            if (name.includes('dio') || name.includes('ipl')) return 'Diode / IPL';
            if (name.includes('botox') || name.includes('โบ')) return 'Botox';
            if (name.includes('filler') || name.includes('ฟิลเลอร์')) return 'Filler';
            if (name.includes('hifu') || name.includes('ulthera') || name.includes('lifting')) return 'HIFU / Lifting';
            if (name.includes('laser') || name.includes('pico') || name.includes('เลเซอร์')) return 'Picolaser';
            if (name.includes('hair') || name.includes('กำจัดขน')) return 'Hair Removal';
            if (name.includes('fat') || name.includes('สลายไขมัน') || name.includes('bromi')) return 'Body / Fat';
            if (name.includes('acne') || name.includes('สิว')) return 'Acne Treatment';
            if (name.includes('ยา') || name.includes('medicine') || name.includes('drug') || name.includes('pharmacy') || name.includes('เวชภัณฑ์')) return 'Pharmacy / Medicine';
            if (name.includes('treatment') || name.includes('ทรีทเมนท์') || name.includes('นวด') || name.includes('spa') || name.includes('mark collagen') || name.includes('cryo')) return 'Treatment';
            if (name.includes('ค่าแพทย์') || name.includes('df') || name.includes('doctor') || name.includes('consult') || name.includes('บริการ') || name.includes('service')) return 'Consultation / Service';
            if (name.includes('product') || name.includes('cream') || name.includes('gel') || name.includes('foam') || name.includes('sunscreen') || name.includes('set')) return 'Products / Skincare';
            
            return 'อื่นๆ / รายการย่อย';
        }

        function updateCategoryStatsTable() {
            const start = getControlDate('startDate');
            const end = getControlDate('endDate');
            const startLimit = start ? new Date(start).setHours(0,0,0,0) : 0;
            const endLimit = end ? new Date(end).setHours(23,59,59,999) : Infinity;

            const getCatData = (data) => data.reduce((acc, r) => {
                const c = getCategoryForRow(r);
                if(!acc[c]) acc[c] = { rev:0, items: new Set(), customers: {}, newCusts: new Set(), oldCusts: new Set() };
                acc[c].rev += r['ยอดชำระ'];
                if(r['รายการ']) acc[c].items.add(r['รายการ']);
                if(r.HN) {
                    const hn = r.HN.toString();
                    if(!acc[c].customers[hn]) acc[c].customers[hn] = 0;
                    acc[c].customers[hn] += r['ยอดชำระ'];
                    const isNew = r.__regDate && r.__regDate >= startLimit && r.__regDate <= endLimit;
                    if (isNew) acc[c].newCusts.add(hn); else acc[c].oldCusts.add(hn);
                }
                return acc;
            }, {});

            const curData = getCatData(filteredData);
            const sortedKeys = Object.keys(curData).sort((a,b) => curData[b].rev - curData[a].rev);
            document.getElementById('categoryStatsBody').innerHTML = sortedKeys.map(k => {
                const c = curData[k];
                const allHNs = Object.keys(c.customers);
                const payingCount = allHNs.filter(h => c.customers[h] > 0).length;
                return `<tr><td style="font-weight:700">${k}</td><td style="color:#666; font-size:0.7rem;">${Array.from(c.items).slice(0,2).join(', ')}..</td><td style="text-align:center; font-weight:600;">${allHNs.length}</td><td style="text-align:center; color:#f59e0b;">${c.newCusts.size}</td><td style="text-align:center; color:#3b82f6;">${c.oldCusts.size}</td><td style="text-align:center; color:#10b981;">${payingCount}</td><td style="text-align:center; color:#6366f1;">${allHNs.length - payingCount}</td><td style="text-align:right; font-weight:700">${c.rev.toLocaleString()}</td><td style="text-align:center"><button class="btn-sm" onclick="showCategoryCustomers('${k}')">ดูรายชื่อ</button></td></tr>`;
            }).join('');
        }

        function renderCharts() {
            Object.values(charts).forEach(c => { if(c && typeof c.destroy === 'function') c.destroy(); });
            
            const getDaily = (data) => data.reduce((acc, r) => { const d = r['วันที่ขาย']; acc[d] = (acc[d]||0) + r['ยอดชำระ']; return acc; }, {});
            const curDaily = getDaily(filteredData);
            const sortedDates = Object.keys(curDaily).sort((a,b) => parseThaiDate(a) - parseThaiDate(b));
            
            const datasets = [{ label: 'ปัจจุบัน', data: sortedDates.map(d => curDaily[d]), borderColor: '#6366f1', fill: true, tension: 0.3 }];
            
            if(compareData.length > 0) {
                const compareDaily = getDaily(compareData);
                const compareDates = Object.keys(compareDaily).sort((a,b) => parseThaiDate(a) - parseThaiDate(b));
                datasets.push({ label: 'เปรียบเทียบ', data: compareDates.map(d => compareDaily[d]), borderColor: '#ec4899', fill: false, tension: 0.3 });
            }
            
            charts.daily = new Chart(document.getElementById('dailyChart'), { 
                type: 'line', 
                data: { labels: sortedDates, datasets }, 
                options: { responsive: true, maintainAspectRatio: false } 
            });
            
            const monthly = filteredData.reduce((acc, r) => { const key = `${r.__date.getFullYear()}-${String(r.__date.getMonth()+1).padStart(2,'0')}`; acc[key] = (acc[key]||0) + r['ยอดชำระ']; return acc; }, {});
            charts.monthly = new Chart(document.getElementById('monthlyChart'), { type: 'bar', data: { labels: Object.keys(monthly).sort(), datasets: [{ label: 'ยอดขายรายเดือน', data: Object.keys(monthly).sort().map(m => monthly[m]), backgroundColor: '#3b82f6' }] }, options: { responsive: true, maintainAspectRatio: false } });
            
            const itemStats = filteredData.reduce((acc, r) => { if(r['ยอดชำระ'] > 0 && r['รายการ']) { if(!acc[r['รายการ']]) acc[r['รายการ']] = { rev:0, qty:0 }; acc[r['รายการ']].rev += r['ยอดชำระ']; acc[r['รายการ']].qty++; } return acc; }, {});
            const sortedPerformance = Object.entries(itemStats).sort((a,b) => b[1].rev - a[1].rev).slice(0, 10);
            const avgQty = sortedPerformance.reduce((s, x) => s + x[1].qty, 0) / (sortedPerformance.length || 1);
            const avgPrice = sortedPerformance.reduce((s, x) => s + (x[1].rev / x[1].qty), 0) / (sortedPerformance.length || 1);
            charts.perf = new Chart(document.getElementById('performanceMatrixChart'), { type: 'bubble', data: { datasets: [{ label: 'Top 10 Items', data: sortedPerformance.map(([k, v]) => ({ x: v.qty, y: v.rev / v.qty, r: Math.min(25, Math.sqrt(v.rev) / 25 + 5), label: k, totalRev: v.rev })), backgroundColor: (ctx) => { const v = ctx.raw; if(!v) return 'rgba(99, 102, 241, 0.5)'; if (v.x >= avgQty && v.y >= avgPrice) return 'rgba(16, 185, 129, 0.6)'; if (v.x >= avgQty && v.y < avgPrice) return 'rgba(59, 130, 246, 0.6)'; if (v.x < avgQty && v.y >= avgPrice) return 'rgba(245, 158, 11, 0.6)'; return 'rgba(236, 72, 153, 0.6)'; } }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => { const p = ctx.raw; return [`รายการ: ${p.label}`, `ยอดรวม: ฿${p.totalRev.toLocaleString()}`, `จำนวน: ${p.x} ครั้ง`, `เฉลี่ย: ฿${Math.round(p.y).toLocaleString()}`]; } } } }, scales: { x: { title: { display: true, text: 'จำนวนครั้งที่ขาย (Volume)' } }, y: { title: { display: true, text: 'ราคาเฉลี่ยต่อหน่วย (Avg Price)' } } } } });
            
            const freqMap = processedCustomers.reduce((acc, c) => { acc[c.visits.size] = (acc[c.visits.size]||0) + 1; return acc; }, {});
            charts.freq = new Chart(document.getElementById('frequencyChart'), { type: 'bar', data: { labels: Object.keys(freqMap).sort((a,b)=>a-b).map(l => l + ' ครั้ง'), datasets: [{ label: 'จำนวนคน', data: Object.keys(freqMap).sort((a,b)=>a-b).map(l => freqMap[l]), backgroundColor: '#8b5cf6' }] }, options: { responsive: true, maintainAspectRatio: false, onClick: (e, els) => { if(els.length > 0) showFrequencyCustomers(parseInt(Object.keys(freqMap).sort((a,b)=>a-b)[els[0].index])); } } });
        }

        function renderMonthlyDetailedAnalysis() {
            const monthlyStats = rawData.reduce((acc, r) => {
                const monthKey = `${r.__date.getFullYear()}-${String(r.__date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[monthKey]) acc[monthKey] = { revenue: 0, oldRevenue: 0, allHNs: new Set(), newHNs: new Set(), oldHNs: new Set(), payingHNs: new Set(), courseCutHNs: new Set() };
                const m = acc[monthKey];
                m.revenue += r['ยอดชำระ'];
                if (r.HN) {
                    m.allHNs.add(r.HN);
                    if (r['ยอดชำระ'] > 0) m.payingHNs.add(r.HN); else m.courseCutHNs.add(r.HN);
                    const regMonth = r.__regDate ? `${r.__regDate.getFullYear()}-${String(r.__regDate.getMonth() + 1).padStart(2, '0')}` : null;
                    if (regMonth === monthKey) m.newHNs.add(r.HN);
                    else { m.oldHNs.add(r.HN); m.oldRevenue += r['ยอดชำระ']; }
                }
                return acc;
            }, {});
            const sortedMonths = Object.keys(monthlyStats).sort();
            document.getElementById('monthlyAnalysisBody').innerHTML = sortedMonths.slice().reverse().map(mKey => {
                const m = monthlyStats[mKey];
                return `<tr><td>${mKey}</td><td style="text-align:right">${m.revenue.toLocaleString()}</td><td style="text-align:right">${m.oldRevenue.toLocaleString()}</td><td style="text-align:center">${m.allHNs.size}</td><td style="text-align:center">${m.newHNs.size}</td><td style="text-align:center">${m.oldHNs.size}</td><td style="text-align:center">${m.payingHNs.size}</td><td style="text-align:center">${m.courseCutHNs.size}</td></tr>`;
            }).join('');
            if(charts.monthlyCustTrend) charts.monthlyCustTrend.destroy();
            charts.monthlyCustTrend = new Chart(document.getElementById('monthlyCustomerTrendChart'), { type: 'line', data: { labels: sortedMonths, datasets: [{ label: 'ลูกค้าใหม่', data: sortedMonths.map(m => monthlyStats[m].newHNs.size), borderColor: '#f59e0b', fill: false }, { label: 'ลูกค้าเก่า', data: sortedMonths.map(m => monthlyStats[m].oldHNs.size), borderColor: '#3b82f6', fill: false }, { label: 'จ่ายเงิน', data: sortedMonths.map(m => monthlyStats[m].payingHNs.size), borderColor: '#10b981', fill: false }] }, options: { responsive: true, maintainAspectRatio: false } });
        }

        /* ====== RFM MODEL ====== */
        function renderRFMSection() {
            if (!processedCustomers || processedCustomers.length === 0) return;

            const allDates = rawData.map(r => r.__date).filter(Boolean);
            if (allDates.length === 0) return;
            const refDate = allDates.reduce((a, b) => (a > b ? a : b));

            const rfmGroups = { active: [], fading: [], lost: [] };

            processedCustomers.forEach(c => {
                if (!c.lastDate) return;
                const diffMs = refDate - c.lastDate;
                const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
                if (diffMonths <= 6)       rfmGroups.active.push(c);
                else if (diffMonths <= 12) rfmGroups.fading.push(c);
                else                       rfmGroups.lost.push(c);
            });

            const total = processedCustomers.length || 1;
            const revActive = rfmGroups.active.reduce((s, c) => s + c.total, 0);
            const revFading = rfmGroups.fading.reduce((s, c) => s + c.total, 0);
            const revLost   = rfmGroups.lost.reduce((s, c) => s + c.total, 0);

            const cardsCfg = [
                {
                    key: 'active', cls: 'rfm-active', icon: '🟢',
                    title: 'ลูกค้า Active (ภายใน 6 เดือน)',
                    count: rfmGroups.active.length,
                    rev: revActive
                },
                {
                    key: 'fading', cls: 'rfm-fading', icon: '🟡',
                    title: 'กำลังหายไป (6–12 เดือน)',
                    count: rfmGroups.fading.length,
                    rev: revFading
                },
                {
                    key: 'lost', cls: 'rfm-lost', icon: '🔴',
                    title: 'ลูกค้าหายไปแล้ว (> 12 เดือน)',
                    count: rfmGroups.lost.length,
                    rev: revLost
                }
            ];

            document.getElementById('rfmCardsContainer').innerHTML = cardsCfg.map(cfg => {
                const pct = ((cfg.count / total) * 100).toFixed(1);
                const avg = cfg.count ? Math.round(cfg.rev / cfg.count).toLocaleString() : '0';
                return `<div class="rfm-card ${cfg.cls}" onclick="showRFMModal('${cfg.key}')">
                    <span class="rfm-icon">${cfg.icon}</span>
                    <div class="rfm-title">${cfg.title}</div>
                    <div class="rfm-count">${cfg.count.toLocaleString()} <span style="font-size:1rem;font-weight:400">คน</span></div>
                    <div class="rfm-sub">ยอดรวม: ${cfg.rev.toLocaleString()} บาท
เฉลี่ย/คน: ${avg} บาท</div>
                    <div style="font-size:0.75rem;margin-top:8px;opacity:0.85">${pct}% ของลูกค้าทั้งหมด</div>
                    <div class="rfm-pct-bar"><div class="rfm-pct-fill" style="width:${pct}%"></div></div>
                    <div style="position:absolute;right:15px;top:15px;font-size:0.7rem;opacity:0.7;"><i class="fa-solid fa-arrow-up-right-from-square"></i> ดูรายชื่อ</div>
                </div>`;
            }).join('');

            if (charts.rfmDonut) charts.rfmDonut.destroy();
            charts.rfmDonut = new Chart(document.getElementById('rfmDonutChart'), {
                type: 'doughnut',
                data: {
                    labels: ['Active (≤6 เดือน)', 'กำลังหายไป (6-12 เดือน)', 'หายไปแล้ว (>12 เดือน)'],
                    datasets: [{
                        data: [rfmGroups.active.length, rfmGroups.fading.length, rfmGroups.lost.length],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 3, borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
                        title: {
                            display: true,
                            text: '📊 สัดส่วนจำนวนลูกค้า (RFM)',
                            font: { size: 14, weight: 'bold' },
                            padding: { bottom: 10 }
                        }
                    }
                }
            });

            if (charts.rfmRevenue) charts.rfmRevenue.destroy();
            charts.rfmRevenue = new Chart(document.getElementById('rfmRevenueChart'), {
                type: 'bar',
                data: {
                    labels: ['Active', 'กำลังหายไป', 'หายไปแล้ว'],
                    datasets: [{
                        label: 'ยอดขายรวม (บาท)',
                        data: [revActive, revFading, revLost],
                        backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: '💰 ยอดขายแยกตามกลุ่ม RFM',
                            font: { size: 14, weight: 'bold' },
                            padding: { bottom: 10 }
                        },
                        tooltip: { callbacks: { label: ctx => '฿' + ctx.raw.toLocaleString() } }
                    },
                    scales: { y: { ticks: { callback: v => '฿' + (v / 1000).toFixed(0) + 'k' } } }
                }
            });

            window._rfmGroups = rfmGroups;
            window._rfmRefDate = refDate;
        }

        window._rfmSort = { col: 'total', dir: 'desc' };

        function showRFMModal(groupKey, sortCol, sortDir) {
            if (!window._rfmGroups) return;
            const group = window._rfmGroups[groupKey];
            if (!group) return;

            if (sortCol) {
                if (window._rfmSort.col === sortCol) {
                    window._rfmSort.dir = window._rfmSort.dir === 'asc' ? 'desc' : 'asc';
                } else {
                    window._rfmSort.col = sortCol;
                    window._rfmSort.dir = sortDir || 'desc';
                }
            } else {
                window._rfmSort = { col: 'total', dir: 'desc' };
            }

            const { col, dir } = window._rfmSort;
            const refDate = window._rfmRefDate || new Date();

            const enriched = group.map(c => ({
                ...c,
                diffMonths: parseFloat(((refDate - c.lastDate) / (1000 * 60 * 60 * 24 * 30.44)).toFixed(1))
            }));

            const sorted = enriched.sort((a, b) => {
                let av, bv;
                if (col === 'total')      { av = a.total;      bv = b.total; }
                else if (col === 'lastDate')   { av = a.lastDate;   bv = b.lastDate; }
                else if (col === 'diffMonths') { av = a.diffMonths; bv = b.diffMonths; }
                else if (col === 'name')  { av = a.name;       bv = b.name; return dir === 'asc' ? av.localeCompare(bv, 'th') : bv.localeCompare(av, 'th'); }
                return dir === 'asc' ? av - bv : bv - av;
            });

            const titles = {
                active: '🟢 ลูกค้า Active — มีกิจกรรมภายใน 6 เดือน',
                fading: '🟡 ลูกค้ากำลังหายไป — 6–12 เดือนไม่มีกิจกรรม',
                lost:   '🔴 ลูกค้าหายไปแล้ว — ไม่มีกิจกรรมมากกว่า 12 เดือน'
            };
            const colors = { active: '#059669', fading: '#d97706', lost: '#dc2626' };

            document.getElementById('listModalTitle').innerHTML =
                `<span style="color:${colors[groupKey]}">${titles[groupKey]}</span>&nbsp;<small style="color:#9ca3af;font-weight:400">(${sorted.length} คน)</small>`;

            const refDateStr = refDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
            const dotColor = groupKey === 'active' ? '#10b981' : groupKey === 'fading' ? '#f59e0b' : '#ef4444';
            const bg      = groupKey === 'active' ? '#d1fae5' : groupKey === 'fading' ? '#fef3c7' : '#fee2e2';

            const arrow = (c) => {
                const isActive = col === c;
                const icon = isActive ? (dir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort';
                const clr  = isActive ? '#6366f1' : '#d1d5db';
                return `<i class="fa-solid ${icon}" style="margin-left:5px;color:${clr};font-size:0.75rem;"></i>`;
            };

            const thStyle = (align) => `cursor:pointer;user-select:none;white-space:nowrap;text-align:${align || 'left'};`;

            let html = `<div style="margin-bottom:12px;padding:10px 14px;background:#f8fafc;border-radius:10px;font-size:0.85rem;color:#6b7280;">
                <i class="fa-solid fa-circle-info"></i> อ้างอิงวันล่าสุดในไฟล์ข้อมูล: <strong style="color:#1f2937">${refDateStr}</strong>
                &nbsp;·&nbsp; <span style="color:#a78bfa">คลิกหัวตารางเพื่อเรียงข้อมูล</span>
            </div>
            <table style="width:100%">
                <thead><tr>
                    <th style="width:90px">HN</th>
                    <th style="${thStyle()}" onclick="showRFMModal('${groupKey}','name')">ชื่อ-สกุล${arrow('name')}</th>
                    <th style="${thStyle('right')}width:140px" onclick="showRFMModal('${groupKey}','total')">ยอดรวม (บาท)${arrow('total')}</th>
                    <th style="${thStyle('center')}width:130px" onclick="showRFMModal('${groupKey}','lastDate')">เข้าครั้งสุดท้าย${arrow('lastDate')}</th>
                    <th style="${thStyle('center')}width:105px" onclick="showRFMModal('${groupKey}','diffMonths')">ห่างออกไป${arrow('diffMonths')}</th>
                </tr></thead><tbody>`;

            sorted.forEach(c => {
                html += `<tr>
                    <td><span class="clickable" onclick="showCustDetail('${c.hn}')">${c.hn}</span></td>
                    <td>
                        <span style="font-weight:600">${c.name}</span>
                        ${c.phone !== '-' ? `<small style="color:#9ca3af;margin-left:6px">${c.phone}</small>` : ''}
                    </td>
                    <td style="text-align:right;font-weight:700;color:var(--primary-color)">${c.total.toLocaleString()}</td>
                    <td style="text-align:center;font-size:0.8rem">${c.lastDate.toLocaleDateString('th-TH')}</td>
                    <td style="text-align:center">
                        <span style="background:${bg};color:${dotColor};padding:3px 9px;border-radius:10px;font-size:0.75rem;font-weight:700">${c.diffMonths} เดือน</span>
                    </td>
                </tr>`;
            });

            html += `</tbody></table>`;
            document.getElementById('listModalBody').innerHTML = html;
            openModal('listModal');
        }
        /* ====== END RFM MODEL ====== */

        function showAIModal() {
            const fNum = (n) => n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            const fInt = (n) => n.toLocaleString(undefined, {maximumFractionDigits: 0});
            const cur = calculateMetrics(filteredData, processedCustomers);
            
            const startStr = document.getElementById('startDate').value;
            const endStr = document.getElementById('endDate').value;
            const periodText = `${startStr} ถึง ${endStr}`;

            let prompt = `Role: Clinic Business Strategist\nTask: Analyze data and suggest growth strategies.\nAnalysis Period: ${periodText}\n\n`;
            
            prompt += `--- 1. Business Overview ---\n`;
            prompt += `- ยอดขายรวม: ${fNum(cur.rev)} บาท\n`;
            prompt += `- ยอดต่อหัว (Avg/Head): ${fNum(cur.avgHead)} บาท/คน\n`;
            prompt += `- ยอดขายลูกค้าใหม่: ${fNum(cur.newSales)} บาท\n`;
            prompt += `- ยอดขายลูกค้าเก่ารวม: ${fNum(cur.oldSales)} บาท\n`;
            const oldRepeatSales = processedCustomers.filter(c => !c.isNew && c.visits.size > 1).reduce((s,c) => s + c.total, 0);
            prompt += `- ยอดขายลูกค้าเก่ามาซ้ำ: ${fNum(oldRepeatSales)} บาท (จำนวนคน: ${fInt(cur.oldRepeatCount)} คน)\n`;
            prompt += `- จำนวน Visit: ${fInt(cur.visits)} ครั้ง\n`;
            prompt += `- ลูกค้าทั้งหมด: ${fInt(cur.unique)} คน\n`;
            prompt += `- ลูกค้าใหม่ (ลงทะเบียน): ${fInt(cur.newReg)} คน\n`;
            prompt += `- ลูกค้าเก่า: ${fInt(cur.oldCust)} คน\n`;
            prompt += `- ลูกค้าใหม่จ่ายเงิน: ${fInt(cur.newPaying)} คน\n`;
            prompt += `- ลูกค้าที่จ่ายเงินทั้งหมด: ${fInt(cur.totalPaying)} คน\n`;
            prompt += `- อัตราลูกค้าเดิม (Repeat Rate): ${cur.repeatRate.toFixed(1)}%\n\n`;

            prompt += `--- 2. ประเภทลูกค้าและพฤติกรรมการซื้อ (เฉพาะชำระปกติ) ---\n`;
            prompt += `- ลูกค้าชำระเงินสุทธิ (ชำระปกติ): ${fInt(cur.regularPayingCount)} คน (ยอด ${fNum(cur.regularRev)} บ.)\n`;
            prompt += `- ลูกค้ากลุ่มซื้อแบบคอร์ส: ${fInt(cur.courseCount)} คน (ยอด ${fNum(cur.courseSales)} บ.)\n`;
            prompt += `- ลูกค้ากลุ่มซื้อครั้งเดียว: ${fInt(cur.singleCount)} คน (ยอด ${fNum(cur.singleSales)} บ.)\n`;
            prompt += `- ลูกค้ามาชำระหนี้ (BL): ${fInt(cur.debtCount)} คน (ยอด ${fNum(cur.debtRev)} บ.)\n\n`;

            prompt += `--- 3. Spending Segments ---\n`;
            PRICE_RANGES.forEach(r => {
                const members = processedCustomers.filter(c => c.segmentLabel === r.label);
                const sum = members.reduce((s, c) => s + c.total, 0);
                prompt += `- ${r.label}: ${fInt(members.length)} คน (รวม ${fNum(sum)} บ.)\n`;
            });

            prompt += `\n--- 4. Visit Frequency ---\n`;
            const freqMap = processedCustomers.reduce((acc, c) => { acc[c.visits.size] = (acc[c.visits.size]||0) + 1; return acc; }, {});
            Object.keys(freqMap).sort((a,b)=>a-b).forEach(f => {
                prompt += `- มา ${f} ครั้ง: ${fInt(freqMap[f])} คน\n`;
            });

            prompt += `\n--- 5. Category Performance ---\n`;
            const catData = filteredData.reduce((acc, r) => {
                const c = getCategoryForRow(r);
                if(!acc[c]) acc[c] = { rev:0, custs: new Set() };
                acc[c].rev += r['ยอดชำระ'];
                if(r.HN) acc[c].custs.add(r.HN);
                return acc;
            }, {});
            Object.entries(catData).sort((a,b)=>b[1].rev - a[1].rev).forEach(([k,v]) => {
                prompt += `- ${k}: ยอด ${fNum(v.rev)} บ. | ลูกค้า ${fInt(v.custs.size)} คน\n`;
            });

            prompt += `\n--- 6. Top 10 Services ---\n`;
            const itemStats = filteredData.reduce((acc, r) => {
                if(r['ยอดชำระ'] > 0 && r['รายการ']) {
                    if(!acc[r['รายการ']]) acc[r['รายการ']] = { rev:0, qty:0 };
                    acc[r['รายการ']].rev += r['ยอดชำระ'];
                    acc[r['รายการ']].qty++;
                }
                return acc;
            }, {});
            Object.entries(itemStats).sort((a,b)=>b[1].rev - a[1].rev).slice(0, 10).forEach(([k,v], i) => {
                prompt += `${i+1}. ${k} | ยอดขาย: ${fNum(v.rev)} บ. | จำนวน: ${fInt(v.qty)} ครั้ง\n`;
            });

            prompt += `\n--- 7. Monthly Behavior Trends ---\n`;
            const monthlyStats = rawData.reduce((acc, r) => {
                const monthKey = `${r.__date.getFullYear()}-${String(r.__date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[monthKey]) acc[monthKey] = { rev:0, all: new Set(), new: new Set(), pay: new Set() };
                acc[monthKey].rev += r['ยอดชำระ'];
                if (r.HN) {
                    acc[monthKey].all.add(r.HN);
                    if (r['ยอดชำระ'] > 0) acc[monthKey].pay.add(r.HN);
                    const regMonth = r.__regDate ? `${r.__regDate.getFullYear()}-${String(r.__regDate.getMonth() + 1).padStart(2, '0')}` : null;
                    if (regMonth === monthKey) acc[monthKey].new.add(r.HN);
                }
                return acc;
            }, {});
            Object.keys(monthlyStats).sort().reverse().forEach(m => {
                const s = monthlyStats[m];
                prompt += `- เดือน ${m} | ยอดขาย: ${fNum(s.rev)} บ. | ลูกค้า: ${fInt(s.all.size)} (ใหม่: ${fInt(s.new.size)}, จ่ายเงิน: ${fInt(s.pay.size)})\n`;
            });

            if (window._rfmGroups && window._rfmRefDate) {
                prompt += `\n--- 8. RFM Customer Loyalty ---\n`;
                const rfmG = window._rfmGroups;
                const rRef = window._rfmRefDate.toLocaleDateString('th-TH');
                prompt += `(อ้างอิงวันที่: ${rRef})\n`;
                prompt += `- Active (≤6 เดือน): ${fInt(rfmG.active.length)} คน | ยอดรวม: ${fNum(rfmG.active.reduce((s,c)=>s+c.total,0))} บ.\n`;
                prompt += `- กำลังหายไป (6-12 เดือน): ${fInt(rfmG.fading.length)} คน | ยอดรวม: ${fNum(rfmG.fading.reduce((s,c)=>s+c.total,0))} บ.\n`;
                prompt += `- หายไปแล้ว (>12 เดือน): ${fInt(rfmG.lost.length)} คน | ยอดรวม: ${fNum(rfmG.lost.reduce((s,c)=>s+c.total,0))} บ.\n`;
            }

            document.getElementById('aiText').value = prompt;
            openModal('aiModal');
        }

        function renderDetailsTable() {
            const filter = document.getElementById('segmentFilter').value;
            const displayData = filter === 'all' ? processedCustomers : processedCustomers.filter(c => c.segmentLabel === filter);
            document.getElementById('detailsTableBody').innerHTML = displayData.slice(0, 500).map((c) => `<tr><td><span class="clickable" onclick="showCustDetail('${c.hn}')">${c.hn}</span></td><td><div style="font-weight:600">${c.name}</div><small>${c.phone}</small></td><td>${c.segmentLabel}</td><td style="font-weight:700; text-align:right">${c.total.toLocaleString()}</td><td>${c.lastDate.toLocaleDateString('th-TH')}</td></tr>`).join('');
        }

        function updatePerformanceMatrix() {
            const items = filteredData.reduce((acc, r) => { if(r['ยอดชำระ'] > 0 && r['รายการ']) { if(!acc[r['รายการ']]) acc[r['รายการ']] = { rev:0, qty:0, hns: new Set() }; acc[r['รายการ']].rev += r['ยอดชำระ']; acc[r['รายการ']].qty++; acc[r['รายการ']].hns.add(r.HN); } return acc; }, {});
            const sortedItems = Object.entries(items).sort((a,b)=>b[1].rev - a[1].rev).slice(0, 10);
            document.getElementById('performanceMatrixBody').innerHTML = sortedItems.map(([k,v], i) => `<tr><td style="text-align:center">${i+1}</td><td style="font-weight:600">${k}</td><td style="text-align:right">${v.rev.toLocaleString()}</td><td style="text-align:center">${v.qty}</td><td style="text-align:right">${(v.rev/v.qty).toFixed(0)}</td><td style="text-align:center">${v.hns.size}</td></tr>`).join('');
        }

        function showCustDetail(hn) { 
            const cust = processedCustomers.find(c => c.hn === hn); if(!cust) return; 
            const history = rawData.filter(r => r.HN.toString() === hn).sort((a,b) => b.__date - a.__date); 
            document.getElementById('custModalTitle').textContent = `👤 ${cust.name} (HN: ${hn})`; 
            document.getElementById('custModalBody').innerHTML = `
                <div style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>ประเภทการซื้อ:</strong> ${cust.isCourse ? 'ลูกค้าคอร์ส' : 'ลูกค้าซื้อครั้งเดียว'}</div>
                    <div><strong>เกณฑ์ตัดสิน:</strong> ${cust.categoryReason}</div>
                    <div><strong>ยอดรวมสุทธิ:</strong> ${cust.total.toLocaleString()} บาท</div>
                    <div><strong>ยอดชำระหนี้:</strong> ${cust.totalDebt.toLocaleString()} บาท</div>
                </div>
                <table><thead><tr><th>วันที่</th><th>รายการ</th><th style="text-align:right">ยอด</th><th>ประเภท</th></tr></thead><tbody>${history.map(h => `<tr><td>${h['วันที่ขาย']}</td><td>${h['รายการ']}</td><td style="text-align:right">${h['ยอดชำระ'].toLocaleString()}</td><td><small>${h.__paymentType}</small></td></tr>`).join('')}</tbody></table>`; 
            openModal('custModal'); 
        }

        function showFrequencyCustomers(freq) {
            const list = processedCustomers.filter(c => c.visits.size === freq).sort((a,b)=>b.total - a.total);
            document.getElementById('listModalTitle').textContent = `ลูกค้าที่มา ${freq} ครั้ง (${list.length} คน)`;
            document.getElementById('listModalBody').innerHTML = `<table><thead><tr><th>HN</th><th>ชื่อ</th><th style="text-align:right">ยอดรวม</th></tr></thead><tbody>${list.map(c => `<tr><td><span class="clickable" onclick="showCustDetail('${c.hn}')">${c.hn}</span></td><td>${c.name}</td><td style="text-align:right">${c.total.toLocaleString()}</td></tr>`).join('')}</tbody></table>`;
            openModal('listModal');
        }

        function showFrequencySummary() {
            const freqMap = processedCustomers.reduce((acc, c) => { acc[c.visits.size] = (acc[c.visits.size]||0) + 1; return acc; }, {});
            let html = `<table><thead><tr><th>ครั้ง</th><th>คน</th></tr></thead><tbody>`;
            Object.keys(freqMap).sort((a,b)=>a-b).forEach(f => { html += `<tr><td>${f} ครั้ง</td><td>${freqMap[f]}</td></tr>`; });
            document.getElementById('freqModalBody').innerHTML = html + `</tbody></table>`;
            openModal('freqModal');
        }

        function showCategoryCustomers(cat) {
            const trans = filteredData.filter(r => getCategoryForRow(r) === cat && r.HN);
            const hnGroups = trans.reduce((acc, r) => {
                const hn = r.HN.toString();
                if(!acc[hn]) acc[hn] = { name: r['ชื่อ-สกุล']||'-', total: 0, items: new Set() };
                acc[hn].total += (r['ยอดชำระ'] || 0);
                if(r['รายการ']) acc[hn].items.add(r['รายการ']); 
                return acc;
            }, {});
            const list = Object.entries(hnGroups).map(([hn, d]) => ({ hn, ...d })).sort((a,b)=>b.total - a.total);
            document.getElementById('listModalTitle').textContent = `📁 ${cat} (${list.length} คน)`;
            let html = `<table style="width:100%"><thead><tr><th style="width:100px;">HN</th><th>ชื่อลูกค้า</th><th style="text-align:right; width:120px;">ยอดชำระ</th><th>รายการสินค้าที่ซื้อ/ทำ</th></tr></thead><tbody>`;
            list.forEach(c => {
                html += `<tr><td><span class="clickable" onclick="showCustDetail('${c.hn}')">${c.hn}</span></td><td><div style="font-weight:600">${c.name}</div></td><td style="text-align:right; font-weight:700; color:var(--primary-color);">${c.total.toLocaleString()}</td><td style="font-size:0.75rem; color:#6b7280; line-height:1.4;">${Array.from(c.items).join(', ')}</td></tr>`;
            });
            html += `</tbody></table>`;
            document.getElementById('listModalBody').innerHTML = html;
            openModal('listModal');
        }

        function openModal(id) { document.getElementById(id).style.display = 'block'; }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }
        function populateSegmentFilter() { document.getElementById('segmentFilter').innerHTML = '<option value="all">ทั้งหมด</option>' + PRICE_RANGES.map(r => `<option value="${r.label}">${r.label}</option>`).join(''); }
        function filterBySegment(label) { document.getElementById('segmentFilter').value = label; renderDetailsTable(); }
        function copyToClipboard() { const area = document.getElementById('aiText'); area.select(); document.execCommand('copy'); }
        
        function exportPDF() {
            const element = document.getElementById('dashboardView');
            if (!element) return;
            const originalWidth = element.style.width;
            element.style.width = "1400px"; 
            const metaHeader = document.getElementById('reportMetaSection');
            metaHeader.style.display = 'grid'; 
            const widthPx = element.offsetWidth;
            const heightPx = element.scrollHeight;
            const opt = {
                margin: 0,
                filename: `Clinic_Strategic_Report_${new Date().toISOString().slice(0,10)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: widthPx, windowHeight: heightPx, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'px', format: [widthPx, heightPx + 40], orientation: 'portrait', hotfixes: ['px_scaling'] }
            };
            html2pdf().set(opt).from(element).toPdf().get('pdf').then(() => {
                element.style.width = originalWidth;
                metaHeader.style.display = 'none';
            }).save();
        }

        window.onclick = function(e) { if(e.target.className === 'modal') closeModal(e.target.id); }
    </script>
</body>
</html>
