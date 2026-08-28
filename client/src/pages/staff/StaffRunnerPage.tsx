import React, { useState } from 'react';

interface TableStatus {
  id: string;
  name: string;
  area: string;
  status: 'empty' | 'occupied' | 'waiting_payment' | 'delayed';
  seatedMinutes: number;
  currentOrderTotal: number;
}

export const StaffRunnerPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'runner' | 'attendance'>('tables');
  const [selectedTable, setSelectedTable] = useState<TableStatus | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [transferTarget] = useState<string>('');

  const [tables] = useState<TableStatus[]>([
    { id: 'T01', name: 'Bàn 01', area: 'Tầng 1', status: 'occupied', seatedMinutes: 12, currentOrderTotal: 145000 },
    { id: 'T02', name: 'Bàn 02', area: 'Tầng 1', status: 'empty', seatedMinutes: 0, currentOrderTotal: 0 },
    { id: 'T03', name: 'Bàn 03', area: 'Tầng 1', status: 'delayed', seatedMinutes: 24, currentOrderTotal: 85000 },
    { id: 'T04', name: 'Bàn 04', area: 'Sân Vườn', status: 'waiting_payment', seatedMinutes: 45, currentOrderTotal: 210000 },
    { id: 'T05', name: 'Bàn 05', area: 'Sân Vườn', status: 'occupied', seatedMinutes: 8, currentOrderTotal: 90000 },
  ]);

  const [runnerQueue, setRunnerQueue] = useState([
    { id: 'R-101', table: 'Bàn 04', item: 'Cà Phê Sữa Đá Sài Gòn (x2)', readyTime: '2 phút trước', note: 'Nhiều đá, 100% đường' },
    { id: 'R-102', table: 'Bàn 01', item: 'Bánh Tiramisu Ý (x1)', readyTime: 'Vừa xong', note: 'Kèm dĩa nhỏ' },
  ]);

  const getStatusColor = (status: TableStatus['status']) => {
    switch (status) {
      case 'empty': return '#9CA3AF';
      case 'occupied': return '#2563EB';
      case 'delayed': return '#EF4444';
      case 'waiting_payment': return '#F59E0B';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Page Title Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>Màn Hình Phục Vụ mPOS & Bàn Ăn Realtime</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>Nhân viên: Trần Thanh Tâm (EMP001) | Ca Sáng (07:00 - 15:00)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 'bold' }}>WiFi Check-in: a4:b2:c8:99:11:00 (Hợp lệ)</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>Thiết bị: Handheld Tablet #DEV-TAB-01</div>
        </div>
      </div>

      {/* Dynamic Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
        <button onClick={() => setActiveSubTab('tables')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'tables' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'tables' ? '#2563EB' : '#4B5563' }}>Sơ Đồ Bàn Ăn & mPOS</button>
        <button onClick={() => setActiveSubTab('runner')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'runner' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'runner' ? '#2563EB' : '#4B5563' }}>Hàng Đợi Trả Món Ready ({runnerQueue.length})</button>
        <button onClick={() => setActiveSubTab('attendance')} style={{ padding: '10px 18px', fontWeight: 'bold', border: 'none', borderBottom: activeSubTab === 'attendance' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeSubTab === 'attendance' ? '#2563EB' : '#4B5563' }}>Selfie WiFi Chấm Công</button>
      </div>

      {/* Sub Tab 1: Interactive Table Map */}
      {activeSubTab === 'tables' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {tables.map((tbl) => (
              <div 
                key={tbl.id} 
                onClick={() => setSelectedTable(tbl)}
                style={{ 
                  border: `2px solid ${getStatusColor(tbl.status)}`, 
                  borderRadius: '8px', 
                  padding: '16px', 
                  background: '#fff', 
                  cursor: 'pointer',
                  boxShadow: selectedTable?.id === tbl.id ? '0 0 0 3px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{tbl.area}</span>
                  {tbl.seatedMinutes > 20 && <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Chờ lâu ({tbl.seatedMinutes}m)</span>}
                </div>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>{tbl.name}</h3>
                <div style={{ fontSize: '13px', color: getStatusColor(tbl.status), fontWeight: 'bold' }}>
                  {tbl.status === 'empty' && 'Trống'}
                  {tbl.status === 'occupied' && 'Đang có khách'}
                  {tbl.status === 'delayed' && 'Cảnh báo trễ order'}
                  {tbl.status === 'waiting_payment' && 'Chờ thanh toán'}
                </div>
                {tbl.currentOrderTotal > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '15px', fontWeight: 'bold', color: '#059669' }}>
                    {tbl.currentOrderTotal.toLocaleString('vi-VN')}đ
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Table Operations Modal/Panel */}
          {selectedTable && (
            <div style={{ background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0 }}>Thao Tác Trên {selectedTable.name} ({selectedTable.area})</h3>
              <p style={{ fontSize: '14px', color: '#4B5563' }}>Thời gian ngồi: <strong>{selectedTable.seatedMinutes} phút</strong> | Giá trị đơn hiện tại: <strong>{selectedTable.currentOrderTotal.toLocaleString('vi-VN')}đ</strong></p>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '16px 0' }}>
                <button onClick={() => alert(`Đã mở giao diện gọi món mPOS cho ${selectedTable.name}`)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Thêm Món Vào Bàn</button>
                <button onClick={() => alert(`Đã chuyển ${selectedTable.name} sang ${transferTarget || 'Bàn 02'}`)} style={{ padding: '10px 18px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Chuyển Bàn Sang Bàn 02</button>
                <button onClick={() => alert(`Đã gộp đơn ${selectedTable.name} vào Bàn 04`)} style={{ padding: '10px 18px', background: '#D97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Gộp Vào Bàn 04</button>
                <button onClick={() => alert('Đã gửi yêu cầu in tạm tính xuống máy in thu ngân!')} style={{ padding: '10px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>In Phiếu Tạm Tính</button>
              </div>

              {/* Staff Tip Addition */}
              <div style={{ marginTop: '16px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #E5E7EB', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Tiền Tip Phục Vụ (Tip Reward):</label>
                <input type="number" value={tipAmount} onChange={(e) => setTipAmount(Number(e.target.value))} placeholder="Nhập số tiền tip" style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', width: '150px' }} />
                <button onClick={() => alert(`Ghi nhận Tiền Tip ${tipAmount.toLocaleString('vi-VN')}đ!`)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ghi Nhận Tip</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab 2: Runner Queue */}
      {activeSubTab === 'runner' && (
        <div>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Hàng Đợi Trả Món Ready Bếp (SignalR Realtime)</h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Các món bếp đã chế biến xong cần được nhân viên mang ra bàn cho khách ngay lập tức.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {runnerQueue.map((item) => (
              <div key={item.id} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.table}</span>
                  <h3 style={{ margin: '4px 0', fontSize: '18px', color: '#065F46' }}>{item.item}</h3>
                  <div style={{ fontSize: '13px', color: '#047857' }}>Ghi chú: {item.note} | Xong lúc: {item.readyTime}</div>
                </div>
                <button onClick={() => setRunnerQueue(runnerQueue.filter(r => r.id !== item.id))} style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ĐÃ MANG RA BÀN</button>
              </div>
            ))}

            {runnerQueue.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Không có món nào đang chờ trả ra bàn.</div>
            )}
          </div>
        </div>
      )}

      {/* Sub Tab 3: Attendance */}
      {activeSubTab === 'attendance' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Selfie WiFi BSSID Check-in Chống Gian Lận</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ width: '100%', height: '200px', background: '#374151', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '16px' }}>
                [ MÀN HÌNH CAMERA SELFIE VIEW ]
              </div>
              <button onClick={() => alert('Đã chụp ảnh selfie và đối soát thành công!')} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Chụp Ảnh Selfie Xóa Vết</button>
            </div>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ marginTop: 0 }}>Thông Tin Xác Thực Mạng:</h3>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Mạng WiFi Kết Nối: <strong>FnB_Store_Quoc_1</strong></li>
                <li>Địa Chỉ BSSID: <strong style={{ color: '#059669' }}>a4:b2:c8:99:11:00 (KÍCH HOẠT HỢP LỆ)</strong></li>
                <li>Device Identifier: <strong>DEV-TAB-01 (Đúng máy được giao)</strong></li>
                <li>Thời gian Check-in: <strong>07:02:14 AM (Đúng giờ)</strong></li>
              </ul>
              <button style={{ width: '100%', padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }}>XÁC NHẬN VÀO CA LÀM VIỆC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRunnerPage;
