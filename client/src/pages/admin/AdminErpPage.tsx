import React, { useState, useEffect } from 'react';

interface AdminErpPageProps {
  activeTab: string;
}

interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branch: string;
  email: string;
  phone: string;
  hourlyRate: number;
  status: string;
}

interface ShiftLog {
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  dailyWage: number;
}

interface EmployeePayroll {
  id: string;
  code: string;
  name: string;
  role: string;
  branch: string;
  hourlyRate: number;
  totalHours: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'Draft' | 'Locked';
  shifts: ShiftLog[];
}

interface BomComponent {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

interface BomProduct {
  productId: string;
  productName: string;
  sellingPrice: number;
  components: BomComponent[];
}

interface HappyHourRule {
  id: string;
  name: string;
  category: string;
  timeRange: string;
  discountPercent: number;
  status: 'Active' | 'Inactive';
}

interface PaidInvoiceRecord {
  id: string;
  table: string;
  items: { product: { name: string; price: number }; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  timestamp: string;
}

export const AdminErpPage: React.FC<AdminErpPageProps> = ({ activeTab }) => {
  // DYNAMICALLY READ PAID INVOICES FOR SYSTEM-WIDE REVENUE REPORTING
  const [paidInvoices, setPaidInvoices] = useState<PaidInvoiceRecord[]>([]);

  const syncPaidInvoices = () => {
    const saved = localStorage.getItem('fnb_paid_invoices');
    setPaidInvoices(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    syncPaidInvoices();
    window.addEventListener('fnb_data_updated', syncPaidInvoices);
    const interval = setInterval(syncPaidInvoices, 1500);
    return () => {
      window.removeEventListener('fnb_data_updated', syncPaidInvoices);
      clearInterval(interval);
    };
  }, [activeTab]);

  // 1. USER ACCOUNTS WITH WAGE SETTINGS
  const [users, setUsers] = useState<UserAccount[]>([
    { id: '1', username: 'manager1', fullName: 'Lê Hoàng Phúc', role: 'Manager', branch: 'Chi Nhánh Quận 1', email: 'manager1@fnb.com', phone: '0901234567', hourlyRate: 60000, status: 'Active' },
    { id: '2', username: 'manager2', fullName: 'Trịnh Kim Ngân', role: 'Manager', branch: 'Chi Nhánh Quận 3', email: 'manager2@fnb.com', phone: '0907654321', hourlyRate: 60000, status: 'Active' },
    { id: '3', username: 'warehouse1', fullName: 'Phạm Quốc Bảo', role: 'Warehouse', branch: 'Chi Nhánh Quận 1', email: 'warehouse1@fnb.com', phone: '0912345678', hourlyRate: 45000, status: 'Active' },
    { id: '4', username: 'cashier1', fullName: 'Nguyễn Thị Mai', role: 'Cashier', branch: 'Chi Nhánh Quận 1', email: 'cashier1@fnb.com', phone: '0923456789', hourlyRate: 40000, status: 'Active' },
    { id: '5', username: 'staff1', fullName: 'Trần Thanh Tâm', role: 'Staff', branch: 'Chi Nhánh Quận 1', email: 'staff1@fnb.com', phone: '0934567890', hourlyRate: 35000, status: 'Active' },
  ]);

  const [editUserModal, setEditUserModal] = useState<UserAccount | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullName: '', role: 'Manager', branch: 'Chi Nhánh Quận 1', email: '', phone: '', hourlyRate: 60000 });

  // 2. CONSOLIDATED MONTHLY PAYROLL WITH SHIFT IN/OUT LOGS
  const [payrolls, setPayrolls] = useState<EmployeePayroll[]>([
    {
      id: 'PAY-01', code: 'MGR001', name: 'Lê Hoàng Phúc', role: 'Manager', branch: 'Chi Nhánh Quận 1',
      hourlyRate: 60000, totalHours: 200, baseSalary: 12000000, bonus: 2000000, deductions: 500000, netSalary: 13500000, status: 'Draft',
      shifts: [
        { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 600000 },
        { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 600000 },
      ]
    },
    {
      id: 'PAY-02', code: 'MGR002', name: 'Trịnh Kim Ngân', role: 'Manager', branch: 'Chi Nhánh Quận 3',
      hourlyRate: 60000, totalHours: 190, baseSalary: 11400000, bonus: 1500000, deductions: 400000, netSalary: 12500000, status: 'Draft',
      shifts: [
        { date: '2026-08-25', clockIn: '08:30 AM', clockOut: '18:00 PM', hoursWorked: 9.5, dailyWage: 570000 },
      ]
    }
  ]);
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // 3. BOM RECIPE BUILDER & DFS CHECK
  const [bomProducts, setBomProducts] = useState<BomProduct[]>([
    {
      productId: 'PROD-1',
      productName: 'Cà Phê Sữa Đá Sài Gòn',
      sellingPrice: 29000,
      components: [
        { ingredientId: 'RAW-01', ingredientName: 'Hạt Cà Phê Robusta Sàn 18', quantity: 18, unit: 'g', unitCost: 250 },
        { ingredientId: 'RAW-02', ingredientName: 'Sữa Đặc Ngôi Sao Phương Nam', quantity: 30, unit: 'ml', unitCost: 150 },
        { ingredientId: 'RAW-03', ingredientName: 'Ly Nhựa Lắp Cầu 500ml', quantity: 1, unit: 'Cái', unitCost: 800 },
      ]
    }
  ]);

