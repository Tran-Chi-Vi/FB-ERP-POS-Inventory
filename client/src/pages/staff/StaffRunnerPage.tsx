import React, { useState } from 'react';

interface StaffRunnerPageProps {
  activeTab: string;
}

interface RunnerQueueItem {
  id: string;
  orderNo: string;
  table: string;
  itemNames: string;
  station: string;
  timeReady: string;
}

interface TableStatus {
  id: string;
  name: string;
  status: 'Serving' | 'Empty' | 'WaitingPayment' | 'Reserved';
  guests: number;
}

interface AttendanceLog {
  date: string;
  type: 'IN' | 'OUT';
  timestamp: string;
  bssid: string;
  status: string;
}

export const StaffRunnerPage: React.FC<StaffRunnerPageProps> = ({ activeTab }) => {
  // 1. MPOS RUNNER QUEUE
  const [runnerQueue, setRunnerQueue] = useState<RunnerQueueItem[]>([
    { id: 'RUN-101', orderNo: 'ORD-9921', table: 'Bàn 04', itemNames: '2x Cà Phê Sữa Đá, 1x Trà Đào', station: 'Trạm Barista', timeReady: '1 phút trước' },
    { id: 'RUN-102', orderNo: 'ORD-9928', table: 'Bàn 03', itemNames: '2x Bánh Croissant Bơ', station: 'Trạm Bếp Nóng', timeReady: ' Vừa xong' },
  ]);

  // 2. TABLES MAP OVERVIEW
  const [tables, setTables] = useState<TableStatus[]>([
    { id: 'T1', name: 'Bàn 01', status: 'Serving', guests: 2 },
    { id: 'T2', name: 'Bàn 02', status: 'Empty', guests: 0 },
    { id: 'T3', name: 'Bàn 03', status: 'Serving', guests: 4 },
    { id: 'T4', name: 'Bàn 04', status: 'WaitingPayment', guests: 3 },
    { id: 'T5', name: 'Bàn 05', status: 'Empty', guests: 0 },
    { id: 'TV1', name: 'VIP 01', status: 'Reserved', guests: 6 },
    { id: 'TV2', name: 'VIP 02', status: 'Empty', guests: 0 },
  ]);

  // 3. WIFI ATTENDANCE LOGS
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    { date: '2026-08-28', type: 'IN', timestamp: '08:00:15 AM', bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)', status: 'Hợp Lệ (Geofenced)' },
    { date: '2026-08-27', type: 'OUT', timestamp: '18:02:10 PM', bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)', status: 'Hợp Lệ (Geofenced)' },
    { date: '2026-08-27', type: 'IN', timestamp: '07:58:30 AM', bssid: '74:83:C2:9F:10:AB (WiFi_Q1_5G)', status: 'Hợp Lệ (Geofenced)' },
  ]);

  // Handlers
  const handleDeliverItem = (id: string) => {
    setRunnerQueue(runnerQueue.filter(r => r.id !== id));
    alert(`Đã xác nhận mang món ra bàn thành công! Hệ thống mPOS cập nhật trạng thái "Đã Phục Vụ".`);
  };

  const handleToggleTableStatus = (id: string) => {
    setTables(tables.map(t => {
      if (t.id === id) {
        const nextStatus: TableStatus['status'] = t.status === 'Empty' ? 'Serving' : t.status === 'Serving' ? 'WaitingPayment' : 'Empty';
        return { ...t, status: nextStatus, guests: nextStatus === 'Empty' ? 0 : 2 };
      }
      return t;
    }));
  };

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
    alert('CHẤM CÔNG VÀO LÀM THÀNH CÔNG! Đã xác thực mạng WiFi BSSID Chi Nhánh Quận 1!');
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
    alert('CHẤM CÔNG TAN LÀM THÀNH CÔNG! Ghi nhận số giờ làm ca hôm nay.');
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: RUNNER QUEUE */}
      {(activeTab === 'staff-runner' || activeTab === 'staff') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Hàng Đợi Trả Món mPOS Runner Queue (Realtime)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Danh sách các món đã được Bếp/Bar bóp chuông hoàn tất. Nhân viên chạy bàn nhận món và mang tới khách.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {runnerQueue.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                Không có món nào đang chờ mang ra bàn.
              </div>
            ) : (
              runnerQueue.map((item) => (
                <div key={item.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.station}</span>
                    <h3 style={{ margin: '8px 0 4px 0', fontSize: '20px', color: '#0F172A', fontWeight: 'bold' }}>{item.table} - {item.itemNames}</h3>
                    <div style={{ fontSize: '13px', color: '#475569' }}>Mã đơn: {item.orderNo} | Báo xong: <strong style={{ color: '#059669' }}>{item.timeReady}</strong></div>
                  </div>
                  <button onClick={() => handleDeliverItem(item.id)} style={{ padding: '12px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                    XÁC NHẬN ĐÃ MANG RA BÀN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: TABLES MAP OVERVIEW */}
      {activeTab === 'staff-tables' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Sơ Đồ Bàn & Trạng Thái Phục Vụ Chi Nhánh</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Theo dõi trạng thái thời gian thực các bàn để hỗ trợ xếp chỗ và trả món cho khách.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {tables.map((t) => {
              const bg = t.status === 'Serving' ? '#DCFCE7' : t.status === 'WaitingPayment' ? '#FEF3C7' : t.status === 'Reserved' ? '#DBEAFE' : '#F1F5F9';
              const text = t.status === 'Serving' ? '#166534' : t.status === 'WaitingPayment' ? '#92400E' : t.status === 'Reserved' ? '#1E40AF' : '#475569';
              const statusLabel = t.status === 'Serving' ? 'Đang Phục Vụ' : t.status === 'WaitingPayment' ? 'Chờ Thanh Toán' : t.status === 'Reserved' ? 'Đã Đặt Trước' : 'Bàn Trống';

              return (
                <div key={t.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>{t.name}</h3>
                      <span style={{ background: bg, color: text, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{statusLabel}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>Khách: {t.guests} người</div>
                  </div>
                  <button onClick={() => handleToggleTableStatus(t.id)} style={{ padding: '8px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                    Đổi Trạng Thái Bàn
                  </button>
                </div>
              );
            })}
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
