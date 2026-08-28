import React, { useState } from 'react';
import { UserManagementPage } from '../admin/UserManagementPage';

interface SuperAdminConsolePageProps {
  activeTab: string;
}

export const SuperAdminConsolePage: React.FC<SuperAdminConsolePageProps> = ({ activeTab }) => {
  // Branch Master State
  const [branches, setBranches] = useState([
    { id: '1', name: 'Chi Nhánh Quận 1', type: 'Trực Thuộc (Directly Operated)', royaltyFee: '0%', status: 'Hoạt Động', revenueToday: '45.200.000 đ' },
    { id: '2', name: 'Chi Nhánh Quận 7', type: 'Nhượng Quyền (Franchise Partner)', royaltyFee: '5%', status: 'Hoạt Động', revenueToday: '38.100.000 đ' },
    { id: '3', name: 'Chi Nhánh Sân Bay Tân Sơn Nhất', type: 'Trực Thuộc (Special Airport Pricing)', royaltyFee: '0%', status: 'Hoạt Động', revenueToday: '62.800.000 đ' },
  ]);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchType, setNewBranchType] = useState('Trực Thuộc (Directly Operated)');

  // Audit Log State
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<any>(null);

  const auditLogs = [
    { id: 'LOG-1001', time: '2026-08-28 20:30:11', user: 'admin (Trần Chí Vĩ)', action: 'UPDATE_PRODUCT_PRICE', details: 'Sửa giá Cà Phê Sữa Đá từ 35.000đ thành 29.000đ', before: '{ "Price": 35000, "Quantity": 10 }', after: '{ "Price": 29000, "Quantity": 10 }' },
    { id: 'LOG-1002', time: '2026-08-28 20:25:40', user: 'superadmin (Nguyễn Văn Quảng)', action: 'CREATE_USER_ACCOUNT', details: 'Tạo mới tài khoản manager1 role Manager', before: 'null', after: '{ "Username": "manager1", "Role": "Manager" }' },
    { id: 'LOG-1003', time: '2026-08-28 20:15:02', user: 'manager1 (Lê Hoàng Phúc)', action: 'APPROVE_VOID_ORDER', details: 'Duyệt hủy món #ORD-102 (Trà Đào Cam Sả)', before: '{ "Status": "PendingApproval" }', after: '{ "Status": "Voided" }' },
  ];

  const filteredLogs = auditLogs.filter(l => l.user.toLowerCase().includes(auditSearch.toLowerCase()) || l.action.toLowerCase().includes(auditSearch.toLowerCase()));

  // Add Branch Handler
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName) return;
    const newB = {
      id: Date.now().toString(),
      name: newBranchName,
      type: newBranchType,
      royaltyFee: newBranchType.includes('Franchise') ? '5%' : '0%',
      status: 'Hoạt Động',
      revenueToday: '0 đ'
    };
    setBranches(prev => [...prev, newB]);
    setShowAddBranchModal(false);
    setNewBranchName('');
    alert(`Đã thêm chi nhánh mới '${newBranchName}' thành công!`);
  };

  return (
    <div>
      {/* 1. USER MANAGEMENT TAB */}
      {activeTab === 'users' && <UserManagementPage />}

      {/* 2. MULTI-BRANCH FRANCHISE TAB */}
      {activeTab === 'branch-admin' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2>Quản Lý Đa Chi Nhánh & Nhượng Quyền (Franchise Master Console)</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Thiết lập mô hình kinh doanh, dải IP WiFi nội bộ, BSSID router và trích nộp % phí bản quyền nhượng quyền tự động.
              </p>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.25rem' }} onClick={() => setShowAddBranchModal(true)}>
              ➕ Thêm Chi Nhánh Mới
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Tên Chi Nhánh</th>
                <th style={{ padding: '0.75rem' }}>Mô Hình Vận Hành</th>
                <th style={{ padding: '0.75rem' }}>Phí Bản Quyền (Royalty Fee)</th>
                <th style={{ padding: '0.75rem' }}>Doanh Thu Hôm Nay</th>
                <th style={{ padding: '0.75rem' }}>Trạng Thái</th>
                <th style={{ padding: '0.75rem' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{b.name}</td>
                  <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{b.type}</td>
                  <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>{b.royaltyFee}</td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{b.revenueToday}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{ padding: '0.3rem 0.6rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => alert(`Cấu hình dải IP WiFi chi nhánh '${b.name}' thành công!`)}>
                      Cấu Hình WiFi / IP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. CENTRALIZED AUDIT LOG TAB */}
      {activeTab === 'audit-log' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2>Centralized Audit Log - Nhật Ký Kiểm Toán Toàn Chuỗi</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Xem vết mọi thao tác nhạy cảm với dấu thời gian nguyên tử và chi tiết JSON Diff BeforeState vs AfterState.
              </p>
            </div>
            <input
              type="text"
              className="form-control"
              style={{ width: '260px' }}
              placeholder="Tìm theo user hoặc hành động..."
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Mã Log</th>
                <th style={{ padding: '0.75rem' }}>Thời Gian</th>
                <th style={{ padding: '0.75rem' }}>Tài Khoản Thao Tác</th>
                <th style={{ padding: '0.75rem' }}>Mã Hành Động</th>
                <th style={{ padding: '0.75rem' }}>Chi Tiết Chi Nhánh</th>
                <th style={{ padding: '0.75rem' }}>Xem Dữ Liệu Gốc</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#38bdf8' }}>{l.id}</td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{l.time}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{l.user}</td>
                  <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>{l.action}</td>
                  <td style={{ padding: '0.75rem' }}>{l.details}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{ padding: '0.3rem 0.6rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }} onClick={() => setSelectedAuditLog(l)}>
                      Soi JSON Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. SYSTEM CONSOLE & BACKUP TAB */}
      {activeTab === 'system-console' && (
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2>System Infrastructure Metrics (Máy Chủ & Hạ Tầng System Console)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #10b981' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tải CPU Server</span>
                <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginTop: '0.25rem' }}>14.2%</h3>
              </div>
              <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Bộ Nhớ RAM</span>
                <h3 style={{ color: '#38bdf8', fontSize: '1.8rem', marginTop: '0.25rem' }}>2.8 GB / 16 GB</h3>
              </div>
              <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Kết Nối Database (SQL Pool)</span>
                <h3 style={{ color: '#f59e0b', fontSize: '1.8rem', marginTop: '0.25rem' }}>24 Connections</h3>
              </div>
              <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #10b981' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Trạng Thái SignalR Mesh</span>
                <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginTop: '0.25rem' }}>🟢 Connected</h3>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Bảng Điều Khiển Sao Lưu & Diễn Tập Phục Hồi Thảm Họa (Disaster Recovery Console)</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Sao lưu Full tự động hàng ngày lúc 00:00 và Transaction Log Backup mỗi 15 phút.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '0.5rem', flex: 1 }}>
                <h4>Chỉ Số RTO Thực Tế (Recovery Time Objective)</h4>
                <span style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold' }}>18 Phút</span>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Mục tiêu cam kết SLA: &lt; 30 phút</p>
              </div>
              <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '0.5rem', flex: 1 }}>
                <h4>Chỉ Số RPO Thực Tế (Recovery Point Objective)</h4>
                <span style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold' }}>3 Phút</span>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Mục tiêu cam kết SLA: &lt; 5 phút</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={() => alert('Khởi tạo bản Sao Lưu Full Database thành công! Lưu trữ tại MinIO Storage.')}>
                📦 Thực Hiện Sao Lưu Khẩn Cấp (Manual Backup)
              </button>
              <button style={{ width: 'auto', padding: '0.75rem 1.5rem', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('Đã khởi chạy 1-Click Disaster Recovery Simulation Drill trên máy chủ phụ thử nghiệm thành công!')}>
                🔄 Diễn Tập Phục Hồi Thảm Họa (Restore Drill)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BRANCH MODAL */}
      {showAddBranchModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Thêm Chi Nhánh Mới Hệ Thống</h3>
            <form onSubmit={handleAddBranch}>
              <div className="form-group">
                <label>Tên Chi Nhánh</label>
                <input type="text" className="form-control" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} placeholder="Chi Nhánh Thủ Đức" required />
              </div>
              <div className="form-group">
                <label>Mô Hình Vận Hành</label>
                <select className="form-control" value={newBranchType} onChange={e => setNewBranchType(e.target.value)}>
                  <option value="Trực Thuộc (Directly Operated)">Trực Thuộc (Directly Operated)</option>
                  <option value="Nhượng Quyền (Franchise Partner)">Nhượng Quyền (Franchise Partner - 5% Royalty Fee)</option>
                  <option value="Trực Thuộc (Special Airport Pricing)">Sân Bay / Vùng Đặc Thù (Special Pricing)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Tạo Chi Nhánh</button>
                <button type="button" style={{ flex: 1, padding: '0.75rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.5rem' }} onClick={() => setShowAddBranchModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON DIFF MODAL */}
      {selectedAuditLog && (
        <div className="auth-overlay">
          <div className="auth-modal" style={{ maxWidth: '600px' }}>
            <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>JSON Diff Viewer - {selectedAuditLog.id}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{selectedAuditLog.time} | {selectedAuditLog.user}</p>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <div style={{ color: '#f43f5e', marginBottom: '0.5rem' }}><strong>BeforeState:</strong> {selectedAuditLog.before}</div>
              <div style={{ color: '#10b981' }}><strong>AfterState:</strong> {selectedAuditLog.after}</div>
            </div>
            <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => setSelectedAuditLog(null)}>Đóng Cửa Sổ</button>
          </div>
        </div>
      )}
    </div>
  );
};
