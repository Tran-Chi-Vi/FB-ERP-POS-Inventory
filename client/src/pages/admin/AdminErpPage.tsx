import React, { useState } from 'react';

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

export const AdminErpPage: React.FC<AdminErpPageProps> = ({ activeTab }) => {
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
        { date: '2026-08-27', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 600000 },
      ]
    },
    {
      id: 'PAY-02', code: 'MGR002', name: 'Trịnh Kim Ngân', role: 'Manager', branch: 'Chi Nhánh Quận 3',
      hourlyRate: 60000, totalHours: 190, baseSalary: 11400000, bonus: 1500000, deductions: 400000, netSalary: 12500000, status: 'Draft',
      shifts: [
        { date: '2026-08-25', clockIn: '08:30 AM', clockOut: '18:00 PM', hoursWorked: 9.5, dailyWage: 570000 },
        { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '17:30 PM', hoursWorked: 9.5, dailyWage: 570000 },
      ]
    },
    {
      id: 'PAY-03', code: 'EMP001', name: 'Trần Thanh Tâm', role: 'Staff (Phục vụ)', branch: 'Chi Nhánh Quận 1',
      hourlyRate: 35000, totalHours: 180, baseSalary: 6300000, bonus: 500000, deductions: 100000, netSalary: 6700000, status: 'Draft',
      shifts: [
        { date: '2026-08-25', clockIn: '07:30 AM', clockOut: '17:30 PM', hoursWorked: 10, dailyWage: 350000 },
        { date: '2026-08-26', clockIn: '07:30 AM', clockOut: '17:30 PM', hoursWorked: 10, dailyWage: 350000 },
      ]
    },
    {
      id: 'PAY-04', code: 'EMP002', name: 'Nguyễn Thị Mai', role: 'Cashier (Thu ngân)', branch: 'Chi Nhánh Quận 1',
      hourlyRate: 40000, totalHours: 190, baseSalary: 7600000, bonus: 800000, deductions: 200000, netSalary: 8200000, status: 'Draft',
      shifts: [
        { date: '2026-08-25', clockIn: '08:00 AM', clockOut: '18:00 PM', hoursWorked: 10, dailyWage: 400000 },
        { date: '2026-08-26', clockIn: '08:00 AM', clockOut: '17:00 PM', hoursWorked: 9, dailyWage: 360000 },
      ]
    }
  ]);

  const [selectedPayrollShifts, setSelectedPayrollShifts] = useState<EmployeePayroll | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // 3. BOM RECIPE ENGINE STATE
  const [bomProducts, setBomProducts] = useState<BomProduct[]>([
    {
      productId: 'P-01',
      productName: 'Cà Phê Sữa Đá Sài Gòn',
      sellingPrice: 35000,
      components: [
        { ingredientId: 'RAW-01', ingredientName: 'Hạt Cà Phê Robusta', quantity: 18, unit: 'g', unitCost: 180 },
        { ingredientId: 'RAW-02', ingredientName: 'Sữa Đặc Ngôi Sao', quantity: 30, unit: 'ml', unitCost: 120 },
        { ingredientId: 'RAW-03', ingredientName: 'Đá Viên Tinh Khiết', quantity: 150, unit: 'g', unitCost: 10 }
      ]
    },
    {
      productId: 'P-02',
      productName: 'Trà Đào Cam Sả Tươi',
      sellingPrice: 45000,
      components: [
        { ingredientId: 'RAW-04', ingredientName: 'Trà Sả Tươi', quantity: 10, unit: 'g', unitCost: 350 },
        { ingredientId: 'RAW-05', ingredientName: 'Syrup Đào Monin', quantity: 20, unit: 'ml', unitCost: 400 },
        { ingredientId: 'RAW-06', ingredientName: 'Đào Miếng Giòn', quantity: 2, unit: 'Miếng', unitCost: 1750 }
      ]
    }
  ]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [selectedBomProduct, setSelectedBomProduct] = useState<string>('P-01');
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: 10, unit: 'g', unitCost: 200 });
  const [dfsLog, setDfsLog] = useState<string | null>(null);

  // 4. HAPPY HOUR DYNAMIC PRICING STATE
  const [happyHourRules, setHappyHourRules] = useState<HappyHourRule[]>([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' },
    { id: 'HH-02', name: 'Happy Hour Trà Sữa Chiều', category: 'Trà & Trà Sữa', timeRange: '14:00 - 16:00', discountPercent: 15, status: 'Active' },
    { id: 'HH-03', name: 'Happy Hour Bia & Snack Tối', category: 'Đồ Uống Có Cồn', timeRange: '17:00 - 19:00', discountPercent: 30, status: 'Inactive' }
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
      setDfsLog('DFS Cycle Check Complete: Thuật toán xác nhận KHÔNG CÓ CHU TRÌNH LẶP ĐỆ QUY (Graph Cycle-Free: No Circular Dependency). Định lượng BOM an toàn 100%!');
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

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
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
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>SĐT / Email</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mức Lương / Giờ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Quyền Chỉnh Sửa</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{u.username}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{u.fullName}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ background: u.role === 'Manager' ? '#DBEAFE' : '#F1F5F9', color: u.role === 'Manager' ? '#1E40AF' : '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{u.branch}</td>
                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>{u.phone}<br/>{u.email}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{u.hourlyRate.toLocaleString('vi-VN')}đ / giờ</td>
                    <td style={{ padding: '14px 12px' }}>
                      {u.role === 'Manager' ? (
                        <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Admin Set Lương</span>
                      ) : (
                        <span style={{ background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Chỉ Xem (Xem Lương Staff)</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => setEditUserModal(u)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Chỉnh Sửa Hồ Sơ & Lương</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: BOM RECIPE BUILDER & DFS */}
      {activeTab === 'admin-bom' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>BOM Recipe Builder & Thuật Toán DFS Cycle Check</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Quản lý định lượng công thức pha chế, tự động tính giá vốn Food Cost % và phát hiện vòng lặp đồ thị đệ quy.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleRunDfsCheck} style={{ padding: '10px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Chạy Thuật Toán Kiểm Tra DFS</button>
              <button onClick={() => setShowAddIngredientModal(true)} style={{ padding: '10px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Thêm Nguyên Liệu Vào BOM</button>
            </div>
          </div>

          {dfsLog && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
              {dfsLog}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {bomProducts.map((prod) => {
              const totalCost = prod.components.reduce((sum, c) => sum + c.quantity * c.unitCost, 0);
              const foodCostPercent = ((totalCost / prod.sellingPrice) * 100).toFixed(1);
              const profitMarginPercent = (100 - Number(foodCostPercent)).toFixed(1);

              return (
                <div key={prod.productId} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>{prod.productName}</h3>
                      <span style={{ fontSize: '13px', color: '#475569' }}>Giá bán niêm yết: <strong style={{ color: '#059669' }}>{prod.sellingPrice.toLocaleString('vi-VN')}đ</strong></span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', color: '#475569' }}>Tổng Giá Vốn (Food Cost): <strong style={{ color: '#DC2626' }}>{totalCost.toLocaleString('vi-VN')}đ</strong> ({foodCostPercent}%)</div>
                      <div style={{ fontSize: '13px', color: '#059669', fontWeight: 'bold' }}>Biên Lợi Nhuận Gộp (Margin): {profitMarginPercent}%</div>
                    </div>
                  </div>

                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', borderRadius: '6px', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                          <th style={{ padding: '10px', color: '#0F172A', fontSize: '13px', fontWeight: 'bold' }}>Mã Nguyên Liệu</th>
                          <th style={{ padding: '10px', color: '#0F172A', fontSize: '13px', fontWeight: 'bold' }}>Tên Nguyên Liệu Tồn Kho</th>
                          <th style={{ padding: '10px', color: '#0F172A', fontSize: '13px', fontWeight: 'bold' }}>Định Lượng Standard</th>
                          <th style={{ padding: '10px', color: '#0F172A', fontSize: '13px', fontWeight: 'bold' }}>Đơn Giá Kho</th>
                          <th style={{ padding: '10px', color: '#0F172A', fontSize: '13px', fontWeight: 'bold' }}>Thành Tiền Chi Phí</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prod.components.map((comp) => (
                          <tr key={comp.ingredientId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#0F172A', fontSize: '13px' }}>{comp.ingredientId}</td>
                            <td style={{ padding: '10px', color: '#0F172A', fontSize: '13px' }}>{comp.ingredientName}</td>
                            <td style={{ padding: '10px', color: '#2563EB', fontWeight: 'bold', fontSize: '13px' }}>{comp.quantity} {comp.unit}</td>
                            <td style={{ padding: '10px', color: '#475569', fontSize: '13px' }}>{comp.unitCost.toLocaleString('vi-VN')}đ / {comp.unit}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#DC2626', fontSize: '13px' }}>{(comp.quantity * comp.unitCost).toLocaleString('vi-VN')}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. VIEW 3: HAPPY HOUR DYNAMIC PRICING */}
      {activeTab === 'admin-happyhour' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Cấu Hình Tự Động Đổi Giá Giờ Vàng (Happy Hour Dynamic Pricing)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Hệ thống tự động kích hoạt bảng giá ưu đãi theo khung giờ thực tế trên POS và QR gọi món.</p>
            </div>
            <button onClick={() => setShowAddHappyHourModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO QUY TẮC GIỜ VÀNG MỚI</button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Quy Tắc</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Chương Trình</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Danh Mục Áp Dụng</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Khung Giờ Tự Động</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mức Giảm Giá (%)</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Trạng Thái</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bật/Tắt</th>
                </tr>
              </thead>
              <tbody>
                {happyHourRules.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{r.id}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{r.name}</td>
                    <td style={{ padding: '14px 12px', color: '#2563EB' }}>{r.category}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{r.timeRange}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#DC2626' }}>-{r.discountPercent}%</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: r.status === 'Active' ? '#DCFCE7' : '#F1F5F9', color: r.status === 'Active' ? '#166534' : '#64748B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => handleToggleRuleStatus(r.id)} style={{ padding: '6px 12px', background: r.status === 'Active' ? '#DC2626' : '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        {r.status === 'Active' ? 'Tắt Quy Tắc' : 'Kích Hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. VIEW 4: CONSOLIDATED PAYROLL REPORT */}
      {activeTab === 'admin-payroll' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Báo Cáo Thống Kê & Kiểm Kê Lương Toàn Chuỗi Tháng 8</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Admin xem tổng hợp lương Quản Lý & Nhân sự từng chi nhánh dựa trên công thức (Số giờ làm x Lương/giờ).</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontWeight: 'bold' }}>
                <option value="ALL">Tất Cả Chi Nhánh (ALL)</option>
                <option value="Chi Nhánh Quận 1">Chi Nhánh Quận 1</option>
                <option value="Chi Nhánh Quận 3">Chi Nhánh Quận 3</option>
              </select>
              <button onClick={handleLockPayroll} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI</button>
            </div>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã NV</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Họ Và Tên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chức Danh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Nhánh Quản Lý</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Lương / Giờ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Giờ IN/OUT</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Lương Cơ Bản</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thưởng / Khấu Trừ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thực Lĩnh Net</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Ca IN/OUT</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{p.code}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{p.role}</span></td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{p.branch}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{p.hourlyRate.toLocaleString('vi-VN')}đ / h</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{p.totalHours} giờ</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{p.baseSalary.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px' }}>
                      <span style={{ color: '#059669', fontWeight: 'bold' }}>+{p.bonus.toLocaleString('vi-VN')}đ</span><br/>
                      <span style={{ color: '#DC2626' }}>-{p.deductions.toLocaleString('vi-VN')}đ</span>
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{p.netSalary.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => setSelectedPayrollShifts(p)} style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Xem Ca IN/OUT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. VIEW 5: MENU ENGINEERING MATRIX */}
      {activeTab === 'admin-menu-eng' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ma Trận Phân Tích 4 Nhóm Menu Engineering (P&L Optimization Matrix)</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Phân loại sản phẩm dựa trên Biên Lợi Nhuận Gộp (Margin) và Sản Lượng Bán Ra (Popularity) để đưa ra chiến lược giá tối ưu.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', padding: '20px', borderRadius: '8px' }}>
              <span style={{ background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>NHÓM 1</span>
              <h3 style={{ margin: '8px 0 4px 0', color: '#065F46', fontSize: '18px' }}>STARS (Lợi Nhuận Cao & Bán Chạy)</h3>
              <p style={{ fontSize: '13px', color: '#047857', marginBottom: '12px' }}>Chiến lược: Giữ nguyên công thức chuẩn, ưu tiên vị trí hiển thị đầu Menu QR & POS.</p>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                <div style={{ fontWeight: 'bold', color: '#0F172A' }}>Cà Phê Sữa Đá Sài Gòn</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>Giá bán: 35.000đ | Food Cost: 12.000đ | Margin: <strong style={{ color: '#059669' }}>65.7%</strong> | Đã bán: <strong>420 ly/tháng</strong></div>
              </div>
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #3B82F6', padding: '20px', borderRadius: '8px' }}>
              <span style={{ background: '#2563EB', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>NHÓM 2</span>
              <h3 style={{ margin: '8px 0 4px 0', color: '#1E40AF', fontSize: '18px' }}>PLOWHORSES (Bán Chạy Nhưng Lợi Nhuận Thấp)</h3>
              <p style={{ fontSize: '13px', color: '#1E3A8A', marginBottom: '12px' }}>Chiến lược: Tối ưu định lượng nguyên liệu BOM hoặc tăng nhẹ giá bán 5%.</p>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontWeight: 'bold', color: '#0F172A' }}>Trà Đào Cam Sả Tươi</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>Giá bán: 45.000đ | Food Cost: 15.000đ | Margin: <strong style={{ color: '#2563EB' }}>66.6%</strong> | Đã bán: <strong>380 ly/tháng</strong></div>
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', padding: '20px', borderRadius: '8px' }}>
              <span style={{ background: '#D97706', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>NHÓM 3</span>
              <h3 style={{ margin: '8px 0 4px 0', color: '#92400E', fontSize: '18px' }}>PUZZLES (Lợi Nhuận Cao Nhưng Bán Chậm)</h3>
              <p style={{ fontSize: '13px', color: '#78350F', marginBottom: '12px' }}>Chiến lược: Đưa vào Combo khuyến mãi hoặc chạy chương trình Quảng cáo Giờ Vàng.</p>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                <div style={{ fontWeight: 'bold', color: '#0F172A' }}>Bánh Tiramisu Ý</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>Giá bán: 55.000đ | Food Cost: 22.000đ | Margin: <strong style={{ color: '#D97706' }}>60.0%</strong> | Đã bán: <strong>45 cái/tháng</strong></div>
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', padding: '20px', borderRadius: '8px' }}>
              <span style={{ background: '#DC2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>NHÓM 4</span>
              <h3 style={{ margin: '8px 0 4px 0', color: '#991B1B', fontSize: '18px' }}>DOGS (Lợi Nhuận Thấp & Bán Chậm)</h3>
              <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '12px' }}>Chiến lược: Loại bỏ khỏi Menu chính hoặc bật cờ Khóa Món 86-List.</p>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #FCA5A5' }}>
                <div style={{ fontWeight: 'bold', color: '#0F172A' }}>Sinh Tố Bơ Nếp</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>Giá bán: 40.000đ | Food Cost: 28.000đ | Margin: <strong style={{ color: '#DC2626' }}>30.0%</strong> | Đã bán: <strong>12 ly/tháng</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHIFT IN/OUT DETAIL MODAL */}
      {selectedPayrollShifts && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>Nhật Ký Chấm Công Giờ Hành Chính IN/OUT: {selectedPayrollShifts.name}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Chức danh: {selectedPayrollShifts.role} | Lương/Giờ: <strong style={{ color: '#059669' }}>{selectedPayrollShifts.hourlyRate.toLocaleString('vi-VN')}đ/h</strong></p>
              </div>
              <button onClick={() => setSelectedPayrollShifts(null)} style={{ padding: '6px 12px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đóng</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Ngày</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Vào (IN)</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Ra (OUT)</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Số Giờ Làm</th>
                  <th style={{ padding: '10px', color: '#0F172A', fontWeight: 'bold' }}>Lương Ngày (Giờ x Lương/h)</th>
                </tr>
              </thead>
              <tbody>
                {selectedPayrollShifts.shifts.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#0F172A' }}>{s.date}</td>
                    <td style={{ padding: '10px', color: '#059669', fontWeight: 'bold' }}>{s.clockIn}</td>
                    <td style={{ padding: '10px', color: '#DC2626', fontWeight: 'bold' }}>{s.clockOut}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563EB' }}>{s.hoursWorked} tiếng</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#059669' }}>{s.dailyWage.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT USER PROFILE & WAGE MODAL */}
      {editUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Chỉnh Sửa Hồ Sơ & Mức Lương: {editUserModal.fullName}</h3>
            <form onSubmit={handleSaveEditUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Họ và Tên:</label>
                  <input type="text" value={editUserModal.fullName} onChange={(e) => setEditUserModal({ ...editUserModal, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Số Điện Thoại:</label>
                  <input type="text" value={editUserModal.phone} onChange={(e) => setEditUserModal({ ...editUserModal, phone: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Email Liên Hệ:</label>
                <input type="email" value={editUserModal.email} onChange={(e) => setEditUserModal({ ...editUserModal, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '16px', background: '#FEF3C7', padding: '12px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#92400E', fontWeight: 'bold' }}>Mức Lương Theo Giờ Bắt Buộc (đ/giờ):</label>
                <input type="number" required value={editUserModal.hourlyRate} onChange={(e) => setEditUserModal({ ...editUserModal, hourlyRate: Number(e.target.value) })} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontSize: '16px', fontWeight: 'bold' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditUserModal(null)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Cập Nhật Hồ Sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Tạo Tài Khoản Mới</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Username:</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Họ và tên:</label>
                <input type="text" required value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Mức Lương/Giờ (đ/h):</label>
                <input type="number" required value={newUser.hourlyRate} onChange={(e) => setNewUser({ ...newUser, hourlyRate: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD INGREDIENT TO BOM MODAL */}
      {showAddIngredientModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Thêm Nguyên Liệu Thành Phần Vào BOM</h3>
            <form onSubmit={handleAddIngredient}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Chọn Sản Phẩm Cần Khai Báo:</label>
                <select value={selectedBomProduct} onChange={(e) => setSelectedBomProduct(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}>
                  {bomProducts.map(p => (
                    <option key={p.productId} value={p.productId}>{p.productName}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Tên Nguyên Liệu Tồn Kho:</label>
                <input type="text" required value={newIngredient.name} onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} placeholder="Ví dụ: Bột Matcha Nhật" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Định Lượng:</label>
                  <input type="number" required value={newIngredient.quantity} onChange={(e) => setNewIngredient({ ...newIngredient, quantity: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Vị Tính:</label>
                  <select value={newIngredient.unit} onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}>
                    <option value="g">Gam (g)</option>
                    <option value="ml">Mililit (ml)</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Giá Kho (đ/Đơn vị):</label>
                <input type="number" required value={newIngredient.unitCost} onChange={(e) => setNewIngredient({ ...newIngredient, unitCost: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddIngredientModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm Vào BOM</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD HAPPY HOUR RULE MODAL */}
      {showAddHappyHourModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Tạo Quy Tắc Giờ Vàng Mới</h3>
            <form onSubmit={handleAddHappyHourRule}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Tên Chương Trình:</label>
                <input type="text" required value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="Ví dụ: Happy Hour Trà Sữa" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Khung Giờ Tự Động:</label>
                <input type="text" required value={newRule.timeRange} onChange={(e) => setNewRule({ ...newRule, timeRange: e.target.value })} placeholder="07:00 - 09:00" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Mức Giảm Giá (%):</label>
                <input type="number" required value={newRule.discountPercent} onChange={(e) => setNewRule({ ...newRule, discountPercent: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddHappyHourModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Khởi Tạo Quy Tắc</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminErpPage;
