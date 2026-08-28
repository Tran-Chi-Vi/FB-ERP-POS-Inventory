import React from 'react';

interface StaffRunnerPageProps {
  activeTab: string;
}

export const StaffRunnerPage: React.FC<StaffRunnerPageProps> = ({ activeTab }) => {
  const readyItems = [
    { id: '1', table: 'Bàn 01', item: '2x Cà Phê Sữa Đá', station: 'Bar 01', elapsed: '01:15' },
    { id: '2', table: 'Bàn 03', item: '1x Trà Đào Cam Sả', station: 'Bar 01', elapsed: '00:45' },
  ];

  return (
    <div>
      {/* 1. HÀNG ĐỢI TRẢ MÓN */}
      {activeTab === 'staff-runner' && (
        <div className="card">
          <h2>Danh Sách Món Cần Bưng Ra Bàn (Runner Queue)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Nhận tín hiệu từ trạm bếp/bar khi món đã nấu xong để bưng ra cho khách.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {readyItems.map(i => (
              <div key={i.id} style={{ padding: '1.25rem', background: '#0f172a', borderLeft: '4px solid #10b981', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#10b981' }}>{i.table}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Xong cách đây: {i.elapsed}</span>
                </div>
                <p style={{ margin: '0.75rem 0', fontSize: '1.05rem', fontWeight: 'bold' }}>{i.item}</p>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => alert(`Đã cập nhật trạng thái món '${i.item}' sang Served (Đã phục vụ)!`)}>
                  Đã Bưng Ra Bàn (Served)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SOI TRẠNG THÁI BẾP (READ-ONLY) */}
      {activeTab === 'staff-kitchen-status' && (
        <div className="card">
          <h2>Soi Trạng Thái Bếp Trực Tiếp (Read-Only Monitoring)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Nhân viên phục vụ xem tiến độ bếp nấu để trả lời khách giục, tuyệt đối KHÔNG có quyền bấm thay trạng thái của bếp.
          </p>
          <ul style={{ lineHeight: '2', marginTop: '1.25rem' }}>
            <li>Bàn 02 - 2x Bạc Xỉu: Đang chế biến (Preparing - Trạm Bar 01)</li>
            <li>VIP 01 - 1x Tiramisu: Chờ nhận đơn (Pending - Bếp Nóng)</li>
          </ul>
        </div>
      )}

      {/* 3. TỰ CHẤM CÔNG SELFIE WIFI */}
      {activeTab === 'staff-checkin' && (
        <div className="card" style={{ maxWidth: '480px' }}>
          <h2>Chấm Công Selfie WiFi Chống Gian Lận</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Tự động kiểm tra BSSID mạng WiFi nội bộ quán + Hardware Device ID.</p>
          <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#0f172a', border: '2px dashed #10b981', margin: '1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Khung Camera Selfie
          </div>
          <button className="btn-primary" onClick={() => alert('Check-in ca làm việc thành công trên WiFi quán!')}>
            Xác Nhận Check-In
          </button>
        </div>
      )}
    </div>
  );
};
