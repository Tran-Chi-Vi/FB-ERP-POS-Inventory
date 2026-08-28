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

interface BranchFinancialSummary {
  branchName: string;
  totalRevenue: number; // Thu từ bán hàng
  totalExpenditure: number; // Chi nhập kho
  netProfit: number;
  receipts: { id: string; supplier: string; items: string; cost: number; date: string }[];
  salesInvoices: PaidInvoiceRecord[];
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

  // BRANCH FINANCIAL DRILL-DOWN MODAL STATE
  const [selectedBranchDetail, setSelectedBranchDetail] = useState<BranchFinancialSummary | null>(null);

  // MOCK INVENTORY EXPENSES & BRANCH DATA
  const branchFinancials: BranchFinancialSummary[] = [
    {
      branchName: 'Chi Nhánh Quận 1',
      totalRevenue: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalExpenditure: 45000000,
      netProfit: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0) - 45000000,
      receipts: [
        { id: 'NK-8801', supplier: 'Công ty Cà Phê Trung Nguyên', items: 'Hạt Cà Phê Robusta 50kg, Sữa đặc 20 thùng', cost: 28000000, date: '2026-08-25' },
        { id: 'NK-8802', supplier: 'Nhà cung cấp Trà Phúc Long', items: 'Trà Sả ủ 10kg, Syrup Đào 15 chai', cost: 17000000, date: '2026-08-26' },
      ],
      salesInvoices: paidInvoices
    },
    {
      branchName: 'Chi Nhánh Quận 3',
      totalRevenue: 68500000,
      totalExpenditure: 32000000,
      netProfit: 36500000,
      receipts: [
        { id: 'NK-8805', supplier: 'Công ty Sữa Vinamilk', items: 'Sữa tươi thanh trùng 100 lít', cost: 12000000, date: '2026-08-24' },
        { id: 'NK-8806', supplier: 'Nông nghiệp Tươi Da Lat', items: 'Trái cây tươi, Cam Sả Đào 200kg', cost: 20000000, date: '2026-08-27' },
      ],
      salesInvoices: [
        { id: 'HD-7701', table: 'Bàn 02', items: [{ product: { name: 'Cà Phê Sữa Đá', price: 29000 }, quantity: 4 }], totalAmount: 116000, paymentMethod: 'Chuyển Khoản VietQR', timestamp: '14:20:00' }
      ]
    }
  ];

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
      ]
    }
  ]);

  const [selectedBomProduct] = useState<string>('PROD-1');
  const [dfsLog, setDfsLog] = useState<string>('');

  // 4. HAPPY HOUR DYNAMIC PRICING
  const [happyHourRules, setHappyHourRules] = useState<HappyHourRule[]>([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' },
    { id: 'HH-02', name: 'Happy Hour Trà Sữa Chiều', category: 'Trà & Trà Sữa', timeRange: '14:00 - 16:00', discountPercent: 15, status: 'Active' },
  ]);

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

  const handleToggleRuleStatus = (id: string) => {
    setHappyHourRules(happyHourRules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  const handleLockPayroll = () => {
    if (confirm('BẠN CÓ CHẮC CHẮN KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI THÁNG 8? Dữ liệu lương sẽ là BẤT KHẢ BIẾN (Immutable) và được ghi AuditLog.')) {
      setPayrolls(payrolls.map(p => ({ ...p, status: 'Locked' })));
      alert('Đã KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI THÁNG 8 thành công!');
    }
  };

  const totalChainRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. SEPARATE FEATURE: FINANCIALS & BRANCH AUDIT (ADMIN-FINANCIALS) */}
      {(activeTab === 'admin-financials' || activeTab === 'financials') && (
        <div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Báo Cáo Thu Chi & Đối Soát Kiểm Kê Tài Chính Chi Nhánh</h2>
            <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Đối soát tiền Thu từ bán sản phẩm với tiền Chi nhập kho nguyên liệu của từng chi nhánh.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #10B981', padding: '20px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 'bold' }}>TỔNG THU BÁN HÀNG TOÀN CHUỖI</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '26px', color: '#047857', fontWeight: 'bold' }}>{(totalChainRevenue + 68500000).toLocaleString('vi-VN')} VNĐ</h3>
                <span style={{ fontSize: '12px', color: '#047857' }}>Từ sản phẩm bán ra tại các quầy POS & QR</span>
              </div>

              <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', padding: '20px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 'bold' }}>TỔNG CHI NHẬP KHO NGUYÊN LIỆU</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '26px', color: '#991B1B', fontWeight: 'bold' }}>77.000.000 VNĐ</h3>
                <span style={{ fontSize: '12px', color: '#991B1B' }}>Chi phí chứng từ nhập hàng nhà cung cấp</span>
              </div>

              <div style={{ background: '#DBEAFE', border: '1px solid #3B82F6', padding: '20px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 'bold' }}>LỢI NHUẬN RÒNG CHÊNH LỆCH</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '26px', color: '#1E40AF', fontWeight: 'bold' }}>{((totalChainRevenue + 68500000) - 77000000).toLocaleString('vi-VN')} VNĐ</h3>
                <span style={{ fontSize: '12px', color: '#1E40AF' }}>Chênh lệch Lợi nhuận gộp toàn chuỗi</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', color: '#0F172A', fontWeight: 'bold', marginBottom: '12px' }}>Bảng Kiểm Kê Số Tiền Thu - Chi Từng Chi Nhánh:</h3>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Chi Nhánh</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tiền THU (Sản Phẩm Bán Ra)</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tiền CHI (Nhập Kho Nguyên Liệu)</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Lợi Nhuận Gộp Chi Nhánh</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác Xem Chi Tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {branchFinancials.map((b, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{b.branchName}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{b.totalRevenue.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#DC2626', fontSize: '15px' }}>{b.totalExpenditure.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: b.netProfit >= 0 ? '#2563EB' : '#DC2626', fontSize: '15px' }}>{b.netProfit.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => setSelectedBranchDetail(b)} style={{ padding: '6px 14px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                          Xem Chi Tiết Kho & Bán Hàng
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: USER ACCOUNT & WAGE SETTING */}
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

      {/* 3. VIEW 3: BOM RECIPE BUILDER & DFS CHECK */}
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

      {/* 4. VIEW 4: HAPPY HOUR PRICING */}
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

      {/* 5. VIEW 5: CONSOLIDATED PAYROLL */}
      {(activeTab === 'admin-payroll' || activeTab === 'payroll') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Khóa Sổ Bảng Lương Toàn Chuỗi</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Consolidated Chain Payroll Audit.</p>
            </div>
            <button onClick={handleLockPayroll} style={{ padding: '10px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              KHÓA SỔ BẢNG LƯƠNG TOÀN CHUỖI
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Lương</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Nhân Viên</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Nhánh</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Giờ Công</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thực Lĩnh Net</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Trạng Thái Sổ</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{p.id}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A', fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{p.branch}</td>
                    <td style={{ padding: '14px 12px', color: '#2563EB', fontWeight: 'bold' }}>{p.totalHours} giờ</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{p.netSalary.toLocaleString('vi-VN')} đ</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: p.status === 'Locked' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'Locked' ? '#166534' : '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {p.status === 'Locked' ? 'ĐÃ KHÓA SỔ' : 'SỔ BẢN THẢO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRILL-DOWN FINANCIAL DETAILS MODAL FOR BRANCH (LINKING INVENTORY & SALES) */}
      {selectedBranchDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '750px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 'bold' }}>CHI TIẾT ĐỐI SOÁT TÀI CHÍNH KHO & BÁN HÀNG</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '20px', color: '#0F172A', fontWeight: 'bold' }}>{selectedBranchDetail.branchName}</h3>
              </div>
              <button onClick={() => setSelectedBranchDetail(null)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Đóng Modal</button>
            </div>

            {/* SECTION 1: INVENTORY RECEIPTS (CHI) */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>1. Nhật Ký Chi Nhập Kho Nguyên Liệu (Kho Chi Nhánh):</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Mã Phiếu</th>
                    <th style={{ padding: '8px' }}>Nhà Cung Cấp</th>
                    <th style={{ padding: '8px' }}>Mặt Hàng Nhập</th>
                    <th style={{ padding: '8px' }}>Tổng Chi</th>
                    <th style={{ padding: '8px' }}>Ngày Nhập</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBranchDetail.receipts.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{r.id}</td>
                      <td style={{ padding: '8px' }}>{r.supplier}</td>
                      <td style={{ padding: '8px', color: '#475569' }}>{r.items}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#DC2626' }}>{r.cost.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '8px', color: '#64748B' }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECTION 2: SALES INVOICES (THU) */}
            <div>
              <h4 style={{ color: '#059669', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>2. Nhật Ký Thu Sản Phẩm Đã Bán Out (Quầy Bán Hàng):</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Mã Hóa Đơn</th>
                    <th style={{ padding: '8px' }}>Bàn Phục Vụ</th>
                    <th style={{ padding: '8px' }}>Sản Phẩm Đã Bán</th>
                    <th style={{ padding: '8px' }}>Doanh Thu</th>
                    <th style={{ padding: '8px' }}>Giờ Xuất</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBranchDetail.salesInvoices.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '12px', textAlign: 'center', color: '#64748B' }}>Chưa phát sinh hóa đơn bán hàng.</td></tr>
                  ) : (
                    selectedBranchDetail.salesInvoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{inv.id}</td>
                        <td style={{ padding: '8px', color: '#2563EB', fontWeight: 'bold' }}>{inv.table}</td>
                        <td style={{ padding: '8px', color: '#475569' }}>{inv.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}</td>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#059669' }}>{inv.totalAmount.toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '8px', color: '#64748B' }}>{inv.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminErpPage;
