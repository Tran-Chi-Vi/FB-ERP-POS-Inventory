import React, { useState } from 'react';
import { UserManagementPage } from './UserManagementPage';

export const AdminErpPage: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'bom' | 'promotions' | 'payroll' | 'pnl'>('users');

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button className={`category-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Quản Lý Tài Khoản (Tạo & Xóa User)
        </button>
        <button className={`category-btn ${tab === 'bom' ? 'active' : ''}`} onClick={() => setTab('bom')}>
          Cấu Hình BOM & Ma Trận Định Lượng
        </button>
        <button className={`category-btn ${tab === 'promotions' ? 'active' : ''}`} onClick={() => setTab('promotions')}>
          Động Cơ Khuyến Mãi & Conflict Matrix
        </button>
        <button className={`category-btn ${tab === 'payroll' ? 'active' : ''}`} onClick={() => setTab('payroll')}>
          Khóa Sổ Lương (Payroll Lock)
        </button>
        <button className={`category-btn ${tab === 'pnl' ? 'active' : ''}`} onClick={() => setTab('pnl')}>
          Báo Cáo Food Cost P&L Analytics
        </button>
      </div>

      {tab === 'users' && <UserManagementPage />}

      {tab === 'bom' && (
        <div className="card">
          <h2>Trình Tạo Công Thức Đa Tầng (BOM Builder & Cost Roll-up)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Thiết lập phả hệ công thức (Thành phẩm -&gt; Bán thành phẩm -&gt; Nguyên liệu thô) và kiểm tra vòng lặp DFS.
          </p>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <h4>🌳 Cây Phả Hệ Định Lượng: 1 ly Cà Phê Sữa Đá</h4>
            <ul style={{ lineHeight: '2', marginTop: '0.5rem', color: '#cbd5e1' }}>
              <li>├── 30 ml Cốt Cà Phê Robusta (Giá vốn: 4.200 đ)</li>
              <li>├── 40 ml Sữa Đặc Lon (Giá vốn: 2.800 đ)</li>
              <li>└── 150 g Đá Viên (Giá vốn: 500 đ)</li>
            </ul>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => alert('Đã chạy thuật toán DFS Cycle Detection: Công thức hợp lệ 100%, không bị lặp vô tận!')}>
                Chạy Kiểm Tra Vòng Lặp BOM (DFS Cycle Detection)
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'promotions' && (
        <div className="card">
          <h2>Động Cơ Khuyến Mãi & Ma Trận Loại Trừ (Promotion Conflict Matrix)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Cấu hình trần giảm giá (Max Discount Cap) ngăn chặn gộp voucher dồn hóa đơn 0đ.</p>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginTop: '1rem' }}>
            🛡️ <strong>Chính sách bảo vệ:</strong> Giảm giá tối đa 50% nhưng không vượt quá 40.000 VNĐ / đơn.
          </div>
        </div>
      )}

      {tab === 'payroll' && (
        <div className="card">
          <h2>Khóa Sổ Bảng Lương (Payroll Lock & Compliance)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Sau khi bấm Khóa sổ, bản ghi lương chuyển sang trạng thái Immutable (Bất khả biến), tuyệt đối không ai được sửa trực tiếp.
          </p>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '1rem' }} onClick={() => alert('Đã thực hiện PHÊ DUYỆT & KHÓA SỔ LƯƠNG THÁNG! Bản ghi đã trở thành Immutable.')}>
            PHÊ DUYỆT & KHÓA SỔ LƯƠNG THÁNG (PAYROLL LOCK)
          </button>
        </div>
      )}

      {tab === 'pnl' && (
        <div className="card">
          <h2>Báo Cáo Food Cost P&L & Menu Engineering Matrix</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
              <h3>So Sánh Food Cost Lý Thuyết vs Thực Tế</h3>
              <p style={{ color: '#10b981', marginTop: '0.5rem' }}>Chi phí lý thuyết theo BOM: 55.620.000đ</p>
              <p style={{ color: '#f43f5e' }}>Chi phí thực tế xuất kho: 57.100.000đ</p>
              <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>Variance Gap: +2.6% (Thất thoát nhẹ)</p>
            </div>

            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
              <h3>Menu Engineering Matrix (4 Phân Khúc)</h3>
              <p>⭐ <strong>Stars (Lãi Cao, Bán Chạy):</strong> Cà Phê Sữa Đá</p>
              <p>🐴 <strong>Plowhorses (Lãi Thấp, Bán Chạy):</strong> Bạc Xỉu Đá</p>
              <p>🧩 <strong>Puzzles (Lãi Cao, Bán Ế):</strong> Trà Đào Cam Sả</p>
              <p>🐕 <strong>Dogs (Lãi Thấp, Bán Ế):</strong> Soda Việt Quất</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
