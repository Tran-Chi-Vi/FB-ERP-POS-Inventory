import React from 'react';

interface WarehousePageProps {
  activeTab: string;
}

export const WarehousePage: React.FC<WarehousePageProps> = ({ activeTab }) => {
  return (
    <div>
      {/* 1. NHẬP HÀNG */}
      {activeTab === 'wh-receipt' && (
        <div className="card">
          <h2>Mua Hàng & Nhập Kho (Procurement & Goods Receipt)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Tạo PO, quét mã vạch Barcode bao bì, gán ngày sản xuất (MFG) & HSD (EXP) sinh mã Lô Batch và upload hóa đơn đỏ lên MinIO Storage.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label>Mã Nhà Cung Cấp</label>
              <input type="text" className="form-control" defaultValue="NCC-VINACAFE" />
            </div>
            <div className="form-group">
              <label>Nguyên Liệu Nhập</label>
              <input type="text" className="form-control" defaultValue="Hạt Cà Phê Robusta (50 kg)" />
            </div>
            <div className="form-group">
              <label>Ngày Sản Xuất (MFG)</label>
              <input type="date" className="form-control" defaultValue="2026-08-01" />
            </div>
            <div className="form-group">
              <label>Hạn Sử Dụng (EXP)</label>
              <input type="date" className="form-control" defaultValue="2027-01-15" />
            </div>
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '1rem' }} onClick={() => alert('Xác nhận nhập kho! Đã sinh bút toán Append-Only InventoryTransaction (Type: GoodsReceipt).')}>
            Xác Nhận Nhập Kho & Upload Hóa Đơn (MinIO)
          </button>
        </div>
      )}

      {/* 2. FEFO BATCH CONTROL */}
      {activeTab === 'wh-fefo' && (
        <div className="card">
          <h2>Bảng Theo Dõi Lô Hạn Sử Dụng (FEFO Control)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Hệ thống tự động ưu chỉ định xuất kho lô gần hết hạn nhất (First Expired, First Out).</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Số Lô (Batch#)</th>
                <th style={{ padding: '0.75rem' }}>Nguyên Liệu</th>
                <th style={{ padding: '0.75rem' }}>Số Lượng Tồn</th>
                <th style={{ padding: '0.75rem' }}>Hạn Sử Dụng</th>
                <th style={{ padding: '0.75rem' }}>Trạng Thái FEFO</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>BAT-202608-01</td>
                <td style={{ padding: '0.75rem' }}>Sữa Tươi Thanh Trùng 1L</td>
                <td style={{ padding: '0.75rem' }}>30 Hộp</td>
                <td style={{ padding: '0.75rem', color: '#f43f5e' }}>2026-09-02 (Còn 5 ngày)</td>
                <td style={{ padding: '0.75rem', color: '#f43f5e', fontWeight: 'bold' }}>Cận Date (Ưu Tiên Xuất Hàng Đầu Tiên)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PRODUCTION ORDER */}
      {activeTab === 'wh-production' && (
        <div className="card">
          <h2>Lệnh Chế Biến Sơ Chế Bán Thành Phẩm (Production Order & Yield Variance)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Nấu sẵn bán thành phẩm (Siro Đào, Thạch Trân Châu) và đối soát hao hụt sản xuất.</p>
          <ul style={{ marginTop: '1.25rem', lineHeight: '2' }}>
            <li>Lệnh PO-PREP-05: Nấu 10 Lít Siro Đào Nhà Làm</li>
            <li>Hao hụt sản xuất (Yield Variance): Lý thuyết 10L - Thực tế 9L = <span style={{ color: '#f59e0b' }}>-10% hao hụt bốc hơi</span></li>
          </ul>
        </div>
      )}

      {/* 4. STOCK COUNT */}
      {activeTab === 'wh-stockcount' && (
        <div className="card">
          <h2>Phiên Kiểm Kê Kho & Phiếu Xuất Hủy (Stock Count & Waste)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Chụp Snapshot tồn kho hệ thống và gửi phiếu kiểm kê đếm thực tế lên Quản lý duyệt.</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.25rem', marginTop: '1rem' }} onClick={() => alert('Đã tạo phiên kiểm kê kho và khóa snapshot số liệu sổ sách!')}>
            Tạo Phiên Kiểm Kê Mới (Chụp Snapshot)
          </button>
        </div>
      )}
    </div>
  );
};
