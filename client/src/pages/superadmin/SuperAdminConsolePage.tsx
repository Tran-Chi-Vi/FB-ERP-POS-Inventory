import React, { useState } from 'react';

export const SuperAdminConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'branches' | 'audit' | 'dr' | 'broadcast'>('users');
  
  // System-Wide Users State
  const [allUsers, setAllUsers] = useState([
    { id: 'SA-1', username: 'superadmin', name: 'Nguyễn Văn Quảng', role: 'SuperAdmin', branch: 'Toàn Chuỗi', email: 'superadmin@fnb.com' },
    { id: 'AD-1', username: 'admin', name: 'Trần Chí Vĩ', role: 'Admin', branch: 'Toàn Chuỗi', email: 'admin@fnb.com' },
    { id: 'MGR-1', username: 'manager1', name: 'Lê Hoàng Phúc', role: 'Manager', branch: 'Chi Nhánh Quận 1', email: 'manager1@fnb.com' },
    { id: 'WH-1', username: 'warehouse1', name: 'Phạm Quốc Bảo', role: 'Warehouse', branch: 'Chi Nhánh Quận 1', email: 'warehouse1@fnb.com' },
    { id: 'CSH-1', username: 'cashier1', name: 'Nguyễn Thị Mai', role: 'Cashier', branch: 'Chi Nhánh Quận 1', email: 'cashier1@fnb.com' }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', role: 'Admin', branch: 'Chi Nhánh Quận 1', email: '' });

  // Broadcast Message State
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ background: '#111827', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ background: '#DC2626', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', tracking: '1px' }}>ROLE: SUPERADMIN (QUẢN TRỊ VIÊN HẠ TẦNG TOÀN CHUỖI)</span>
          <h1 style={{ margin: '8px 0 4px 0', fontSize: '24px' }}>System Master Control & Disaster Recovery Console</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>Tài khoản: <strong>Nguyễn Văn Quảng (SuperAdmin)</strong> | Scope: All Tenants (`IgnoreQueryFilters()` Active)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#10B981' }}>SignalR Sockets: <strong>42 Active Connections</strong></div>
          <div style={{ fontSize: '13px', color: '#60A5FA' }}>DB Latency: <strong>4ms (SQL Server Local)</strong></div>
        </div>
      </div>

      {/* Broadcast Banner */}
      {activeBroadcast && (
        <div style={{ background: '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📢 THÔNG BÁO KHẨN CẤP TOÀN HỆ THỐNG: {activeBroadcast}</span>
          <button onClick={() => setActiveBroadcast(null)} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Tắt thông báo</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('users')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'users' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'users' ? '#2563EB' : '#4B5563' }}>👑 Quản Lý Tài Khoản Toàn Chuỗi ({allUsers.length})</button>
        <button onClick={() => setActiveTab('branches')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'branches' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'branches' ? '#2563EB' : '#4B5563' }}>🏢 Quản Lý Chi Nhánh & Phí Bản Quyền</button>
        <button onClick={() => setActiveTab('audit')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'audit' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'audit' ? '#2563EB' : '#4B5563' }}>🔍 Centralized Audit Log & JSON Diff</button>
        <button onClick={() => setActiveTab('dr')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'dr' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'dr' ? '#2563EB' : '#4B5563' }}>🛡️ Disaster Recovery (RTO/RPO Drill)</button>
        <button onClick={() => setActiveTab('broadcast')} style={{ padding: '12px 20px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'broadcast' ? '3px solid #2563EB' : 'none', background: 'transparent', cursor: 'pointer', color: activeTab === 'broadcast' ? '#2563EB' : '#4B5563' }}>📢 Phát Thông Báo Khẩn Cấp</button>
      </div>

      {/* Tab 1: System-Wide Users Management */}
      {activeTab === 'users' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Danh Sách Tất Cả Tài Khoản Hệ Thống (SuperAdmin Scope)</h2>
            <button onClick={() => setShowAddUserModal(true)} style={{ padding: '10px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ TẠO TÀI KHOẢN TOÀN HỆ THỐNG</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Họ Và Tên</th>
                <th style={{ padding: '10px' }}>Vai Trò (Role)</th>
                <th style={{ padding: '10px' }}>Chi Nhánh Quản Lý</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{u.username}</td>
                  <td style={{ padding: '12px 10px' }}>{u.name}</td>
                  <td style={{ padding: '12px 10px' }}><span style={{ background: u.role === 'SuperAdmin' ? '#FEE2E2' : '#E0E7FF', color: u.role === 'SuperAdmin' ? '#991B1B' : '#4338CA', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span></td>
                  <td style={{ padding: '12px 10px' }}>{u.branch}</td>
                  <td style={{ padding: '12px 10px' }}>{u.email}</td>
                  <td style={{ padding: '12px 10px' }}>
                    {u.role !== 'SuperAdmin' && (
                      <button onClick={() => handleDeleteUser(u.id, u.username)} style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>❌ Xóa Vĩnh Viễn</button>
                    )}
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
            <h3 style={{ marginTop: 0 }}>SuperAdmin Tạo Tài Khoản Mới</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Username:</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Họ và tên:</label>
                <input type="text" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Vai trò (Role):</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                  <option value="Admin">Admin (Chủ thương hiệu)</option>
                  <option value="Manager">Manager (Quản lý)</option>
                  <option value="Warehouse">Warehouse (Thủ kho)</option>
                  <option value="Cashier">Cashier (Thu ngân)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Email:</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Khởi Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Branches Management */}
      {activeTab === 'branches' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Danh Sách Chi Nhánh & Phí Bản Quyền Royalty Fee (%)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã Chi Nhánh</th>
                <th style={{ padding: '10px' }}>Tên Chi Nhánh</th>
                <th style={{ padding: '10px' }}>Mạng WiFi BSSID Cho Phép</th>
                <th style={{ padding: '10px' }}>Tỷ Lệ Phí Bản Quyền</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>BR01</td>
                <td style={{ padding: '12px 10px' }}>Chi Nhánh Quận 1 (Flagship)</td>
                <td style={{ padding: '12px 10px' }}>a4:b2:c8:99:11:00</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#059669' }}>5.0% Doanh Thu</td>
                <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Active</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>BR02</td>
                <td style={{ padding: '12px 10px' }}>Chi Nhánh Quận 3</td>
                <td style={{ padding: '12px 10px' }}>b5:c3:d9:00:22:11</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#059669' }}>4.5% Doanh Thu</td>
                <td style={{ padding: '12px 10px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Audit Log & JSON Diff */}
      {activeTab === 'audit' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Centralized Audit Log & Trình So Sánh JSON Diff Viewer</h2>
          <div style={{ background: '#1F2937', color: '#10B981', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
            <div>[CORRELATION-ID: #8921a481] Action: APPROVE_VOID | Table: Order | PerformedBy: Manager</div>
            <div style={{ color: '#EF4444' }}>- BeforeState: &#123; "Status": "Preparing", "TotalAmount": 90000 &#125;</div>
            <div style={{ color: '#10B981' }}>+ AfterState:  &#123; "Status": "Cancelled", "TotalAmount": 0, "Reason": "Khách đổi ý" &#125;</div>
          </div>
        </div>
      )}

      {/* Tab 4: Disaster Recovery */}
      {activeTab === 'dr' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Disaster Recovery Console (RTO/RPO Metrics & 1-Click Restore Drill)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
            <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Cam kết RTO (Recovery Time Objective):</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>&lt; 30 Phút</div>
            </div>
            <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Cam kết RPO (Recovery Point Objective):</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>&lt; 5 Phút</div>
            </div>
          </div>
          <button onClick={() => alert('Đã khởi chạy diễn tập Restore Drill dữ liệu SQL Server sang Database thử nghiệm thành công!')} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 1-CLICK CHẠY DIỄN TẬP KHÔI PHỤC DỮ LIỆU (RESTORE DRILL)</button>
        </div>
      )}

      {/* Tab 5: Broadcast Message */}
      {activeTab === 'broadcast' && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0 }}>Phát Thông Báo Khẩn Cấp Toàn Chuỗi qua WebSocket</h2>
          <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} placeholder="Nhập nội dung thông báo khẩn cấp (ví dụ: Hệ thống bảo trì trong 15 phút)..." style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', marginBottom: '16px' }} />
          <button onClick={handleSendBroadcast} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>📢 PHÁT THÔNG BÁO TOÀN HỆ THỐNG</button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminConsolePage;