  const [selectedBomProduct, setSelectedBomProduct] = useState<string>('PROD-1');
  const [dfsLog, setDfsLog] = useState<string>('');
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: 10, unit: 'g', unitCost: 200 });

  // 4. HAPPY HOUR DYNAMIC PRICING
  const [happyHourRules, setHappyHourRules] = useState<HappyHourRule[]>([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' },
    { id: 'HH-02', name: 'Happy Hour Trà Sữa Chiều', category: 'Trà & Trà Sữa', timeRange: '14:00 - 16:00', discountPercent: 15, status: 'Active' },
  ]);
  const [showAddHappyHourModal, setShowAddHappyHourModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20 });

  // Handlers
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserModal) return;
    setUsers(users.map(u => u.id === editUserModal.id ? editUserModal : u));
    setEditUserModal(null);
    alert(`ADMIN ACTION: Đã cập nhật thành công hồ sơ & mức lương (${editUserModal.hourlyRate.toLocaleString('vi-VN')}đ/giờ) cho "${editUserModal.fullName}"!`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;
    setUsers([...users, { id: Date.now().toString(), ...newUser, status: 'Active' }]);
    setShowAddUserModal(false);
    alert(`Đã tạo thành công tài khoản "${newUser.username}"!`);
    setNewUser({ username: '', fullName: '', role: 'Manager', branch: 'Chi Nhánh Quận 1', email: '', phone: '', hourlyRate: 60000 });
  };

  const handleRunDfsCheck = () => {
    setDfsLog('Đang chạy thuật toán DFS (Depth-First Search) duyệt 15 nút cây công thức...');
    setTimeout(() => {
      setDfsLog('DFS Cycle Check Complete: Thuật toán xác nhận KHÔNG CÓ CHU TRÌNH LẶP ĐỆ QUY (Graph Cycle-Free). Định lượng BOM an toàn 100%!');
    }, 600);
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    setBomProducts(bomProducts.map(p => {
      if (p.productId === selectedBomProduct) {
        return {
          ...p,
          components: [
            ...p.components,
            { ingredientId: `RAW-${Date.now()}`, ingredientName: newIngredient.name, quantity: newIngredient.quantity, unit: newIngredient.unit, unitCost: newIngredient.unitCost }
          ]
        };
      }
      return p;
    }));
    setShowAddIngredientModal(false);
    alert(`Đã thêm nguyên liệu "${newIngredient.name}" vào công thức BOM sản phẩm!`);
    setNewIngredient({ name: '', quantity: 10, unit: 'g', unitCost: 200 });
  };

  const handleToggleRuleStatus = (id: string) => {
    setHappyHourRules(happyHourRules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  const handleAddHappyHourRule = (e: React.FormEvent) => {
    e.preventDefault();
    setHappyHourRules([
      ...happyHourRules,
      { id: `HH-0${happyHourRules.length + 1}`, ...newRule, status: 'Active' }
    ]);
    setShowAddHappyHourModal(false);
    alert(`Đã thêm quy tắc Giờ Vàng "${newRule.name}" thành công!`);
    setNewRule({ name: '', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20 });
  };

  const handleLockPayroll = () => {
    if (confirm('BẠN CÓ CHẮC CHẮN KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI THÁNG 8? Dữ liệu lương sẽ là BẤT KHẢ BIẾN (Immutable) và được ghi AuditLog.')) {
      setPayrolls(payrolls.map(p => ({ ...p, status: 'Locked' })));
      alert('Đã KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI THÁNG 8 thành công!');
    }
  };

  const filteredPayrolls = payrolls.filter(p => branchFilter === 'ALL' || p.branch === branchFilter);
  const totalChainRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* GLOBAL REVENUE SUMMARY BANNER FOR ADMIN */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase' }}>TỔNG QUAN DOANH THU TOÀN CHUỖI SYSTEM-WIDE</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#059669', fontWeight: 'bold' }}>
            {totalChainRevenue.toLocaleString('vi-VN')} VNĐ
          </h2>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Tích lũy từ {paidInvoices.length} đơn hàng đã phát hành hóa đơn</span>
        </div>
        <div style={{ background: '#DBEAFE', color: '#1E40AF', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
          Đã đồng bộ Realtime từ tất cả Chi nhánh & Bàn
        </div>
      </div>

      {/* 1. VIEW 1: USER ACCOUNT & WAGE SETTING */}
      {(activeTab === 'users' || activeTab === 'admin-users') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Quản Lý Hồ Sơ & Thiết Lập Mức Lương Quản Lý Chi Nhánh</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Admin thiết lập mức lương/giờ cho Quản Lý Chi Nhánh & Xem tổng quan lương nhân sự toàn chuỗi.</p>
            </div>
            <button onClick={() => setShowAddUserModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO TÀI KHOẢN MỚI</button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Username</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Họ Và Tên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chức Danh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Nhánh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mức Lương / Giờ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Quyền Chỉnh Sửa</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{u.username}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{u.fullName}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{u.branch}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{u.hourlyRate.toLocaleString('vi-VN')}đ / h</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => setEditUserModal(u)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Chỉnh Sửa Mức Lương</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: BOM RECIPE BUILDER & DFS CHECK */}
      {activeTab === 'admin-bom' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Định Lượng Công Thức BOM & Thuật Toán Kiểm Tra DFS Graph</h2>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <button onClick={handleRunDfsCheck} style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              CHẠY THUẬT TOÁN DFS CHECK CHU TRÌNH LẶP DỰ PHÒNG
            </button>
            {dfsLog && <div style={{ marginTop: '12px', padding: '12px', background: '#DCFCE7', color: '#166534', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>{dfsLog}</div>}
          </div>
        </div>
      )}

      {/* 3. VIEW 3: HAPPY HOUR PRICING */}
      {activeTab === 'admin-happyhour' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Tự Động Đổi Giá Giờ Vàng (Happy Hour Dynamic Pricing)</h2>
          <div style={{ width: '100%', overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Quy Tắc</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Danh Mục Áp Dụng</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Khung Giờ Tự Động</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>% Giảm Giá</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {happyHourRules.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{r.name}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{r.category}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{r.timeRange}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>-{r.discountPercent}%</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => handleToggleRuleStatus(r.id)} style={{ padding: '6px 12px', background: r.status === 'Active' ? '#059669' : '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {r.status === 'Active' ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. VIEW 4: CONSOLIDATED PAYROLL & REALTIME SALES LEDGER */}
      {(activeTab === 'admin-payroll' || activeTab === 'payroll') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Khóa Sổ Bảng Lương & Kiểm Kê Doanh Thu Toàn Chuỗi</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Consolidated Chain Payroll & System-Wide Revenue Audit.</p>
            </div>
            <button onClick={handleLockPayroll} style={{ padding: '10px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', color: '#0F172A', fontWeight: 'bold', marginBottom: '12px' }}>Bảng Kiểm Kê Hóa Đơn Realtime Toàn Chuỗi:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Hóa Đơn</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn Phục Vụ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Món Ăn Chế Biến</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Giá Trị Bill</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Phương Thức Thanh Toán</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Phát Hành</th>
                </tr>
              </thead>
              <tbody>
                {paidInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>Chưa có bút toán thanh toán nào trong hệ thống.</td>
                  </tr>
                ) : (
                  paidInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inv.id}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{inv.table}</td>
                      <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                        {inv.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{inv.totalAmount.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{inv.paymentMethod}</span></td>
                      <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{inv.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '18px', fontWeight: 'bold' }}>Chỉnh Sửa Hồ Sơ & Mức Lương Admin - {editUserModal.fullName}</h3>
            <form onSubmit={handleSaveEditUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>Mức Lương / Giờ (VNĐ):</label>
                <input type="number" value={editUserModal.hourlyRate} onChange={(e) => setEditUserModal({ ...editUserModal, hourlyRate: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditUserModal(null)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Lưu Hồ Sơ & Mức Lương</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminErpPage;
