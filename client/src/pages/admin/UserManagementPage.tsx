import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'superadmin', fullName: 'Nguyễn Văn Quảng', email: 'superadmin@fnb.com', role: 'SuperAdmin', createdAt: '2025-01-01' },
    { id: '2', username: 'admin', fullName: 'Trần Chí Vĩ', email: 'admin@fnb.com', role: 'Admin', createdAt: '2025-01-02' },
    { id: '3', username: 'manager1', fullName: 'Lê Hoàng Phúc', email: 'manager1@fnb.com', role: 'Manager', createdAt: '2025-01-10' },
    { id: '4', username: 'cashier1', fullName: 'Nguyễn Thị Mai', email: 'cashier1@fnb.com', role: 'Cashier', createdAt: '2025-02-01' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Manager');

  const roles = [
    'SuperAdmin',
    'Admin',
    'Manager',
    'Warehouse',
    'Cashier',
    'Kitchen',
    'Staff',
    'Customer',
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      fullName: newFullName || newUsername,
      email: newEmail || `${newUsername}@fnb.com`,
      role: newRole,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setShowModal(false);
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    alert(`Tạo tài khoản mới '${newUser.username}' với Role '${newUser.role}' thành công!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Quản Lý Tài Khoản & Phân Quyền Hệ Thống (RBAC Engine)</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Dành cho Admin & SuperAdmin tạo mới tài khoản và gán phân quyền 8 Roles chuẩn.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '0.75rem 1.25rem' }}
          onClick={() => setShowModal(true)}
        >
          ➕ Tạo Tài Khoản Mới
        </button>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Tên Đăng Nhập</th>
              <th style={{ padding: '0.75rem' }}>Họ Và Tên</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Vai Trò (Role)</th>
              <th style={{ padding: '0.75rem' }}>Ngày Tạo</th>
              <th style={{ padding: '0.75rem' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{u.username}</td>
                <td style={{ padding: '0.75rem' }}>{u.fullName}</td>
                <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: u.role === 'SuperAdmin' ? 'rgba(244,63,94,0.2)' : u.role === 'Admin' ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)',
                      color: u.role === 'SuperAdmin' ? '#f43f5e' : u.role === 'Admin' ? '#10b981' : '#38bdf8',
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{u.createdAt}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: 'rgba(244, 63, 94, 0.15)',
                      color: '#f43f5e',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                    }}
                    onClick={() => alert(`Đã thu hồi tất cả phiên đăng nhập của ${u.username} (Force Logout)!`)}
                  >
                    Cưỡng Chế Đăng Xuất
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE USER MODAL */}
      {showModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Tạo Tài Khoản Mới & Phân Quyền</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Tên Đăng Nhập</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ví dụ: manager_q1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Họ Và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Liên Hệ</label>
                <input
                  type="email"
                  className="form-control"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nguyenvana@fnb.com"
                />
              </div>

              <div className="form-group">
                <label>Mật Khẩu Mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gán Phân Quyền Vai Trò (8 Roles Matrix)</label>
                <select
                  className="form-control"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Tạo Tài Khoản
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Hủy Bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
