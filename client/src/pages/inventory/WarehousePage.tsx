import React, { useState } from 'react';

interface WarehousePageProps {
  activeTab: string;
}

interface InventoryItem {
  sku: string;
  name: string;
  unit: string;
  stockQty: number;
  costPrice: number;
  parMin: number;
  parMax: number;
  status: 'Normal' | 'Low';
}

interface FefoBatch {
  batchNumber: string;
  productName: string;
  mfgDate: string;
  expDate: string;
  quantity: number;
  status: 'active' | 'warning' | 'expired';
}

interface TransferOrder {
  id: string;
  fromBranch: string;
  toBranch: string;
  item: string;
  quantity: number;
  transferDate: string;
  status: 'In-Transit' | 'Received' | 'Cancelled';
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  leadTimeDays: number;
  qualityScore: number;
  status: 'Active' | 'Inactive';
}

export const WarehousePage: React.FC<WarehousePageProps> = ({ activeTab }) => {
  // 1. INVENTORY STATE
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { sku: 'RAW-001', name: 'Hạt Cà Phê Robusta Chế Biến', unit: 'Kg', stockQty: 85.0, costPrice: 180000, parMin: 20, parMax: 100, status: 'Normal' },
    { sku: 'RAW-002', name: 'Sữa Tươi Tiệt Trùng 1L', unit: 'Hộp', stockQty: 12.0, costPrice: 32000, parMin: 30, parMax: 150, status: 'Low' },
    { sku: 'RAW-003', name: 'Syrup Đào Monin 700ml', unit: 'Chai', stockQty: 24.0, costPrice: 280000, parMin: 10, parMax: 50, status: 'Normal' },
    { sku: 'RAW-004', name: 'Sữa Đặc Ngôi Sao Phương Nam', unit: 'Hộp', stockQty: 45.0, costPrice: 22000, parMin: 20, parMax: 100, status: 'Normal' }
  ]);
  const [invSearch, setInvSearch] = useState('');
  const [showAddInvModal, setShowAddInvModal] = useState(false);
  const [newInvItem, setNewInvItem] = useState({ sku: '', name: '', unit: 'Kg', stockQty: 50, costPrice: 100000, parMin: 20, parMax: 100 });
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Khai báo kiểm kê định kỳ');

  // 2. FEFO BATCH STATE
  const [batches, setBatches] = useState<FefoBatch[]>([
    { batchNumber: 'LOT-20260820-001', productName: 'Sữa Tươi Tiệt Trùng 1L', mfgDate: '2026-08-20', expDate: '2026-09-02', quantity: 45, status: 'warning' },
    { batchNumber: 'LOT-20260825-002', productName: 'Syrup Đào Monin 700ml', mfgDate: '2026-08-25', expDate: '2027-08-25', quantity: 120, status: 'active' },
    { batchNumber: 'LOT-20260801-099', productName: 'Bánh Tiramisu Tươi', mfgDate: '2026-08-01', expDate: '2026-08-10', quantity: 5, status: 'expired' }
  ]);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newBatch, setNewBatch] = useState({ batchNumber: `LOT-20260828-${Math.floor(100 + Math.random() * 900)}`, productName: 'Sữa Tươi Tiệt Trùng 1L', mfgDate: '2026-08-28', expDate: '2026-09-15', quantity: 50 });

  // 3. INTER-BRANCH TRANSFERS STATE
  const [transfers, setTransfers] = useState<TransferOrder[]>([
    { id: 'TRF-881', fromBranch: 'Chi Nhánh Quận 1', toBranch: 'Chi Nhánh Quận 3', item: 'Hạt Cà Phê Robusta (20kg)', quantity: 20, transferDate: '2026-08-28', status: 'In-Transit' },
    { id: 'TRF-880', fromBranch: 'Chi Nhánh Quận 3', toBranch: 'Chi Nhánh Quận 1', item: 'Syrup Đào Monin (5 chai)', quantity: 5, transferDate: '2026-08-27', status: 'Received' }
  ]);
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({ fromBranch: 'Chi Nhánh Quận 1', toBranch: 'Chi Nhánh Quận 3', item: 'Hạt Cà Phê Robusta (10kg)', quantity: 10 });

  // 4. SUPPLIER SRM STATE
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'SUP-01', name: 'Công Ty Cổ Phần Nguyên Liệu F&B Việt Nam', contact: '0909112233', leadTimeDays: 2, qualityScore: 98, status: 'Active' },
    { id: 'SUP-02', name: 'Nhà Phân Phối Sữa Tươi Vinamilk', contact: '0908889900', leadTimeDays: 1, qualityScore: 99, status: 'Active' }
  ]);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', leadTimeDays: 2, qualityScore: 95 });

  // Handlers for Inventory
  const handleAddInvItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvItem.sku || !newInvItem.name) return;
    const status: 'Normal' | 'Low' = newInvItem.stockQty < newInvItem.parMin ? 'Low' : 'Normal';
    setInventory([...inventory, { ...newInvItem, status }]);
    setShowAddInvModal(false);
    alert(`Đã thêm nguyên liệu mới "${newInvItem.name}" vào sổ cái tồn kho!`);
    setNewInvItem({ sku: '', name: '', unit: 'Kg', stockQty: 50, costPrice: 100000, parMin: 20, parMax: 100 });
  };

  const handleSaveStockAdjust = () => {
    if (!adjustItem) return;
    setInventory(inventory.map(item => {
      if (item.sku === adjustItem.sku) {
        const newQty = adjustItem.stockQty + adjustQty;
        const status: 'Normal' | 'Low' = newQty < item.parMin ? 'Low' : 'Normal';
        return { ...item, stockQty: newQty, status };
      }
      return item;
    }));
    alert(`Đã điều chỉnh tồn kho SKU ${adjustItem.sku} (${adjustQty > 0 ? '+' : ''}${adjustQty}). Lý do: ${adjustReason}`);
    setAdjustItem(null);
  };

  // Handlers for FEFO Batches
  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setBatches([...batches, { ...newBatch, status: 'active' }]);
    setShowAddBatchModal(false);
    alert(`Đã khai báo lô FEFO mới "${newBatch.batchNumber}"!`);
  };

  const handleLockExpiredBatch = (batchNumber: string) => {
    setBatches(batches.map(b => b.batchNumber === batchNumber ? { ...b, status: 'expired' } : b));
    alert(`Đã KHÓA XUẤT LÔ HẾT HẠN "${batchNumber}". Hệ thống tự động cập nhật cờ Hết Hàng!`);
  };

  // Handlers for Transfers
  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const trf: TransferOrder = {
      id: `TRF-${Math.floor(882 + Math.random() * 100)}`,
      ...newTransfer,
      transferDate: new Date().toISOString().split('T')[0],
      status: 'In-Transit'
    };
    setTransfers([trf, ...transfers]);
    setShowAddTransferModal(false);
    alert(`Đã khởi tạo lệnh điều chuyển kho "${trf.id}" từ ${newTransfer.fromBranch} sang ${newTransfer.toBranch}!`);
  };

  const handleConfirmReceiveTransfer = (id: string) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status: 'Received' } : t));
    alert(`Đã xác nhận NHẬN KHO THÀNH CÔNG cho lệnh điều chuyển "${id}". Tồn kho chi nhánh nhận đã được cộng tự động!`);
  };

  // Handlers for Suppliers
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const sup: Supplier = {
      id: `SUP-0${suppliers.length + 1}`,
      ...newSupplier,
      status: 'Active'
    };
    setSuppliers([...suppliers, sup]);
    setShowAddSupplierModal(false);
    alert(`Đã thêm nhà cung cấp mới "${newSupplier.name}" vào danh bạ SRM!`);
    setNewSupplier({ name: '', contact: '', leadTimeDays: 2, qualityScore: 95 });
  };

  // Filtered inventory
  const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(invSearch.toLowerCase()) || item.sku.toLowerCase().includes(invSearch.toLowerCase()));

  return (
    <div style={{ padding: '24px', maxWidth: '1150px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: REALTIME INVENTORY */}
      {activeTab === 'wh-inventory' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Danh Sách Nguyên Liệu & Sản Phẩm Trong Kho</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Kho Chi Nhánh: Chi Nhánh Quận 1 (Flagship) | Tổng Giá Trị Tồn Kho: 148.500.000đ</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAddInvModal(true)} style={{ padding: '10px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Khai Báo Nguyên Liệu Mới</button>
              <button onClick={() => alert('Đã sinh gợi ý đơn mua hàng PO 1-Click cho 1 mặt hàng dưới Par Level (RAW-002 Sữa Tươi)!')} style={{ padding: '10px 16px', background: '#D97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tự Động Tạo PO Par-Level 1-Click</button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input type="text" value={invSearch} onChange={(e) => setInvSearch(e.target.value)} placeholder="Tìm kiếm theo mã SKU hoặc tên nguyên liệu..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã SKU</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Nguyên Liệu</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Đơn Vị</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tồn Sổ Sách</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Giá Vốn Kho</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Định Mức (Par Level)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái Tồn</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.sku} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{item.sku}</td>
                  <td style={{ padding: '14px 12px', color: '#111827', fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{item.unit}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: item.status === 'Low' ? '#DC2626' : '#111827' }}>{item.stockQty} {item.unit}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{item.costPrice.toLocaleString('vi-VN')}đ</td>
                  <td style={{ padding: '14px 12px', color: '#4B5563' }}>Min: {item.parMin} | Max: {item.parMax}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ background: item.status === 'Low' ? '#FEE2E2' : '#D1FAE5', color: item.status === 'Low' ? '#991B1B' : '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      {item.status === 'Low' ? 'DƯỚI PAR LEVEL' : 'Tồn Kho An Toàn'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => setAdjustItem(item)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Khai Báo Kiểm Ke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADJUST STOCK MODAL */}
      {adjustItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Điều Chỉnh Tồn Kho: {adjustItem.name}</h3>
            <p style={{ fontSize: '13px', color: '#4B5563' }}>Tồn hiện tại: <strong>{adjustItem.stockQty} {adjustItem.unit}</strong></p>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Số Lượng Tăng/Giảm (Ví dụ: -5 hoặc 10):</label>
              <input type="number" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Lý Do Điều Chỉnh (Lưu AuditLog):</label>
              <input type="text" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setAdjustItem(null)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
              <button type="button" onClick={handleSaveStockAdjust} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Điều Chỉnh</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: FEFO BATCH TRACKER */}
      {activeTab === 'wh-fefo' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Theo Dõi Hạn Sử Dụng Lô Hàng (FEFO - First Expired, First Out)</h2>
              <p style={{ color: '#4B5563', fontSize: '14px' }}>Hệ thống tự động sắp xếp ưu tiên xuất các lô hàng có ngày hết hạn gần nhất trước.</p>
            </div>
            <button onClick={() => setShowAddBatchModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Khai Báo Lô FEFO Mới</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Lô Batch</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Sản Phẩm</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Ngày Sản Xuất (MFG)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Hạn Sử Dụng (EXP)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Số Lượng Lô</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái FEFO</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác Lô</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.batchNumber} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{b.batchNumber}</td>
                  <td style={{ padding: '14px 12px', color: '#111827', fontWeight: 'bold' }}>{b.productName}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{b.mfgDate}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: b.status === 'warning' ? '#D97706' : b.status === 'expired' ? '#DC2626' : '#059669' }}>{b.expDate}</td>
                  <td style={{ padding: '14px 12px', color: '#111827', fontWeight: 'bold' }}>{b.quantity}</td>
                  <td style={{ padding: '14px 12px' }}>
                    {b.status === 'active' && <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>}
                    {b.status === 'warning' && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>CẬN DATE (DƯỚI 7 NGÀY)</span>}
                    {b.status === 'expired' && <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>HẾT HẠN (KHÓA XUẤT)</span>}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    {b.status !== 'expired' ? (
                      <button onClick={() => handleLockExpiredBatch(b.batchNumber)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Khóa Lô Hết Hạn</button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Đã Khóa</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. VIEW 3: GOODS RECEIPT */}
      {activeTab === 'wh-receipt' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Lập Phiếu Nhập Kho Goods Receipt & Sinh Mã Lô FEFO</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Đã hoàn tất phiếu nhập kho và đẩy ảnh chứng từ lên MinIO S3 Object Storage!'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Chọn Nhà Cung Cấp:</label>
                <select style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tự Sinh Mã Lô Batch FEFO:</label>
                <input type="text" value="LOT-20260828-991" readOnly style={{ width: '100%', padding: '8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 'bold', color: '#111827' }} />
              </div>
            </div>

            <div style={{ border: '2px dashed #D1D5DB', padding: '24px', textAlign: 'center', borderRadius: '8px', marginBottom: '16px', background: '#F9FAFB' }}>
              <p style={{ margin: 0, color: '#4B5563', fontWeight: 'bold' }}>Kéo thả hoặc tải lên ảnh chứng từ / hóa đơn nhập kho đính kèm (Upload MinIO S3)</p>
              <input type="file" style={{ marginTop: '12px' }} />
            </div>

            <button type="submit" style={{ padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>XÁC NHẬN NHẬP KHO GHI SỔ CÁI</button>
          </form>
        </div>
      )}

      {/* 4. VIEW 4: INTER-BRANCH TRANSFERS */}
      {activeTab === 'wh-transfer' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Điều Chuyển Nguyên Liệu Giữa Các Chi Nhánh</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Quản lý lệnh vận chuyển hàng tồn kho giữa Chi Nhánh Quận 1 và Chi Nhánh Quận 3.</p>
            </div>
            <button onClick={() => setShowAddTransferModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ LẬP LỆNH ĐIỀU CHUYỂN MỚI</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Lệnh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Kho Xuất</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Kho Nhận</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Nguyên Liệu</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Ngày Lập</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{t.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{t.fromBranch}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{t.toBranch}</td>
                  <td style={{ padding: '14px 12px', color: '#111827', fontWeight: 'bold' }}>{t.item}</td>
                  <td style={{ padding: '14px 12px', color: '#4B5563' }}>{t.transferDate}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ background: t.status === 'In-Transit' ? '#FEF3C7' : '#D1FAE5', color: t.status === 'In-Transit' ? '#92400E' : '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    {t.status === 'In-Transit' ? (
                      <button onClick={() => handleConfirmReceiveTransfer(t.id)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Xác Nhận Nhận Kho</button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>Đã Hoàn Tất</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. VIEW 5: SUPPLIER SRM */}
      {activeTab === 'wh-srm' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Danh Bạ Nhà Cung Cấp SRM (Supplier Relationship Management)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Quản lý hợp đồng đối tác, thời gian giao hàng (Lead time) và đánh giá chất lượng nguyên liệu.</p>
            </div>
            <button onClick={() => setShowAddSupplierModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ THÊM NHÀ CUNG CẤP MỚI</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã NCC</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Nhà Cung Cấp</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Số Điện Thoại</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Lead Time</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Điểm Chất Lượng</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác PO</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{s.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{s.contact}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{s.leadTimeDays} ngày</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{s.qualityScore}/100 Điểm</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{s.status}</span></td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => alert(`Đã mở mẫu lập đơn mua hàng PO nhanh gửi tới đối tác ${s.name}!`)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Lập Đơn PO Nhanh</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
      {showAddInvModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Khai Báo Nguyên Liệu Tồn Kho Mới</h3>
            <form onSubmit={handleAddInvItem}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Mã SKU (Ví dụ: RAW-005):</label>
                <input type="text" required value={newInvItem.sku} onChange={(e) => setNewInvItem({ ...newInvItem, sku: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tên Nguyên Liệu:</label>
                <input type="text" required value={newInvItem.name} onChange={(e) => setNewInvItem({ ...newInvItem, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Số Lượng Tồn:</label>
                  <input type="number" required value={newInvItem.stockQty} onChange={(e) => setNewInvItem({ ...newInvItem, stockQty: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Đơn Vị Tính:</label>
                  <input type="text" required value={newInvItem.unit} onChange={(e) => setNewInvItem({ ...newInvItem, unit: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Giá Vốn Kho (đ):</label>
                <input type="number" required value={newInvItem.costPrice} onChange={(e) => setNewInvItem({ ...newInvItem, costPrice: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddInvModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Nguyên Liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddBatchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Khai Báo Lô FEFO Mới</h3>
            <form onSubmit={handleAddBatch}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Mã Lô Batch:</label>
                <input type="text" required value={newBatch.batchNumber} onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tên Sản Phẩm:</label>
                <input type="text" required value={newBatch.productName} onChange={(e) => setNewBatch({ ...newBatch, productName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Ngày Sản Xuất (MFG):</label>
                  <input type="date" required value={newBatch.mfgDate} onChange={(e) => setNewBatch({ ...newBatch, mfgDate: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Hạn Sử Dụng (EXP):</label>
                  <input type="date" required value={newBatch.expDate} onChange={(e) => setNewBatch({ ...newBatch, expDate: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Số Lượng Lô:</label>
                <input type="number" required value={newBatch.quantity} onChange={(e) => setNewBatch({ ...newBatch, quantity: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddBatchModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Khai Báo Lô</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddTransferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Lập Lệnh Điều Chuyển Kho Mới</h3>
            <form onSubmit={handleAddTransfer}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Kho Xuất:</label>
                <select value={newTransfer.fromBranch} onChange={(e) => setNewTransfer({ ...newTransfer, fromBranch: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                  <option value="Chi Nhánh Quận 1">Chi Nhánh Quận 1</option>
                  <option value="Chi Nhánh Quận 3">Chi Nhánh Quận 3</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Kho Nhận:</label>
                <select value={newTransfer.toBranch} onChange={(e) => setNewTransfer({ ...newTransfer, toBranch: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                  <option value="Chi Nhánh Quận 3">Chi Nhánh Quận 3</option>
                  <option value="Chi Nhánh Quận 1">Chi Nhánh Quận 1</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tên Nguyên Liệu & Số Lượng:</label>
                <input type="text" required value={newTransfer.item} onChange={(e) => setNewTransfer({ ...newTransfer, item: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddTransferModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lập Lệnh Điều Chuyển</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSupplierModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Thêm Nhà Cung Cấp SRM Mới</h3>
            <form onSubmit={handleAddSupplier}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tên Nhà Cung Cấp:</label>
                <input type="text" required value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Số Điện Thoại Lien Hệ:</label>
                <input type="text" required value={newSupplier.contact} onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Lead Time (Ngày):</label>
                  <input type="number" required value={newSupplier.leadTimeDays} onChange={(e) => setNewSupplier({ ...newSupplier, leadTimeDays: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Điểm Đánh Giá (/100):</label>
                  <input type="number" required value={newSupplier.qualityScore} onChange={(e) => setNewSupplier({ ...newSupplier, qualityScore: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddSupplierModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm Nhà Cung Cấp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
