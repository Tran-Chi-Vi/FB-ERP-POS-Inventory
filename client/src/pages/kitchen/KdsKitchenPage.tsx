import React, { useState } from 'react';

export const KdsKitchenPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'ticket' | 'batch' | '86list'>('ticket');

  const tickets = [
    { id: '1', table: 'Bàn 01', type: 'Ăn Tại Quán', staff: 'Trần Thanh Tâm', elapsed: '03:45', status: 'Green', items: [{ name: 'Cà Phê Sữa Đá', mod: '50% Đường, 100% Đá, Thêm Thạch Đào' }] },
    { id: '2', table: 'Đơn #ORD-108', type: 'Mang Đi (Takeaway)', staff: 'Thu Ngân 01', elapsed: '08:20', status: 'Yellow', items: [{ name: 'Trà Sữa Ô Long', mod: '30% Đường, Không Đá' }] },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2>KDS Kitchen Display System (Trạm Bar 01)</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Màn hình chế biến cảm ứng 21-inch. Nền tối tương phản cao, không có giá tiền.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`category-btn ${viewMode === 'ticket' ? 'active' : ''}`} onClick={() => setViewMode('ticket')}>
            Xem Theo Đơn (Tickets)
          </button>
          <button className={`category-btn ${viewMode === 'batch' ? 'active' : ''}`} onClick={() => setViewMode('batch')}>
            Gom Món Nhanh (Smart Batch)
          </button>
          <button className={`category-btn ${viewMode === '86list' ? 'active' : ''}`} onClick={() => setViewMode('86list')}>
            Khóa Món (86 List)
          </button>
        </div>
      </div>

      {viewMode === 'ticket' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {tickets.map(t => (
            <div key={t.id} style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '0.75rem', borderLeft: `6px solid ${t.status === 'Green' ? '#10b981' : t.status === 'Yellow' ? '#f59e0b' : '#f43f5e'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{t.table}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.type} • NV: {t.staff}</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: t.status === 'Green' ? '#10b981' : '#f59e0b' }}>
                  ⏱️ {t.elapsed}
                </span>
              </div>

              <div style={{ margin: '1rem 0' }}>
                {t.items.map((i, idx) => (
                  <div key={idx} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{i.name}</div>
                    <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 'bold' }}>↳ Modifier: {i.mod}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '0.6rem' }} onClick={() => alert('Đã chuyển đơn sang trạng thái Ready (Xong món)!')}>
                  Bấm Nấu Xong (Ready)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'batch' && (
        <div className="card">
          <h2>Chế Độ Gom Món Nhanh (Smart Batch Cooking View)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Pha chế 1 mẻ lớn cho nhiều đơn cùng lúc để tối ưu thời gian.</p>
          <ul style={{ fontSize: '1.2rem', lineHeight: '2.2', marginTop: '1rem' }}>
            <li>🥤 <strong>Cà Phê Sữa Đá:</strong> Tổng nợ 5 ly (Bàn 01: 2 ly, Bàn 04: 1 ly, Đơn #ORD-108: 2 ly)</li>
            <li>🍑 <strong>Trà Đào Cam Sả:</strong> Tổng nợ 3 ly (Bàn 03: 1 ly, VIP 01: 2 ly)</li>
          </ul>
        </div>
      )}

      {viewMode === '86list' && (
        <div className="card">
          <h2>Khóa Món Tức Thì (86 List Out-of-Stock Trigger)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Đầu bếp bấm 1 chạm để tạm ngừng nhận món, tự động đồng bộ ẩn món trên mã QR khách và POS trong 3 giây.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{ padding: '0.75rem 1.25rem', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('Đã ẩn món Cà Phê Trứng trên toàn hệ thống!')}>
              🔴 Báo Hết: Cà Phê Trứng
            </button>
            <button style={{ padding: '0.75rem 1.25rem', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('Đã ẩn món Bánh Tiramisu trên toàn hệ thống!')}>
              🔴 Báo Hết: Bánh Tiramisu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
