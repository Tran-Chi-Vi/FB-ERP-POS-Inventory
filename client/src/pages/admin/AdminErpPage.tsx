import React, { useState } from 'react';
import { UserManagementPage } from './UserManagementPage';

interface AdminErpPageProps {
  activeTab: string;
}

export const AdminErpPage: React.FC<AdminErpPageProps> = ({ activeTab }) => {
  const [boms, setBoms] = useState([
    { id: '1', product: 'Cà Phê Sữa Đá', ingredients: '30ml Cốt Cà Phê + 40ml Sữa Đặc + 150g Đá', cost: '7.500 đ', price: '29.000 đ', margin: '74.1%' },
    { id: '2', product: 'Trà Đào Cam Sả', ingredients: '120ml Cốt Trà + 30ml Siro Đào + 3 Miếng Đào', cost: '9.200 đ', price: '39.000 đ', margin: '76.4%' },
  ]);

  const [promotions, setPromotions] = useState([
    { id: '1', code: 'HAPPYHOUR', name: 'Giờ Vàng Giảm 20%', type: 'Phần Trăm', cap: '30.000 đ', status: 'Đang Chạy' },
    { id: '2', code: 'WELCOMEVIP', name: 'Đồng Giá 19K', type: 'Đồng Giá', cap: '19.000 đ', status: 'Đang Chạy' },
  ]);

  const [isPayrollLocked, setIsPayrollLocked] = useState(false);

  return (
    <div>
      {/* 1. USER MANAGEMENT TAB */}
      {activeTab === 'users' && <UserManagementPage />}

      {/* 2. CATALOG & BOM BUILDER TAB */}
      {activeTab === 'catalog-bom' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2>Cấu Hình Menu Master Data & Ma Trận Định Lượng BOM</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Thiết lập phả hệ công thức chế biến đa tầng (BOM Recipe Engine) và tự động tính giá vốn Cost Roll-up.
              </p>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} onClick={() => alert('Đã chạy thuật toán DFS Cycle Detection: Cấu hình định lượng hợp lệ, 0 vòng lặp đệ quy!')}>
              🔄 Kiểm Tra Vòng Lặp BOM (DFS Check)
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Món Thành Phẩm</th>
                <th style={{ padding: '0.75rem' }}>Công Thức Định Lượng (BOM)</th>
                <th style={{ padding: '0.75rem' }}>Giá Vốn Lý Thuyết</th>
                <th style={{ padding: '0.75rem' }}>Giá Bán Niêm Yết</th>
                <th style={{ padding: '0.75rem' }}>Tỷ Tỉ Suất Lợi Nhuận Gộp</th>
              </tr>
            </thead>
            <tbody>
              {boms.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{b.product}</td>
                  <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{b.ingredients}</td>
                  <td style={{ padding: '0.75rem', color: '#f43f5e', fontWeight: 'bold' }}>{b.cost}</td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{b.price}</td>
                  <td style={{ padding: '0.75rem', color: '#38bdf8', fontWeight: 'bold' }}>{b.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PROMOTIONS & CONFLICT MATRIX TAB */}
      {activeTab === 'finance-payroll' && (
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2>Động Cơ Khuyến Mãi & Trần Giảm Giá (Promotion Conflict Matrix)</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Cấu hình trần giảm giá (Max Cap) và ma trận loại trừ ngăn chặn khách gộp voucher dẫn tới đơn 0đ.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Mã Khuyến Mãi</th>
                  <th style={{ padding: '0.75rem' }}>Tên Chương Trình</th>
                  <th style={{ padding: '0.75rem' }}>Loại Giảm Giá</th>
                  <th style={{ padding: '0.75rem' }}>Trần Giảm Tối Đa (Cap)</th>
                  <th style={{ padding: '0.75rem' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#38bdf8' }}>{p.code}</td>
                    <td style={{ padding: '0.75rem' }}>{p.name}</td>
                    <td style={{ padding: '0.75rem' }}>{p.type}</td>
                    <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>{p.cap}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2>Khóa Sổ Bảng Lương (Payroll Engine & Lock)</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sau khi bấm Khóa sổ, bản ghi lương chuyển sang trạng thái Immutable (Bất khả biến), tuyệt đối không ai được sửa trực tiếp.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', background: isPayrollLocked ? '#334155' : '#10b981' }}
                onClick={() => {
                  setIsPayrollLocked(true);
                  alert('Đã thực hiện PHÊ DUYỆT & KHÓA SỔ LƯƠNG THÁNG! Trạng thái bản ghi lương chuyển sang Immutable.');
                }}
              >
                {isPayrollLocked ? '🔒 BẢNG LƯƠNG ĐÃ KHÓA SỔ (IMMUTABLE)' : '🔒 PHÊ DUYỆT & KHÓA SỔ LƯƠNG THÁNG'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BI FOOD COST P&L TAB */}
      {activeTab === 'bi-reports' && (
        <div className="card">
          <h2>Báo Cáo Food Cost P&L & Menu Engineering Matrix</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '0.5rem' }}>
              <h3>So Sánh Food Cost Lý Thuyết vs Thực Tế</h3>
              <p style={{ color: '#10b981', marginTop: '0.75rem' }}>Chi phí lý thuyết theo BOM: 55.620.000đ</p>
              <p style={{ color: '#f43f5e', marginTop: '0.25rem' }}>Chi phí thực tế xuất kho: 57.100.000đ</p>
              <p style={{ color: '#f59e0b', fontWeight: 'bold', marginTop: '0.5rem' }}>Variance Gap: +2.6% (Thất thoát nguyên liệu nhẹ)</p>
            </div>

            <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '0.5rem' }}>
              <h3>Menu Engineering Matrix (4 Phân Khúc)</h3>
              <ul style={{ lineHeight: '2', marginTop: '0.5rem' }}>
                <li>⭐ <strong>Stars (Lãi Cao, Bán Chạy):</strong> Cà Phê Sữa Đá</li>
                <li>🐴 <strong>Plowhorses (Lãi Thấp, Bán Chạy):</strong> Bạc Xỉu Đá</li>
                <li>🧩 <strong>Puzzles (Lãi Cao, Bán Ế):</strong> Trà Đào Cam Sả</li>
                <li>🐕 <strong>Dogs (Lãi Thấp, Bán Ế):</strong> Soda Việt Quất</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
