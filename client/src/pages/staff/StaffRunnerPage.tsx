import React, { useState } from 'react';

interface StaffRunnerPageProps {
  activeTab: string;
}

interface TableItem {
  id: string;
  name: string;
  zone: string;
  status: 'empty' | 'occupied' | 'dirty';
  itemsCount: number;
}

interface RunnerQueueItem {
  id: string;
  table: string;
  itemName: string;
  quantity: number;
  prepStation: string;
  readyTime: string;
  runnerStatus: 'ready' | 'delivering' | 'delivered';
}

export const StaffRunnerPage: React.FC<StaffRunnerPageProps> = ({ activeTab }) => {
  const [tables, setTables] = useState<TableItem[]>([
    { id: '1', name: 'Bàn 01', zone: 'Sảnh Chính', status: 'occupied', itemsCount: 3 },
    { id: '2', name: 'Bàn 02', zone: 'Sảnh Chính', status: 'empty', itemsCount: 0 },
    { id: '3', name: 'Bàn 03', zone: 'Sân Vườn', status: 'dirty', itemsCount: 0 },
    { id: '4', name: 'Bàn 04', zone: 'Sân Vườn', status: 'occupied', itemsCount: 5 },
  ]);

  const [runnerQueue, setRunnerQueue] = useState<RunnerQueueItem[]>([
    { id: 'RUN-101', table: 'Bàn 04', itemName: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, prepStation: 'Trạm Pha Chế Bar', readyTime: 'Vừa xong', runnerStatus: 'ready' },
    { id: 'RUN-102', table: 'Bàn 01', itemName: 'Bánh Tiramisu Tươi', quantity: 1, prepStation: 'Trạm Bếp Nóng', readyTime: '2 phút trước', runnerStatus: 'ready' }
  ]);

  const [checkInWifi] = useState({ bssid: 'c6:d4:e0:11:22:33', isMatched: true, checkInTime: '07:45 AM' });

  const handleCleanTable = (id: string) => {
    setTables(tables.map(t => t.id === id ? { ...t, status: 'empty' } : t));
  };

  const handleDeliverItem = (id: string) => {
    setRunnerQueue(runnerQueue.map(item => item.id === id ? { ...item, runnerStatus: 'delivered' } : item));
    alert(`Đã hoàn tất trả món cho lượt chạy "${id}"! Thẻ được xóa khỏi hàng chờ mPOS.`);
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* VIEW 1: TABLE MAP */}
      {activeTab === 'staff-tables' && (
        <div>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#F8FAFC' }}>Sơ Đồ Bàn Phục Vụ & Quản Lý Trạng Thái Realtime</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>Phục vụ: Trần Thanh Tâm | Ca làm việc: Ca Sáng (07:00 - 15:00)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {tables.map((t) => (
              <div key={t.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', background: '#1E293B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#F8FAFC', fontSize: '18px', fontWeight: 'bold' }}>{t.name}</h3>
                    <span style={{ fontSize: '12px', background: '#0F172A', color: '#94A3B8', padding: '2px 6px', borderRadius: '4px' }}>{t.zone}</span>
                  </div>
                  <div style={{ fontSize: '13px', margin: '6px 0' }}>
                    {t.status === 'occupied' && <span style={{ color: '#EF4444', fontWeight: 'bold' }}>Đang Có Khách ({t.itemsCount} món)</span>}
                    {t.status === 'empty' && <span style={{ color: '#10B981', fontWeight: 'bold' }}>Bàn Trống (Sẵn sàng)</span>}
                    {t.status === 'dirty' && <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>Cần Dọn Bàn</span>}
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  {t.status === 'dirty' && (
                    <button onClick={() => handleCleanTable(t.id)} style={{ width: '100%', padding: '6px 12px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Đã Dọn Xong</button>
                  )}
                  {t.status === 'occupied' && (
                    <button onClick={() => alert(`Mở menu gọi thêm món cho ${t.name}`)} style={{ width: '100%', padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Gọi Món Thêm</button>
                  )}
                  {t.status === 'empty' && (
                    <button onClick={() => alert(`Mở bàn mới tại ${t.name}`)} style={{ width: '100%', padding: '6px 12px', background: '#0F172A', color: '#F8FAFC', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}>Mở Bàn Khách</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: RUNNER QUEUE */}
      {activeTab === 'staff-runner' && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#F8FAFC', fontWeight: 'bold' }}>Hàng Chờ Trả Món mPOS Runner Queue (Đồng Bộ WebSocket)</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>Khi Bếp/Bar hoàn tất chế biến, món sẽ lập tức hiện thẻ báo rung cho phục vụ chạy bàn.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {runnerQueue.filter(r => r.runnerStatus !== 'delivered').map((item) => (
              <div key={item.id} style={{ border: '2px solid #10B981', background: '#0F172A', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981' }}>{item.table}</span>
                  <span style={{ fontSize: '12px', background: '#065F46', color: '#A7F3D0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>BẾP ĐÃ XONG</span>
                </div>
                <h3 style={{ margin: '4px 0', fontSize: '16px', color: '#F8FAFC' }}>{item.quantity}x {item.itemName}</h3>
                <div style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 14px 0' }}>Trạm: {item.prepStation} | Xong: {item.readyTime}</div>
                <button onClick={() => handleDeliverItem(item.id)} style={{ width: '100%', padding: '10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>XÁC NHẬN ĐÃ TRẢ MÓN TẠI BÀN</button>
              </div>
            ))}

            {runnerQueue.filter(r => r.runnerStatus !== 'delivered').length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: '#94A3B8', fontWeight: 'bold' }}>Hiện không có món nào đang chờ trả tại bàn.</div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: ATTENDANCE */}
      {activeTab === 'staff-attendance' && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#F8FAFC', fontWeight: 'bold' }}>Chấm Công Wifi BSSID Geofencing</h2>
          <div style={{ background: '#0F172A', border: '1px solid #334155', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: '#F8FAFC' }}>Địa chỉ BSSID Wi-Fi hiện tại: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{checkInWifi.bssid}</strong></div>
            <div style={{ fontSize: '14px', color: '#10B981', fontWeight: 'bold', marginTop: '6px' }}>Trạng Thái: ĐÃ XÁC THỰC BSSID HỢP LỆ CHI NHÁNH QUẬN 1</div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Thời gian Check-in mở ca: {checkInWifi.checkInTime}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRunnerPage;
