import React, { useState } from 'react';

interface SuperAdminConsolePageProps {
  activeTab: string;
}

export const SuperAdminConsolePage: React.FC<SuperAdminConsolePageProps> = ({ activeTab }) => {
  const [allUsers, setAllUsers] = useState([
    { id: 'SA-1', username: 'superadmin', name: 'Nguyễn Văn Quảng', role: 'SuperAdmin', branch: 'Toàn Chuỗi', email: 'superadmin@fnb.com' },
    { id: 'AD-1', username: 'admin', name: 'Trần Chí Vĩ', role: 'Admin', branch: 'Toàn Chuỗi', email: 'admin@fnb.com' },
    { id: 'MGR-1', username: 'manager1', name: 'Lê Hoàng Phúc', role: 'Manager', branch: 'Chi Nhánh Quận 1', email: 'manager1@fnb.com' },
    { id: 'WH-1', username: 'warehouse1', name: 'Phạm Quốc Bảo', role: 'Warehouse', branch: 'Chi Nhánh Quận 1', email: 'warehouse1@fnb.com' },
    { id: 'CSH-1', username: 'cashier1', name: 'Nguyễn Thị Mai', role: 'Cashier', branch: 'Chi Nhánh Quận 1', email: 'cashier1@fnb.com' }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', role: 'Admin', branch: 'Chi Nhánh Quận 1', email: '' });
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.name) return;
    setAllUsers([...allUsers, { id: Date.now().toString(), ...newUser }]);
    setShowAddUserModal(false);
    alert(`SuperAdmin đã khởi tạo tài khoản "${newUser.username}" thành công trên toàn hệ thống!`);
    setNewUser({ username: '', name: '', role: 'Admin', branch: 'Chi Nhánh Quận 1', email: '' });
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (confirm(`SUPERADMIN ACTION: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${username}" khỏi CSDL SQL Server không?`)) {
      setAllUsers(allUsers.filter(u => u.id !== id));
      alert(`Đã xóa vĩnh viễn tài khoản "${username}"!`);
    }
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg) return;
    setActiveBroadcast(broadcastMsg);
    alert(`Đã phát thông báo khẩn cấp tới toàn bộ máy POS và mPOS trên hệ thống: "${broadcastMsg}"`);
    setBroadcastMsg('');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {activeBroadcast && (
        <div style={{ background: '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>THÔNG BÁO KHẨN CẤP TOÀN HỆ THỐNG: {activeBroadcast}</span>
          <button onClick={() => setActiveBroadcast(null)} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Tắt thông báo</button>
        </div>
      )}

      {/* VIEW 1: USERS */}
      {(activeTab === 'users' || activeTab === 'superadmin-users') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Danh Sách Tất Cả Tài Khoản Hệ Thống (SuperAdmin Scope)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Tài khoản: Nguyễn Văn Quảng (SuperAdmin) | Scope: All Tenants (IgnoreQueryFilters Active)</p>
            </div>
            <button onClick={() => setShowAddUserModal(true)} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO TÀI KHOẢN TOÀN HỆ THỐNG</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Username</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Họ Và Tên</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Vai Trò (Role)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Chi Nhánh Quản Lý</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{u.username}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{u.name}</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: u.role === 'SuperAdmin' ? '#FEE2E2' : '#E0E7FF', color: u.role === 'SuperAdmin' ? '#991B1B' : '#4338CA', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{u.branch}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{u.email}</td>
                  <td style={{ padding: '14px 12px' }}>
                    {u.role !== 'SuperAdmin' && (
                      <button onClick={() => handleDeleteUser(u.id, u.username)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Xóa Vĩnh Viễn</button>
                    )}
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
            <h3 style={{ marginTop: 0, color: '#111827' }}>SuperAdmin Tạo Tài Khoản Mới</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Username:</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Họ và tên:</label>
                <input type="text" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Vai trò (Role):</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                  <option value="Admin">Admin (Chủ thương hiệu)</option>
                  <option value="Manager">Manager (Quản lý)</option>
                  <option value="Warehouse">Warehouse (Thủ kho)</option>
                  <option value="Cashier">Cashier (Thu ngân)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Email:</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Khởi Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: BRANCHES */}
      {activeTab === 'super-branches' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Danh Sách Chi Nhánh & Phí Bản Quyền Royalty Fee (%)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Chi Nhánh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Chi Nhánh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mạng WiFi BSSID Cho Phép</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tỷ Lệ Phí Bản Quyền</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>BR01</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>Chi Nhánh Quận 1 (Flagship)</td>
                <td style={{ padding: '14px 12px', color: '#111827' }}>a4:b2:c8:99:11:00</td>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>5.0% Doanh Thu</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: AUDIT LOG */}
      {activeTab === 'super-audit' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Centralized Audit Log & Trình So Sánh JSON Diff Viewer</h2>
          <div style={{ background: '#1F2937', color: '#10B981', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
            <div>[CORRELATION-ID: #8921a481] Action: APPROVE_VOID | Table: Order | PerformedBy: Manager</div>
            <div style={{ color: '#EF4444' }}>- BeforeState: &#123; "Status": "Preparing", "TotalAmount": 90000 &#125;</div>
            <div style={{ color: '#10B981' }}>+ AfterState:  &#123; "Status": "Cancelled", "TotalAmount": 0, "Reason": "Khách đổi ý" &#125;</div>
          </div>
        </div>
      )}

      {/* VIEW 4: DISASTER RECOVERY */}
      {activeTab === 'super-dr' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Disaster Recovery Console (RTO/RPO Metrics & 1-Click Restore Drill)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
            <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Cam kết RTO (Recovery Time Objective):</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>Dưới 30 Phút</div>
            </div>
            <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Cam kết RPO (Recovery Point Objective):</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>Dưới 5 Phút</div>
            </div>
          </div>
          <button onClick={() => alert('Đã khởi chạy diễn tập Restore Drill dữ liệu SQL Server sang Database thử nghiệm thành công!')} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>1-CLICK CHẠY DIỄN TẬP KHÔI PHỤC DỮ LIỆU (RESTORE DRILL)</button>
        </div>
      )}

      {/* VIEW 5: BROADCAST */}
      {activeTab === 'super-broadcast' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Phát Thông Báo Khẩn Cấp Toàn Chuỗi qua WebSocket</h2>
          <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} placeholder="Nhập nội dung thông báo khẩn cấp..." style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', marginBottom: '16px', color: '#111827' }} />
          <button onClick={handleSendBroadcast} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>PHÁT THÔNG BÁO TOÀN HỆ THỐNG</button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminConsolePage;
