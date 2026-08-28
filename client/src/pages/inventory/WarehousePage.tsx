import React, { useState } from 'react';

interface WarehousePageProps {
  activeTab: string;
}

interface FefoBatch {
  batchNumber: string;
  productName: string;
  mfgDate: string;
  expDate: string;
  quantity: number;
  status: 'active' | 'warning' | 'expired';
}

export const WarehousePage: React.FC<WarehousePageProps> = ({ activeTab }) => {
  const [batches] = useState<FefoBatch[]>([
    { batchNumber: 'LOT-20260820-001', productName: 'Sữa Tươi Tiệt Trùng 1L', mfgDate: '2026-08-20', expDate: '2026-09-02', quantity: 45, status: 'warning' },
    { batchNumber: 'LOT-20260825-002', productName: 'Syrup Đào Monin 700ml', mfgDate: '2026-08-25', expDate: '2027-08-25', quantity: 120, status: 'active' },
    { batchNumber: 'LOT-20260801-099', productName: 'Bánh Tiramisu Tươi', mfgDate: '2026-08-01', expDate: '2026-08-10', quantity: 5, status: 'expired' },
  ]);

  const [transfers] = useState([
    { id: 'TRF-881', fromBranch: 'Chi Nhánh Quận 1', toBranch: 'Chi Nhánh Quận 3', item: 'Hạt Cà Phê Robusta (20kg)', status: 'In-Transit', transferDate: '2026-08-28' }
  ]);

  const [suppliers] = useState([
    { id: 'SUP-01', name: 'Công Ty Cổ Phần Nguyên Liệu F&B Việt Nam', contact: '0909112233', leadTimeDays: 2, qualityScore: 98, status: 'Active' },
    { id: 'SUP-02', name: 'Nhà Phân Phối Sữa Tươi Vinamilk', contact: '0908889900', leadTimeDays: 1, qualityScore: 99, status: 'Active' }
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* VIEW 1: REALTIME INVENTORY */}
      {activeTab === 'wh-inventory' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Danh Sách Nguyên Liệu & Sản Phẩm Trong Kho</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Kho Chi Nhánh: Chi Nhánh Quận 1 (Flagship) | Tổng Giá Trị Tồn Kho: 148.500.000đ</p>
            </div>
            <button onClick={() => alert('Đã sinh gợi ý đơn mua hàng PO 1-Click cho nguyên liệu chạm định mức Par-Level!')} style={{ padding: '8px 16px', background: '#D97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tự Động Tạo PO Par-Level 1-Click</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã SKU</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Nguyên Liệu / Sản Phẩm</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Đơn Vị</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tồn Sổ Sách</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Giá Vốn Đơn Vị</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Định Mức Tồn (Par Level)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái Tồn</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>RAW-001</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>Hạt Cà Phê Robusta Chế Biến</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>Kg</td>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>85.0 kg</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>180.000đ</td>
                <td style={{ padding: '14px 12px', color: '#4B5563' }}>Min: 20kg | Max: 100kg</td>
                <td style={{ padding: '14px 12px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Tồn Kho An Toàn</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>RAW-002</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>Sữa Tươi Tiệt Trùng 1L</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>Hộp</td>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#DC2626' }}>12.0 hộp</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>32.000đ</td>
                <td style={{ padding: '14px 12px', color: '#4B5563' }}>Min: 30 hộp | Max: 150 hộp</td>
                <td style={{ padding: '14px 12px' }}><span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>DƯỚI PAR LEVEL (CẦN MUA PO)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: FEFO BATCH TRACKER */}
      {activeTab === 'wh-fefo' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Theo Dõi Hạn Sử Dụng Lô Hàng (FEFO - First Expired, First Out)</h2>
          <p style={{ color: '#4B5563', fontSize: '14px' }}>Hệ thống tự động sắp xếp ưu tiên xuất các lô hàng có ngày hết hạn gần nhất trước.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Lô Batch</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Sản Phẩm</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Ngày Sản Xuất (MFG)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Hạn Sử Dụng (EXP)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Số Lượng Lô</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái Lô FEFO</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.batchNumber} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{b.batchNumber}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{b.productName}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{b.mfgDate}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: b.status === 'warning' ? '#D97706' : b.status === 'expired' ? '#DC2626' : '#059669' }}>{b.expDate}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{b.quantity}</td>
                  <td style={{ padding: '14px 12px' }}>
                    {b.status === 'active' && <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>}
                    {b.status === 'warning' && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>CẬN DATE (DƯỚI 7 NGÀY)</span>}
                    {b.status === 'expired' && <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>HẾT HẠN (KHÓA XUẤT)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: GOODS RECEIPT */}
      {activeTab === 'wh-receipt' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Lập Phiếu Nhập Kho Goods Receipt & Sinh Mã Lô FEFO</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Đã hoàn tất phiếu nhập kho và đẩy ảnh chứng từ lên MinIO S3 Object Storage!'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Chọn Nhà Cung Cấp:</label>
                <select style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                  <option>Công Ty Cổ Phần Nguyên Liệu F&B Việt Nam</option>
                  <option>Nhà Phân Phối Sữa Tươi Vinamilk</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tự Sinh Mã Lô Batch:</label>
                <input type="text" value="LOT-20260828-991" readOnly style={{ width: '100%', padding: '8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 'bold', color: '#111827' }} />
              </div>
            </div>

            <button type="submit" style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>XÁC NHẬN NHẬP KHO GHI SỔ CÁI</button>
          </form>
        </div>
      )}

      {/* VIEW 4: INTER-BRANCH TRANSFER */}
      {activeTab === 'wh-transfer' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Điều Chuyển Nguyên Liệu Giữa Các Chi Nhánh</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Lệnh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Kho Xuất</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Kho Nhận</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Nguyên Liệu</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{t.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{t.fromBranch}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{t.toBranch}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{t.item}</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 5: SUPPLIER SRM */}
      {activeTab === 'wh-srm' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Danh Bạ Nhà Cung Cấp SRM (Supplier Relationship Management)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã NCC</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Nhà Cung Cấp</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Số Điện Thoại</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Lead Time</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Chất Lượng</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{s.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{s.name}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{s.contact}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{s.leadTimeDays} ngày</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{s.qualityScore}/100 Điểm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
