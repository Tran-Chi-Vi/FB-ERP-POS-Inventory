import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: (user: { fullName: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [selectedRole, setSelectedRole] = useState('Admin');

  const roles = [
    { id: 'SuperAdmin', label: 'SuperAdmin (Tổng Chuỗi)' },
    { id: 'Admin', label: 'Admin (Chủ Quán)' },
    { id: 'Manager', label: 'Manager (Quản Lý Chi Nhánh)' },
    { id: 'Warehouse', label: 'Warehouse (Thủ Kho)' },
    { id: 'Cashier', label: 'Cashier (Thu Ngân)' },
    { id: 'Kitchen', label: 'Kitchen (Đầu Bếp KDS)' },
    { id: 'Staff', label: 'Staff (Nhân Viên Phục Vụ)' },
    { id: 'Customer', label: 'Customer (Khách Hàng QR)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      fullName: username === 'admin' ? 'Trần Chí Vĩ (Admin)' : `Nhân Viên (${selectedRole})`,
      role: selectedRole
    });
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '3rem' }}>☕</span>
          <h2 style={{ color: '#10b981', marginTop: '0.5rem' }}>Đăng Nhập Hệ Thống</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>F&B ERP POS Inventory Super-App Engine</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên Đăng Nhập / Mã NV</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật Khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phân Quyền Vai Trò (8 Roles Matrix)</label>
            <select
              className="form-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Xác Nhận Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};
