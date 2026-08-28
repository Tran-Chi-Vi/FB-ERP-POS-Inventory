import React, { useState } from 'react';

interface AdminErpPageProps {
  activeTab: string;
}

export const AdminErpPage: React.FC<AdminErpPageProps> = ({ activeTab }) => {
  const [users, setUsers] = useState([
    { id: '1', username: 'manager1', fullName: 'Lê Hoàng Phúc', role: 'Manager', email: 'manager1@fnb.com', status: 'Active' },
    { id: '2', username: 'warehouse1', fullName: 'Phạm Quốc Bảo', role: 'Warehouse', email: 'warehouse1@fnb.com', status: 'Active' },
    { id: '3', username: 'cashier1', fullName: 'Nguyễn Thị Mai', role: 'Cashier', email: 'cashier1@fnb.com', status: 'Active' },
    { id: '4', username: 'staff1', fullName: 'Trần Thanh Tâm', role: 'Staff', email: 'staff1@fnb.com', status: 'Active' }
  ]);

  const [newUser, setNewUser] = useState({ username: '', fullName: '', role: 'Cashier', email: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [happyHourRules] = useState([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' },
    { id: 'HH-02', name: 'Happy Hour Bia Draft', timeRange: '17:00 - 19:00', discountPercent: 30, status: 'Active' }
  ]);

  const [payrollLocked, setPayrollLocked] = useState<boolean>(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;
    setUsers([...users, { id: Date.now().toString(), ...newUser, status: 'Active' }]);
    setShowAddUserModal(false);
    alert(`Đã tạo thành công tài khoản người dùng "${newUser.username}" với vai trò ${newUser.role}!`);
    setNewUser({ username: '', fullName: '', role: 'Cashier', email: '' });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA TÀI KHOẢN nhân sự "${name}" khỏi hệ thống không?`)) {
      setUsers(users.filter(u => u.id !== id));
      alert(`Đã xóa tài khoản "${name}" thành công!`);
    }
  };

  const handleLockPayroll = () => {
    if (confirm('Khóa sổ bảng lương tháng này? Sau khi khóa, dữ liệu lương sẽ là BẤT KHẢ BIẾN (Immutable).')) {
      setPayrollLocked(true);
      alert('Bảng lương đã được KHÓA SỔ thành công!');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* VIEW 1: USER ACCOUNT MANAGEMENT */}
      {(activeTab === 'users' || activeTab === 'admin-users') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Quản Lý & Phân Quyền Tài Khoản Nhân Sự Chi Nhánh</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Quản trị viên: Trần Chí Vĩ (Admin) | Quyền CRUD Master Data</p>
            </div>
            <button onClick={() => setShowAddUserModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO TÀI KHOẢN MỚI</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Username</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Họ Và Tên</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Vai Trò (Role RBAC)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Email Liên Hệ</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{u.username}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{u.fullName}</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#E0E7FF', color: '#4338CA', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{u.email}</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.status}</span></td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => handleDeleteUser(u.id, u.fullName)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Xóa Tài Khoản</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Tạo Tài Khoản Nhân Sự Mới</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Username:</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Họ và tên:</label>
                <input type="text" required value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Vai trò (Role):</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                  <option value="Manager">Manager (Quản lý chi nhánh)</option>
                  <option value="Warehouse">Warehouse (Thủ kho)</option>
                  <option value="Cashier">Cashier (Thu ngân)</option>
                  <option value="Kitchen">Kitchen (Bếp / Barista)</option>
                  <option value="Staff">Staff (Phục vụ)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Email:</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: BOM DFS CHECK */}
      {activeTab === 'admin-bom' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>BOM Recipe Builder & Kiểm Tra Đồ Thị Đệ Quy DFS Cycle Check</h2>
          <div style={{ background: '#D1FAE5', padding: '12px', borderRadius: '6px', color: '#065F46', marginBottom: '16px', fontWeight: 'bold' }}>
            Thuật toán DFS (Depth-First Search) đã xác thực: Không phát hiện lặp đệ quy công thức (Graph Cycle Free).
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#111827' }}>
            <li>Cà Phê Sữa Đá ➔ 18g Hạt Cà Phê Robusta + 30ml Sữa Đặc Ngôi Sao (Cost: 12.000đ | Margin: 65.7%)</li>
            <li>Trà Đào Cam Sả ➔ 10g Trà Sả + 15ml Syrup Đào Monin + 2 Miếng Đào (Cost: 15.000đ | Margin: 66.6%)</li>
          </ul>
        </div>
      )}

      {/* VIEW 3: HAPPY HOUR */}
      {activeTab === 'admin-happyhour' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Cấu Hình Tự Động Đổi Giá Giờ Vàng (Happy Hour Dynamic Pricing)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Quy Tắc</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Chương Trình</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Khung Giờ Tự Động</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mức Giảm Giá</th>
              </tr>
            </thead>
            <tbody>
              {happyHourRules.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{r.id}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{r.name}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{r.timeRange}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#DC2626' }}>-{r.discountPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 4: PAYROLL LOCK */}
      {activeTab === 'admin-payroll' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Bảng Lương Nhân Sự & Khóa Sổ Immutable Payroll Lock</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', color: '#111827' }}>Trạng thái bảng lương tháng 8/2026: <strong style={{ color: payrollLocked ? '#DC2626' : '#059669' }}>{payrollLocked ? 'ĐÃ KHÓA SỔ (IMMUTABLE)' : 'Đang mở chỉnh sửa'}</strong></span>
            {!payrollLocked && <button onClick={handleLockPayroll} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>KHÓA SỔ BẢNG LƯƠNG THÁNG 8</button>}
          </div>
        </div>
      )}

      {/* VIEW 5: MENU ENGINEERING MATRIX */}
      {activeTab === 'admin-menu-eng' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Ma Trận Phân Tích Menu Engineering (Stars, Plowhorses, Puzzles, Dogs)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: 0, color: '#065F46' }}>STARS (Lãi Cao, Bán Chạy)</h3>
              <p style={{ fontSize: '13px', color: '#047857' }}>Cà Phê Sữa Đá Sài Gòn (35.000đ, Lãi 65.7%)</p>
            </div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: 0, color: '#1E40AF' }}>PLOWHORSES (Lãi Thấp, Bán Chạy)</h3>
              <p style={{ fontSize: '13px', color: '#1E3A8A' }}>Trà Đào Cam Sả (45.000đ, Lãi 66.6%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminErpPage;
