import React, { useState, useEffect } from 'react';

interface StaffRunnerPageProps {
  activeTab: string;
}

interface BeverageComplaint {
  id: string;
  table: string;
  dishName: string;
  issueNote: string;
  status: 'InKitchen' | 'ReadyToDeliver' | 'Delivered';
  createdAt: string;
}

interface AttendanceLog {
  date: string;
  type: 'IN' | 'OUT';
  timestamp: string;
  bssid: string;
  status: string;
}

export const StaffRunnerPage: React.FC<StaffRunnerPageProps> = ({ activeTab }) => {
  const tablesList = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];
  const menuOptions = [
    'Cà Phê Sữa Đá Sài Gòn',
    'Bạc Xỉu Đá Ngọt Dịu',
    'Espresso Intenso',
    'Trà Đào Cam Sả Tươi',
    'Trà Sữa Ô Long Kem Trứng',
    'Bánh Croissant Bơ Bơ',
    'Bánh Tiramisu Ý'
  ];

  // 1. TABLE OCCUPANCY STATE (REALTIME SYNC)
  const [activeKdsTickets, setActiveKdsTickets] = useState<any[]>([]);
  const [pendingBills, setPendingBills] = useState<any[]>([]);

  const syncData = () => {
    const savedTickets = localStorage.getItem('fnb_kds_tickets');
    setActiveKdsTickets(savedTickets ? JSON.parse(savedTickets) : []);

    const savedPending = localStorage.getItem('fnb_pending_bills');
    setPendingBills(savedPending ? JSON.parse(savedPending) : []);
  };

  useEffect(() => {
    syncData();
    window.addEventListener('fnb_data_updated', syncData);
    const interval = setInterval(syncData, 1500);
    return () => {
      window.removeEventListener('fnb_data_updated', syncData);
      clearInterval(interval);
    };
  }, []);

  const tableStatusMap: { [table: string]: { status: 'Free' | 'PendingHold' | 'Occupied'; details?: string } } = {};
  tablesList.forEach(t => { tableStatusMap[t] = { status: 'Free' }; });

  activeKdsTickets.forEach((t: any) => {
    if (t.table) tableStatusMap[t.table] = { status: 'Occupied', details: `Vé: ${t.orderNo} | Thẻ: ${t.pagerId || 'Đã giao'}` };
  });

  pendingBills.forEach((p: any) => {
    if (p.table && tableStatusMap[p.table]?.status !== 'Occupied') {
      tableStatusMap[p.table] = { status: 'PendingHold', details: `Bill: ${p.billCode} (Đang giữ chỗ)` };
    }
  });

  // HANDLER: STAFF CLEANS AND RELEASES TABLE TO "TRỐNG"
  const handleCleanAndReleaseTable = (tableToRelease: string) => {
    const updatedTickets = activeKdsTickets.filter((t: any) => t.table !== tableToRelease);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));

    const updatedPending = pendingBills.filter((p: any) => p.table !== tableToRelease);
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    window.dispatchEvent(new Event('fnb_data_updated'));
    alert(`ĐÃ DỌN DẸP & GIẢI PHÓNG "${tableToRelease}" THÀNH CÔNG!\nBàn đã sẵn sàng ở trạng thái TRỐNG để đón lượt khách mới.`);
  };

  // 2. BEVERAGE COMPLAINTS & KITCHEN ADJUSTMENT SYSTEM
  const [complaints, setComplaints] = useState<BeverageComplaint[]>(() => {
    const saved = localStorage.getItem('fnb_staff_complaints');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ADJ-101',
        table: 'Bàn 04',
        dishName: 'Cà Phê Sữa Đá Sài Gòn',
        issueNote: 'Khách xin bớt ngọt, cho thêm đá',
        status: 'InKitchen',
        createdAt: '02:30:15'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('fnb_staff_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const [selectedComplaintTable, setSelectedComplaintTable] = useState<string>('Bàn 01');
  const [selectedComplaintDish, setSelectedComplaintDish] = useState<string>('Cà Phê Sữa Đá Sài Gòn');
  const [complaintNote, setComplaintNote] = useState<string>('Khách xin bớt ngọt / ít đường');

  const handleSendAdjustmentToKitchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintNote.trim()) {
      alert('Vui lòng nhập ghi chú khiếu nại của khách!');
      return;
    }

    const complaintId = `ADJ-${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint: BeverageComplaint = {
      id: complaintId,
      table: selectedComplaintTable,
      dishName: selectedComplaintDish,
      issueNote: complaintNote.trim(),
      status: 'InKitchen',
      createdAt: new Date().toLocaleTimeString('vi-VN')
    };

    // PUSH AS ADJUSTMENT TICKET TO KITCHEN KDS
    const adjustmentKdsTicket = {
      id: `TK-${complaintId}`,
      orderNo: complaintId,
      table: selectedComplaintTable,
      pagerId: 'PHỤC VỤ TẬN BÀN',
      station: selectedComplaintDish.includes('Bánh') ? 'Kitchen' : 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      isAddOn: true,
      isAddOnNoticePending: true,
      isAdjustment: true,
      items: [
        {
          id: `ADJ-ITEM-${Date.now()}`,
          name: selectedComplaintDish,
          quantity: 1,
          note: `🚨 [YÊU CẦU ĐIỀU CHỈNH / SỬA MÓN]: ${complaintNote.trim()} (Bàn: ${selectedComplaintTable})`
        }
      ]
    };

    const existingKds = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([adjustmentKdsTicket, ...existingKds]));

    const updatedComplaints = [newComplaint, ...complaints];
    setComplaints(updatedComplaints);

    window.dispatchEvent(new Event('fnb_data_updated'));
    alert(`ĐÃ GỬI LỆNH ĐIỀU CHỈNH "${selectedComplaintDish}" XUỐNG BẾP!\n- Bàn: ${selectedComplaintTable}\n- Ghi chú: ${complaintNote}\nBếp sẽ pha chế lại theo yêu cầu và báo phục vụ mang ra bàn.`);
    setComplaintNote('Khách xin bớt ngọt / ít đường');
  };

  const handleDeliverAdjustedDrink = (id: string, table: string, dishName: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: 'Delivered' as const } : c);
    setComplaints(updated);
    alert(`ĐÃ XÁC NHẬN MANG MÓN "${dishName}" ĐÃ SỬA RA PHỤC VỤ TẠI ${table}! Khiếu nại đã được giải quyết hài lòng.`);
  };

  // 3. WIFI ATTENDANCE LOGS
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    { date: '2026-08-28', type: 'IN', timestamp: '08:00:15 AM', bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)', status: 'Hợp Lệ (Geofenced)' },
    { date: '2026-08-27', type: 'OUT', timestamp: '18:02:10 PM', bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)', status: 'Hợp Lệ (Geofenced)' },
  ]);

  const handleClockInWifi = () => {
    const now = new Date();
    const newLog: AttendanceLog = {
      date: now.toISOString().split('T')[0],
      type: 'IN',
      timestamp: now.toLocaleTimeString('vi-VN'),
      bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)',
      status: 'Hợp Lệ (Geofenced)'
    };
    setAttendanceLogs([newLog, ...attendanceLogs]);
    alert('CHẤM CÔNG VÀO LÀM THÀNH CÔNG! Đã xác thực mạng WiFi Chi Nhánh.');
  };

  const handleClockOutWifi = () => {
    const now = new Date();
    const newLog: AttendanceLog = {
      date: now.toISOString().split('T')[0],
      type: 'OUT',
      timestamp: now.toLocaleTimeString('vi-VN'),
      bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)',
      status: 'Hợp Lệ (Geofenced)'
    };
    setAttendanceLogs([newLog, ...attendanceLogs]);
    alert('CHẤM CÔNG TAN LÀM THÀNH CÔNG!');
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: SƠ ĐỒ BÀN & DỌN DẸP GIẢI PHÓNG BÀN */}
      {(activeTab === 'staff-tables' || activeTab === 'staff') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Sơ Đồ Bàn & Dọn Dẹp Giải Phóng Bàn (Dành Cho Phục Vụ)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Theo dõi trạng thái các bàn. Khi khách đã dùng xong và rời đi, nhân viên phục vụ dọn dẹp bàn rồi bấm <strong>"Xác Nhận Đã Dọn Bàn & Giải Phóng"</strong> để trả bàn về trạng thái TRỐNG.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {tablesList.map((tbl) => {
              const info = tableStatusMap[tbl];
              const isOccupied = info.status === 'Occupied';
              const isPending = info.status === 'PendingHold';
              const isFree = info.status === 'Free';

              const bg = isOccupied ? '#FEE2E2' : isPending ? '#FEF3C7' : '#ECFDF5';
              const border = isOccupied ? '2px solid #EF4444' : isPending ? '2px solid #F59E0B' : '1px solid #A7F3D0';
              const badgeBg = isOccupied ? '#DC2626' : isPending ? '#D97706' : '#059669';
              const label = isOccupied ? '🛑 ĐANG CÓ KHÁCH' : isPending ? '⏳ ĐANG GIỮ CHỖ QR' : '🟢 BÀN TRỐNG SẴN SÀNG';

              return (
                <div key={tbl} style={{ border, background: bg, borderRadius: '8px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '20px', color: '#0F172A', fontWeight: 'bold' }}>{tbl}</h3>
                      <span style={{ background: badgeBg, color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {label}
                      </span>
                    </div>
                    {info.details && (
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', fontWeight: 'bold' }}>
                        Chi tiết: {info.details}
                      </div>
                    )}
                  </div>

                  {!isFree ? (
                    <button
                      onClick={() => handleCleanAndReleaseTable(tbl)}
                      style={{ width: '100%', padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      🧹 XÁC NHẬN ĐÃ DỌN BÀN & GIẢI PHÓNG
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#059669', fontWeight: 'bold', padding: '8px', background: '#DCFCE7', borderRadius: '6px' }}>
                      ✓ Bàn đã sạch sẽ, sẵn sàng đón khách
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: TIẾP NHẬN KHIẾU NẠI & YÊU CẦU SỬA MÓN BẾP */}
      {activeTab === 'staff-complaints' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* FORM INTAKE COMPLAINT */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ghi Nhận Khiếu Nại & Yêu Cầu Sửa Món Bếp</h2>
            <p style={{ color: '#475569', fontSize: '13px', marginBottom: '16px' }}>Khi khách tại bàn phản hồi về chất lượng đồ uống (ít đường, quá đắng, đổi món...), phục vụ gửi lệnh trực tiếp xuống Bếp.</p>

            <form onSubmit={handleSendAdjustmentToKitchen} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Vị Trí Bàn Khiếu Nại:</label>
                <select value={selectedComplaintTable} onChange={(e) => setSelectedComplaintTable(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold' }}>
                  {tablesList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Món Cần Bếp Pha Chế Lại / Điều Chỉnh:</label>
                <select value={selectedComplaintDish} onChange={(e) => setSelectedComplaintDish(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold' }}>
                  {menuOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Ghi Chú Yêu Cầu Của Khách:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khách xin bớt ngọt, cho thêm đá..."
                  value={complaintNote}
                  onChange={(e) => setComplaintNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}
                />
              </div>

              <button
                type="submit"
                style={{ padding: '12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '6px' }}
              >
                🚨 GỬI YÊU CẦU ĐIỀU CHỈNH XUỐNG BẾP
              </button>
            </form>
          </div>

          {/* LIST OF ACTIVE ADJUSTMENTS & DELIVERY CONFIRMATION */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Tiến Độ Sửa Món & Mang Ra Bàn</h2>
            <p style={{ color: '#475569', fontSize: '13px', marginBottom: '16px' }}>Theo dõi Bếp làm lại và xác nhận khi phục vụ đã mang đồ uống ra bàn khách.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaints.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                  Không có yêu cầu điều chỉnh món nào.
                </div>
              ) : (
                complaints.map((c) => (
                  <div key={c.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0F172A', fontSize: '16px' }}>{c.table} - {c.dishName}</strong>
                      <span style={{ background: c.status === 'Delivered' ? '#DCFCE7' : '#FEF3C7', color: c.status === 'Delivered' ? '#166534' : '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {c.status === 'Delivered' ? '✓ Đã giao tại bàn' : '👨‍🍳 Bếp đang làm lại'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#DC2626', fontWeight: 'bold', marginTop: '6px' }}>
                      Ghi chú: {c.issueNote}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Mã yêu cầu: {c.id} | Giờ tạo: {c.createdAt}</div>

                    {c.status !== 'Delivered' && (
                      <button
                        onClick={() => handleDeliverAdjustedDrink(c.id, c.table, c.dishName)}
                        style={{ marginTop: '10px', width: '100%', padding: '8px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        ✓ XÁC NHẬN ĐÃ MANG MÓN SỬA RA BÀN {c.table}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* 3. VIEW 3: WIFI ATTENDANCE */}
      {activeTab === 'staff-attendance' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Chấm Công WiFi Geofence Chi Nhánh (Chống Gian Lận)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Xác thực kết nối mạng WiFi nội bộ BSSID `74:83:C2:9F:10:AB` tại Chi Nhánh Quận 1.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleClockInWifi} style={{ padding: '10px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>CHẤM CÔNG VÀO LÀM (IN)</button>
              <button onClick={handleClockOutWifi} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>CHẤM CÔNG TAN LÀM (OUT)</button>
            </div>
          </div>

          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            Trạng thái kết nối hiện tại: Đã kết nối WiFi_Q1_5G (74:83:C2:9F:10:AB) | Định vị Geofence: Trong phạm vi chi nhánh (Hợp lệ 100%)
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Ngày Chấm Công</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Loại Ca</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Địa Chỉ BSSID WiFi</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Kết Quả Geofence</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.map((log, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{log.date}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: log.type === 'IN' ? '#DCFCE7' : '#FEE2E2', color: log.type === 'IN' ? '#166534' : '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {log.type === 'IN' ? 'Check-IN (Vào Làm)' : 'Check-OUT (Tan Làm)'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#2563EB', fontWeight: 'bold' }}>{log.timestamp}</td>
                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>{log.bssid}</td>
                    <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 'bold', fontSize: '13px' }}>{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffRunnerPage;
