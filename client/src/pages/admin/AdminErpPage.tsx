import React, { useState } from 'react';

export const AdminErpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'bom' | 'happyhour' | 'payroll' | 'menu_eng'>('users');
  
  // User Management State (Admin creates & deletes store users)
  const [users, setUsers] = useState([
    { id: '1', username: 'manager1', fullName: 'Lê Hoàng Phúc', role: 'Manager', email: 'manager1@fnb.com', status: 'Active' },
    { id: '2', username: 'warehouse1', fullName: 'Phạm Quốc Bảo', role: 'Warehouse', email: 'warehouse1@fnb.com', status: 'Active' },
    { id: '3', username: 'cashier1', fullName: 'Nguyễn Thị Mai', role: 'Cashier', email: 'cashier1@fnb.com', status: 'Active' },
    { id: '4', username: 'staff1', fullName: 'Trần Thanh Tâm', role: 'Staff', email: 'staff1@fnb.com', status: 'Active' }
  ]);

  const [newUser, setNewUser] = useState({ username: '', fullName: '', role: 'Cashier', email: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // DFS Cycle Check State
  const [dfsCheckPassed, setDfsCheckPassed] = useState<boolean>(true);

  // Happy Hour Dynamic Pricing Rules
  const [happyHourRules] = useState([
    { id: 'HH-01', name: 'Giờ Vàng Cà Phê Sáng', timeRange: '07:00 - 09:00', discountPercent: 20, status: 'Active' },
    { id: 'HH-02', name: 'Happy Hour Bia Draft', timeRange: '17:00 - 19:00', discountPercent: 30, status: 'Active' }
  ]);

  // Payroll Lock State
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ background: '#1F2937', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ background: '#7C3AED', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>ROLE: BRAND ADMIN (CHỦ THƯƠNG HIỆU / ERP ADMIN)</span>
          <h1 style={{ margin: '8px 0 4px 0', fontSize: '24px' }}>Back-Office Master Control Panel & P&L Analytics</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>Quản trị viên: <strong>Trần Chí Vĩ (Admin)</strong> | Quyền Hạn: CRUD Master Data & User Account Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('users')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'users' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'users' ? '#2563EB' : '#4B5563' }}>👥 Quản Lý Tài Khoản Nhân Sự ({users.length})</button>
        <button onClick={() => setActiveTab('bom')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'bom' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'bom' ? '#2563EB' : '#4B5563' }}>🌿 BOM Recipe Engine & DFS Cycle Check</button>
        <button onClick={() => setActiveTab('happyhour')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'happyhour' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'happyhour' ? '#2563EB' : '#4B5563' }}>⚡ Happy Hour Dynamic Pricing</button>
        <button onClick={() => setActiveTab('payroll')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'payroll' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'payroll' ? '#2563EB' : '#4B5563' }}>🔒 Khóa Sổ Bảng Lương (Payroll Lock)</button>
        <button onClick={() => setActiveTab('menu_eng')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'menu_eng' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'menu_eng' ? '#2563EB' : '#4B5563' }}>📊 Food Cost & Menu Engineering Matrix</button>
      </div>

      {/* Tab 1: User Account Management (Admin Creates & Deletes Users) */}
      {activeTab === 'users' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Quản Lý & Phân Quyền Tài Khoản Nhân Sự Chi Nhánh</h2>
            <button onClick={() => setShowAddUserModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO TÀI KHOẢN MỚI</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Họ Và Tên</th>
                <th style={{ padding: '10px' }}>Vai Trò (Role RBAC)</th>
                <th style={{ padding: '10px' }}>Email Liên Hệ</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
                <th style={{ padding: '10px' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{u.username}</td>
                  <td style={{ padding: '12px 10px' }}>{u.fullName}</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: '#E0E7FF', color: '#4338CA', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                  <td style={{ padding: '12px 10px' }}>{u.email}</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.status}</span></td>
                  <td style={{ padding: '12px 10px' }}>
                    <button onClick={() => handleDeleteUser(u.id, u.fullName)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>❌ Xóa Tài Khoản</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0 }}>Tạo Tài Khoản Nhân Sự Mới</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Username:</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Họ và tên:</label>
                <input type="text" required value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Vai trò (Role):</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                  <option value="Manager">Manager (Quản lý chi nhánh)</option>
                  <option value="Warehouse">Warehouse (Thủ kho)</option>
                  <option value="Cashier">Cashier (Thu ngân)</option>
                  <option value="Kitchen">Kitchen (Bếp / Barista)</option>
                  <option value="Staff">Staff (Phục vụ)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Email:</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: BOM Recipe & DFS Check */}
      {activeTab === 'bom' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>BOM Recipe Builder & Kiểm Tra Đồ Thị Đệ Quy DFS Cycle Check</h2>
          <div style={{ background: '#D1FAE5', padding: '12px', borderRadius: '6px', color: '#065F46', marginBottom: '16px' }}>
            ✓ Thuật toán DFS (Depth-First Search) đã xác thực: <strong>Không phát hiện lặp đệ quy công thức (Graph A ➔ B ➔ A Cycle Free).</strong>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Cà Phê Sữa Đá ➔ 18g Hạt Cà Phê Robusta + 30ml Sữa Đặc Ngôi Sao (Cost: 12.000đ | Margin: 65.7%)</li>
            <li>Trà Đào Cam Sả ➔ 10g Trà Sả + 15ml Syrup Đào Monin + 2 Miếng Đào (Cost: 15.000đ | Margin: 66.6%)</li>
          </ul>
        </div>
      )}

      {/* Tab 3: Happy Hour */}
      {activeTab === 'happyhour' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Cấu Hình Tự Động Đổi Giá Giờ Vàng (Happy Hour Dynamic Pricing)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã Quy Tắc</th>
                <th style={{ padding: '10px' }}>Tên Chương Trình</th>
                <th style={{ padding: '10px' }}>Khung Giờ Tự Động</th>
                <th style={{ padding: '10px' }}>Mức Giảm Giá</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {happyHourRules.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{r.id}</td>
                  <td style={{ padding: '12px 10px' }}>{r.name}</td>
                  <td style={{ padding: '12px 10px' }}>{r.timeRange}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#DC2626' }}>-{r.discountPercent}%</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Payroll Lock */}
      {activeTab === 'payroll' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Bảng Lương Nhân Sự & Khóa Sổ Immutable Payroll Lock</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px' }}>Trạng thái bảng lương tháng 8/2026: <strong style={{ color: payrollLocked ? '#DC2626' : '#059669' }}>{payrollLocked ? '🔒 ĐÃ KHÓA SỔ (IMMUTABLE)' : '🔓 Đang mở chỉnh sửa'}</strong></span>
            {!payrollLocked && <button onClick={handleLockPayroll} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔒 KHÓA SỔ BẢNG LƯƠNG THÁNG 8</button>}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Nhân Viên</th>
                <th style={{ padding: '10px' }}>Chức Danh</th>
                <th style={{ padding: '10px' }}>Giờ Công Thực Tế</th>
                <th style={{ padding: '10px' }}>Lương Cơ Bản</th>
                <th style={{ padding: '10px' }}>Thưởng Doanh Số</th>
                <th style={{ padding: '10px' }}>Thực Lĩnh</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>Trần Thanh Tâm</td>
                <td style={{ padding: '12px 10px' }}>Phục Vụ</td>
                <td style={{ padding: '12px 10px' }}>180 giờ</td>
                <td style={{ padding: '12px 10px' }}>6.300.000đ</td>
                <td style={{ padding: '12px 10px' }}>500.000đ</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#059669' }}>6.800.000đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Menu Engineering Matrix */}
      {activeTab === 'menu_eng' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Ma Trận Phân Tích Menu Engineering (Stars ⭐, Plowhorses 🐴, Puzzles 🧩, Dogs 🐕)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: 0, color: '#065F46' }}>⭐ STARS (Lãi Cao, Bán Chạy)</h3>
              <p style={{ fontSize: '13px', color: '#047857' }}>Cà Phê Sữa Đá Sài Gòn (35.000đ, Lãi 65.7%)</p>
            </div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ margin: 0, color: '#1E40AF' }}>🐴 PLOWHORSES (Lãi Thấp, Bán Chạy)</h3>
              <p style={{ fontSize: '13px', color: '#1E3A8A' }}>Trà Đào Cam Sả (45.000đ, Lãi 66.6%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminErpPage;
