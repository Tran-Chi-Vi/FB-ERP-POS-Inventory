import React, { useState } from 'react';

interface SuperAdminConsolePageProps {
  activeTab: string;
}

interface AuditLogEntry {
  id: string;
  correlationId: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  beforeState: string;
  afterState: string;
}

interface BranchEntry {
  id: string;
  code: string;
  name: string;
  wifiBssid: string;
  royaltyFee: number;
  status: 'Active' | 'Inactive';
}

export const SuperAdminConsolePage: React.FC<SuperAdminConsolePageProps> = ({ activeTab }) => {
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

  // Centralized Audit Logs State
  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-1001',
      correlationId: '8921a481-90a1',
      action: 'APPROVE_VOID',
      entityType: 'Order',
      entityId: 'ORD-9921',
      performedBy: 'Lê Hoàng Phúc (manager1)',
      role: 'Manager',
      ipAddress: '192.168.1.15',
      timestamp: '2026-08-28 21:45:12',
      beforeState: JSON.stringify({ Status: 'Preparing', TotalAmount: 90000, ItemsCount: 2, IsApproved: false }, null, 2),
      afterState: JSON.stringify({ Status: 'Cancelled', TotalAmount: 0, Reason: 'Khách đổi ý', IsApproved: true, ApprovedByPIN: '9921' }, null, 2)
    },
    {
      id: 'LOG-1002',
      correlationId: '7721b902-12c8',
      action: 'PAYROLL_LOCK',
      entityType: 'PayrollRecord',
      entityId: 'PAY-2026-08',
      performedBy: 'Trần Chí Vĩ (admin)',
      role: 'Admin',
      ipAddress: '192.168.1.50',
      timestamp: '2026-08-28 20:30:00',
      beforeState: JSON.stringify({ MonthYear: '2026-08', IsLocked: false, TotalPayout: 45800000 }, null, 2),
      afterState: JSON.stringify({ MonthYear: '2026-08', IsLocked: true, TotalPayout: 45800000, ImmutableHash: '0x89f1a23b...' }, null, 2)
    },
    {
      id: 'LOG-1003',
      correlationId: '5512c003-88e4',
      action: 'STOCK_ADJUSTMENT',
      entityType: 'InventoryLot',
      entityId: 'LOT-20260820-001',
      performedBy: 'Phạm Quốc Bảo (warehouse1)',
      role: 'Warehouse',
      ipAddress: '192.168.1.88',
      timestamp: '2026-08-28 19:12:45',
      beforeState: JSON.stringify({ Sku: 'RAW-002', LotNumber: 'LOT-20260820-001', Quantity: 50 }, null, 2),
      afterState: JSON.stringify({ Sku: 'RAW-002', LotNumber: 'LOT-20260820-001', Quantity: 45, Reason: 'Hào hụt kiểm kê 5 hộp' }, null, 2)
    },
    {
      id: 'LOG-1004',
      correlationId: '4410a112-33d1',
      action: 'DISASTER_RESTORE',
      entityType: 'DatabaseSnapshot',
      entityId: 'SNAP-20260827-EOD',
      performedBy: 'Nguyễn Văn Quảng (superadmin)',
      role: 'SuperAdmin',
      ipAddress: '127.0.0.1',
      timestamp: '2026-08-28 18:00:00',
      beforeState: JSON.stringify({ DbName: 'FbErpPosDb', TargetInstance: 'DESKTOP-JE3MPP4\\ViDay', RestoreStatus: 'Idle' }, null, 2),
      afterState: JSON.stringify({ DbName: 'FbErpPosDb', TargetInstance: 'DESKTOP-JE3MPP4\\ViDay', RestoreStatus: 'Success', RtoMinutes: 4.2 }, null, 2)
    }
  ]);

  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('ALL');

  // Branch Management State
  const [branches, setBranches] = useState<BranchEntry[]>([
    { id: '1', code: 'BR01', name: 'Chi Nhánh Quận 1 (Flagship)', wifiBssid: 'a4:b2:c8:99:11:00', royaltyFee: 5.0, status: 'Active' },
    { id: '2', code: 'BR02', name: 'Chi Nhánh Quận 3', wifiBssid: 'b5:c3:d9:00:22:11', royaltyFee: 4.5, status: 'Active' }
  ]);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranch, setNewBranch] = useState({ code: '', name: '', wifiBssid: '', royaltyFee: 5.0 });

  // Disaster Recovery State
  const [drSimulating, setDrSimulating] = useState(false);
  const [drProgress, setDrProgress] = useState(0);

  // Broadcast Message State
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);
  const [broadcastHistory, setBroadcastHistory] = useState([
    { id: '1', text: 'Hệ thống cập nhật menu tự động qua SignalR!', time: '10 phút trước', priority: 'Normal' }
  ]);

  // Handlers
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

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.code || !newBranch.name) return;
    setBranches([...branches, { id: Date.now().toString(), ...newBranch, status: 'Active' }]);
    setShowAddBranchModal(false);
    alert(`Đã thêm chi nhánh mới "${newBranch.name}" với tỷ lệ phí bản quyền ${newBranch.royaltyFee}%!`);
    setNewBranch({ code: '', name: '', wifiBssid: '', royaltyFee: 5.0 });
  };

  const handleStartDrDrill = () => {
    setDrSimulating(true);
    setDrProgress(10);
    const interval = setInterval(() => {
      setDrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDrSimulating(false);
          alert('DIỄN TẬP KHÔI PHỤC DỮ LIỆU (RESTORE DRILL) THÀNH CÔNG 100%! RTO: 3.5 Phút | RPO: 0 Phút (Zero Data Loss).');
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg) return;
    setActiveBroadcast(broadcastMsg);
    setBroadcastHistory([{ id: Date.now().toString(), text: broadcastMsg, time: 'Vừa xong', priority: 'Urgent' }, ...broadcastHistory]);
    alert(`Đã phát thông báo khẩn cấp tới toàn bộ máy POS và mPOS trên hệ thống: "${broadcastMsg}"`);
    setBroadcastMsg('');
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.correlationId.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                          log.performedBy.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1150px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {activeBroadcast && (
        <div style={{ background: '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>THÔNG BÁO KHẨN CẤP TOÀN HỆ THỐNG: {activeBroadcast}</span>
          <button onClick={() => setActiveBroadcast(null)} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Tắt thông báo</button>
        </div>
      )}

      {/* VIEW 1: SYSTEM-WIDE USERS */}
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

      {/* VIEW 2: BRANCHES & ROYALTY FEE */}
      {activeTab === 'super-branches' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Quản Lý Chi Nhánh & Phí Bản Quyền Royalty Fee (%)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Cấu hình mạng WiFi BSSID hợp lệ cho điểm danh chấm công từng chi nhánh.</p>
            </div>
            <button onClick={() => setShowAddBranchModal(true)} style={{ padding: '10px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ THÊM CHI NHÁNH MỚI</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Chi Nhánh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tên Chi Nhánh</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mạng WiFi BSSID Bắt Buộc</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Tỷ Lệ Phí Bản Quyền (%)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{b.code}</td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{b.name}</td>
                  <td style={{ padding: '14px 12px', color: '#2563EB', fontWeight: 'bold' }}>{b.wifiBssid}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{b.royaltyFee}% Doanh Thu</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: CENTRALIZED AUDIT LOGS & INTERACTIVE JSON DIFF */}
      {activeTab === 'super-audit' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Centralized Audit Log & Trình So Sánh JSON Diff Viewer</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4B5563' }}>Nhật ký kiểm toán truy vết nguyên tử (Correlation ID, IP Address, JSON State Before/After).</p>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Tìm kiếm Correlation ID / Người thực hiện / Hành động:</label>
              <input type="text" value={auditSearchQuery} onChange={(e) => setAuditSearchQuery(e.target.value)} placeholder="Nhập từ khóa tìm kiếm truy vết..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Lọc theo Action:</label>
              <select value={auditActionFilter} onChange={(e) => setAuditActionFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }}>
                <option value="ALL">Tất cả hành động (ALL)</option>
                <option value="APPROVE_VOID">APPROVE_VOID (Duyệt hủy đơn)</option>
                <option value="PAYROLL_LOCK">PAYROLL_LOCK (Khóa sổ lương)</option>
                <option value="STOCK_ADJUSTMENT">STOCK_ADJUSTMENT (Hào hụt kho)</option>
                <option value="DISASTER_RESTORE">DISASTER_RESTORE (Khôi phục DB)</option>
              </select>
            </div>
          </div>

          {/* Audit Log Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Mã Log</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Correlation ID</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Hành Động (Action)</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Người Thực Hiện</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>IP Address</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>Thời Gian</th>
                <th style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>JSON Diff</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#111827' }}>{log.id}</td>
                  <td style={{ padding: '14px 12px', color: '#2563EB', fontFamily: 'monospace', fontWeight: 'bold' }}>{log.correlationId}</td>
                  <td style={{ padding: '14px 12px' }}><span style={{ background: '#E0E7FF', color: '#4338CA', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{log.action}</span></td>
                  <td style={{ padding: '14px 12px', color: '#111827' }}>{log.performedBy}</td>
                  <td style={{ padding: '14px 12px', color: '#4B5563', fontFamily: 'monospace' }}>{log.ipAddress}</td>
                  <td style={{ padding: '14px 12px', color: '#4B5563', fontSize: '13px' }}>{log.timestamp}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => setSelectedAuditLog(log)} style={{ padding: '6px 14px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Xem JSON Diff</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* JSON DIFF MODAL */}
      {selectedAuditLog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#111827', fontWeight: 'bold' }}>JSON Diff Analysis: {selectedAuditLog.action}</h3>
                <span style={{ fontSize: '12px', color: '#2563EB', fontFamily: 'monospace', fontWeight: 'bold' }}>CorrelationID: #{selectedAuditLog.correlationId}</span>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} style={{ padding: '6px 14px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng Modal</button>
            </div>

            <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px' }}>
              Thực hiện bởi: <strong>{selectedAuditLog.performedBy}</strong> ({selectedAuditLog.role}) | IP Address: <strong>{selectedAuditLog.ipAddress}</strong> | Thời gian: <strong>{selectedAuditLog.timestamp}</strong>
            </div>

            {/* Side by Side Diff Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#DC2626', marginBottom: '6px' }}>State Before (Trạng Thái Trước Mutation):</div>
                <pre style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '14px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {selectedAuditLog.beforeState}
                </pre>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#059669', marginBottom: '6px' }}>State After (Trạng Thái Sau Mutation):</div>
                <pre style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '14px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {selectedAuditLog.afterState}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: DISASTER RECOVERY */}
      {activeTab === 'super-dr' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Disaster Recovery Console (RTO/RPO Metrics & 1-Click Restore Drill)</h2>
          <p style={{ color: '#4B5563', fontSize: '14px' }}>Hệ thống khôi phục dữ liệu tự động cho SQL Server instance DESKTOP-JE3MPP4\ViDay.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
            <div style={{ background: '#F3F4F6', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '13px', color: '#4B5563', fontWeight: 'bold' }}>Cam kết RTO (Recovery Time Objective):</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>Dưới 30 Phút</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Thời gian tối đa khôi phục hoàn toàn dịch vụ POS</div>
            </div>
            <div style={{ background: '#F3F4F6', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '13px', color: '#4B5563', fontWeight: 'bold' }}>Cam kết RPO (Recovery Point Objective):</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>Dưới 5 Phút</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Mức độ mất mát dữ liệu tối đa chấp nhận được</div>
            </div>
          </div>

          {drSimulating && (
            <div style={{ marginBottom: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E40AF', marginBottom: '8px' }}>Đang thực hiệnRestore Drill SQL Server... {drProgress}%</div>
              <div style={{ width: '100%', background: '#DBEAFE', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${drProgress}%`, background: '#2563EB', height: '100%', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          )}

          <button onClick={handleStartDrDrill} disabled={drSimulating} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: drSimulating ? 'not-allowed' : 'pointer' }}>
            {drSimulating ? 'Đang Diễn Tập Khôi Phục...' : '1-CLICK CHẠY DIỄN TẬP KHÔI PHỤC DỮ LIỆU (RESTORE DRILL)'}
          </button>
        </div>
      )}

      {/* VIEW 5: BROADCAST MESSAGE */}
      {activeTab === 'super-broadcast' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#111827', fontWeight: 'bold' }}>Phát Thông Báo Khẩn Cấp Toàn Chuỗi qua WebSocket</h2>
          <p style={{ color: '#4B5563', fontSize: '14px' }}>Thông báo sẽ nhảy banner trực tiếp trên màn hình của tất cả Thu Ngân POS, Phục Vụ mPOS và Bếp KDS.</p>

          <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} placeholder="Nhập nội dung thông báo khẩn cấp (ví dụ: Hệ thống bảo trì trong 15 phút)..." style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', marginBottom: '16px', color: '#111827', fontSize: '14px' }} />
          <button onClick={handleSendBroadcast} style={{ padding: '12px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>PHÁT THÔNG BÁO TOÀN HỆ THỐNG</button>

          <h3 style={{ fontSize: '16px', marginTop: '24px', color: '#111827' }}>Lịch Sử Các Thông Báo Đã Phát</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '12px', lineHeight: '1.8', color: '#111827' }}>
            {broadcastHistory.map((item) => (
              <li key={item.id}>
                <strong>[{item.time}]</strong> {item.text} <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{item.priority}</span>
              </li>
            ))}
          </ul>
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

      {/* ADD BRANCH MODAL */}
      {showAddBranchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Thêm Chi Nhánh Mới</h3>
            <form onSubmit={handleAddBranch}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Mã Chi Nhánh (Ví dụ: BR03):</label>
                <input type="text" required value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tên Chi Nhánh:</label>
                <input type="text" required value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Địa Chỉ WiFi BSSID (Đểm danh):</label>
                <input type="text" required value={newBranch.wifiBssid} onChange={(e) => setNewBranch({ ...newBranch, wifiBssid: e.target.value })} placeholder="c6:d4:e0:11:22:33" style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#111827', fontWeight: 'bold' }}>Tỷ Lệ Phí Bản Quyền (%):</label>
                <input type="number" step="0.1" required value={newBranch.royaltyFee} onChange={(e) => setNewBranch({ ...newBranch, royaltyFee: Number(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddBranchModal(false)} style={{ padding: '8px 16px', background: '#9CA3AF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm Chi Nhánh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminConsolePage;
