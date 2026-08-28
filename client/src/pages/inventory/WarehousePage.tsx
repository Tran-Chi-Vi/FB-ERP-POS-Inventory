import React, { useState } from 'react';

interface FefoBatch {
  batchNumber: string;
  productName: string;
  mfgDate: string;
  expDate: string;
  quantity: number;
  status: 'active' | 'warning' | 'expired';
}

export const WarehousePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'fefo' | 'receipt' | 'transfer' | 'srm'>('inventory');
  
  // FEFO Batches State
  const [batches] = useState<FefoBatch[]>([
    { batchNumber: 'LOT-20260820-001', productName: 'Sữa Tươi Tiệt Trùng 1L', mfgDate: '2026-08-20', expDate: '2026-09-02', quantity: 45, status: 'warning' }, // Cận date < 7d
    { batchNumber: 'LOT-20260825-002', productName: 'Syrup Đào Monin 700ml', mfgDate: '2026-08-25', expDate: '2027-08-25', quantity: 120, status: 'active' },
    { batchNumber: 'LOT-20260801-099', productName: 'Bánh Tiramisu Tươi', mfgDate: '2026-08-01', expDate: '2026-08-10', quantity: 5, status: 'expired' },
  ]);

  // Inter-Branch Transfers
  const [transfers] = useState([
    { id: 'TRF-881', fromBranch: 'Chi Nhánh Quận 1', toBranch: 'Chi Nhánh Quận 3', item: 'Hạt Cà Phê Robusta (20kg)', status: 'In-Transit', transferDate: '2026-08-28' }
  ]);

  // Supplier Directory (SRM)
  const [suppliers] = useState([
    { id: 'SUP-01', name: 'Công Ty Cổ Phần Nguyên Liệu F&B Việt Nam', contact: '0909112233', leadTimeDays: 2, qualityScore: 98, status: 'Active' },
    { id: 'SUP-02', name: 'Nhà Phân Phối Sữa Tươi Vinamilk', contact: '0908889900', leadTimeDays: 1, qualityScore: 99, status: 'Active' }
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ background: '#1F2937', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ background: '#D97706', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>ROLE: THỦ KHO (WAREHOUSE KEEPER)</span>
          <h1 style={{ margin: '8px 0 4px 0', fontSize: '24px' }}>Quản Lý Kho Hàng & Sổ Cái Tồn Kho Append-Only</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>Kho Chi Nhánh: <strong>Chi Nhánh Quận 1 (Flagship)</strong> | Sổ cái kho: FEFO Enabled</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#10B981' }}>Tổng giá trị tồn kho: <strong>148.500.000đ</strong></div>
          <div style={{ fontSize: '13px', color: '#F59E0B' }}>Lô cận hạn (Dưới 7 ngày): <strong>1 lô (Cảnh báo)</strong></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('inventory')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'inventory' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'inventory' ? '#2563EB' : '#4B5563' }}>📦 Tồn Kho Thực Tế</button>
        <button onClick={() => setActiveTab('fefo')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'fefo' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'fefo' ? '#2563EB' : '#4B5563' }}>⏳ Bảng Theo Dõi Date Lô FEFO</button>
        <button onClick={() => setActiveTab('receipt')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'receipt' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'receipt' ? '#2563EB' : '#4B5563' }}>📥 Nhập Kho Goods Receipt (MinIO)</button>
        <button onClick={() => setActiveTab('transfer')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'transfer' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'transfer' ? '#2563EB' : '#4B5563' }}>🔄 Điều Chuyển Kho Chi Nhánh</button>
        <button onClick={() => setActiveTab('srm')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'srm' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'srm' ? '#2563EB' : '#4B5563' }}>🏬 Danh Bạ Nhà Cung Cấp SRM</button>
      </div>

      {/* Tab 1: Realtime Inventory */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Danh Sách Nguyên Liệu & Sản Phẩm Trong Kho</h2>
            <button onClick={() => alert('Đã sinh gợi ý đơn mua hàng PO 1-Click cho nguyên liệu chạm định mức Par-Level!')} style={{ padding: '8px 16px', background: '#D97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⚡ Tự Động Tạo PO Par-Level 1-Click</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã SKU</th>
                <th style={{ padding: '10px' }}>Tên Nguyên Liệu / Sản Phẩm</th>
                <th style={{ padding: '10px' }}>Đơn Vị</th>
                <th style={{ padding: '10px' }}>Tồn Sổ Sách</th>
                <th style={{ padding: '10px' }}>Giá Vốn Đơn Vị</th>
                <th style={{ padding: '10px' }}>Định Mức Tồn (Par Level)</th>
                <th style={{ padding: '10px' }}>Trạng Thái Tồn</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>RAW-001</td>
                <td style={{ padding: '12px 10px' }}>Hạt Cà Phê Robusta Chế Biến 📜</td>
                <td style={{ padding: '12px 10px' }}>Kg</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>85.0 kg</td>
                <td style={{ padding: '12px 10px' }}>180.000đ</td>
                <td style={{ padding: '12px 10px' }}>Min: 20kg | Max: 100kg</td>
                <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>✓ Tồn Kho An Toàn</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>RAW-002</td>
                <td style={{ padding: '12px 10px' }}>Sữa Tươi Tiệt Trùng 1L</td>
                <td style={{ padding: '12px 10px' }}>Hộp</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#DC2626' }}>12.0 hộp</td>
                <td style={{ padding: '12px 10px' }}>32.000đ</td>
                <td style={{ padding: '12px 10px' }}>Min: 30 hộp | Max: 150 hộp</td>
                <td style={{ padding: '12px 10px' }}><span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>⚠️ DƯỚI PAR LEVEL (CẦN MUA PO)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: FEFO Batch Tracker */}
      {activeTab === 'fefo' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Theo Dõi Hạn Sử Dụng Lô Hàng (FEFO - First Expired, First Out)</h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Hệ thống tự động sắp xếp ưu tiên xuất các lô hàng có ngày hết hạn gần nhất trước.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã Lô Batch</th>
                <th style={{ padding: '10px' }}>Sản Phẩm</th>
                <th style={{ padding: '10px' }}>Ngày Sản Xuất (MFG)</th>
                <th style={{ padding: '10px' }}>Hạn Sử Dụng (EXP)</th>
                <th style={{ padding: '10px' }}>Số Lượng Lô</th>
                <th style={{ padding: '10px' }}>Trạng Thái Lô FEFO</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.batchNumber} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{b.batchNumber}</td>
                  <td style={{ padding: '12px 10px' }}>{b.productName}</td>
                  <td style={{ padding: '12px 10px' }}>{b.mfgDate}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: b.status === 'warning' ? '#D97706' : b.status === 'expired' ? '#DC2626' : '#059669' }}>{b.expDate}</td>
                  <td style={{ padding: '12px 10px' }}>{b.quantity}</td>
                  <td style={{ padding: '12px 10px' }}>
                    {b.status === 'active' && <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>}
                    {b.status === 'warning' && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>⚠️ CẬN DATE (DƯỚI 7 NGÀY)</span>}
                    {b.status === 'expired' && <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>🚫 HẾT HẠN (KHÓA XUẤT)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Goods Receipt (MinIO Attachment) */}
      {activeTab === 'receipt' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Lập Phiếu Nhập Kho Goods Receipt & Sinh Mã Lô FEFO</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Đã hoàn tất phiếu nhập kho và đẩy ảnh chứng từ lên MinIO S3 Object Storage!'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Chọn Nhà Cung Cấp:</label>
                <select style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                  <option>Công Ty Cổ Phần Nguyên Liệu F&B Việt Nam</option>
                  <option>Nhà Phân Phối Sữa Tươi Vinamilk</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Tự Sinh Mã Lô Batch:</label>
                <input type="text" value="LOT-20260828-991" readOnly style={{ width: '100%', padding: '8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 'bold' }} />
              </div>
            </div>

            <div style={{ border: '2px dashed #D1D5DB', padding: '24px', textAlign: 'center', borderRadius: '8px', marginBottom: '16px', background: '#F9FAFB' }}>
              <p style={{ margin: 0, color: '#4B5563' }}>📷 Kéo thả hoặc tải lên ảnh chứng từ / hóa đơn nhập kho đính kèm (Upload MinIO S3)</p>
              <input type="file" style={{ marginTop: '12px' }} />
            </div>

            <button type="submit" style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 XÁC NHẬN NHẬP KHO GHI SỔ CÁI</button>
          </form>
        </div>
      )}

      {/* Tab 4: Inter-Branch Transfer */}
      {activeTab === 'transfer' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Điều Chuyển Nguyên Liệu Giữa Các Chi Nhánh</h2>
            <button onClick={() => alert('Đã tạo lệnh điều chuyển kho từ Q.1 sang Q.3!')} style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Lập Lệnh Điều Chuyển Mới</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã Lệnh</th>
                <th style={{ padding: '10px' }}>Kho Xuất</th>
                <th style={{ padding: '10px' }}>Kho Nhận</th>
                <th style={{ padding: '10px' }}>Nguyên Liệu Điều Chuyển</th>
                <th style={{ padding: '10px' }}>Ngày Thực Hiện</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{t.id}</td>
                  <td style={{ padding: '12px 10px' }}>{t.fromBranch}</td>
                  <td style={{ padding: '12px 10px' }}>{t.toBranch}</td>
                  <td style={{ padding: '12px 10px' }}>{t.item}</td>
                  <td style={{ padding: '12px 10px' }}>{t.transferDate}</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Supplier Directory SRM */}
      {activeTab === 'srm' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Danh Bạ Nhà Cung Cấp SRM (Supplier Relationship Management)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã NCC</th>
                <th style={{ padding: '10px' }}>Tên Nhà Cung Cấp</th>
                <th style={{ padding: '10px' }}>Số Điện Thoại</th>
                <th style={{ padding: '10px' }}>Thời Gian Giao Hàng (Lead Time)</th>
                <th style={{ padding: '10px' }}>Đánh Giá Chất Lượng</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{s.id}</td>
                  <td style={{ padding: '12px 10px' }}>{s.name}</td>
                  <td style={{ padding: '12px 10px' }}>{s.contact}</td>
                  <td style={{ padding: '12px 10px' }}>{s.leadTimeDays} ngày</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#059669' }}>{s.qualityScore}/100 ⭐</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{s.status}</span></td>
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
