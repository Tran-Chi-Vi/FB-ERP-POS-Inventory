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
  hourlyRate: number; // Lương theo giờ (đ/h)
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

  // BOM STATE
  const [bomProducts] = useState([
    {
      productId: 'P-01',
      productName: 'Cà Phê Sữa Đá Sài Gòn',
      sellingPrice: 35000,
      components: [
        { ingredientId: 'RAW-01', ingredientName: 'Hạt Cà Phê Robusta', quantity: 18, unit: 'g', unitCost: 180 },
        { ingredientId: 'RAW-02', ingredientName: 'Sữa Đặc Ngôi Sao', quantity: 30, unit: 'ml', unitCost: 120 },
        { ingredientId: 'RAW-03', ingredientName: 'Đá Viên Tinh Khiết', quantity: 150, unit: 'g', unitCost: 10 }
      ]
    }
  ]);

  // HAPPY HOUR STATE
  const [happyHourRules] = useState([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', category: 'Cà Phê', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' }
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
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#78350F' }}>Công thức: Số giờ làm x Lương/giờ = Tổng lương tháng</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditUserModal(null)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Cập Nhật Hồ Sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW 2: CONSOLIDATED PAYROLL REPORT & SHIFT LOG AUDIT */}
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

      {/* OTHER ADMIN VIEWS */}
      {activeTab === 'admin-bom' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>BOM Recipe Builder & Thuật Toán DFS Cycle Check</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Quản lý công thức định lượng sản phẩm và kiểm tra đồ thị đệ quy.</p>
        </div>
      )}

      {activeTab === 'admin-happyhour' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Cấu Hình Tự Động Đổi Giá Giờ Vàng (Happy Hour Dynamic Pricing)</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Hệ thống tự động kích hoạt bảng giá ưu đãi theo khung giờ thực tế trên POS và QR gọi món.</p>
        </div>
      )}

      {activeTab === 'admin-menu-eng' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ma Trận Phân Tích 4 Nhóm Menu Engineering (P&L Optimization Matrix)</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Phân loại sản phẩm dựa trên Biên Lợi Nhuận Gộp và Sản Lượng Bán Ra.</p>
        </div>
      )}

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
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#0F172A', fontWeight: 'bold' }}>Vai trò:</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A' }}>
                  <option value="Manager">Manager (Quản lý chi nhánh)</option>
                  <option value="Warehouse">Warehouse (Thủ kho)</option>
                  <option value="Cashier">Cashier (Thu ngân)</option>
                  <option value="Staff">Staff (Phục vụ)</option>
                </select>
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
    </div>
  );
};

export default AdminErpPage;
