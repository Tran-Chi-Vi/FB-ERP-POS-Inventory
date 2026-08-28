import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: { fullName: string; role: string } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const role = currentUser?.role || 'Staff';

  // Strict Role-Based Menu Mapping (No Overlap, No Icons)
  const getMenuItems = () => {
    switch (role) {
      case 'Kitchen':
        return [{ id: 'kds', label: 'KDS Bếp / Bar' }];

      case 'Staff':
        return [{ id: 'staff-runner', label: 'Phục Vụ Bàn & Gọi Món' }];

      case 'Cashier':
        return [{ id: 'pos', label: 'POS Bán Hàng & Thu Tiền' }];

      case 'Warehouse':
        return [{ id: 'inventory', label: 'Quản Lý Kho WMS & FEFO' }];

      case 'Manager':
        return [
          { id: 'manager-dash', label: 'Dashboard Ca Vận Hành' },
          { id: 'manager-void', label: 'Duyệt Khẩn Cấp (Void / Shift Variance)' },
        ];

      case 'Admin':
        return [
          { id: 'users', label: 'Quản Lý Tài Khoản (Tạo & Xóa User)' },
          { id: 'catalog-bom', label: 'Cấu Hình Menu & BOM' },
          { id: 'finance-payroll', label: 'ERP Tài Chính & Khóa Lương' },
          { id: 'bi-reports', label: 'BI Menu Engineering' },
        ];

      case 'SuperAdmin':
        return [
          { id: 'users', label: 'Quản Lý Tài Khoản Toàn Hệ Thống' },
          { id: 'branch-admin', label: 'Quản Lý Đa Chi Nhánh' },
          { id: 'audit-log', label: 'Centralized Audit Log' },
          { id: 'system-console', label: 'System Console & Backup' },
        ];

      case 'Customer':
        return [{ id: 'customer-qr', label: 'Thực Đơn Điện Tử (Dynamic QR)' }];

      default:
        return [{ id: 'pos', label: 'Giao Diện Phục Vụ' }];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div>
            <div className="sidebar-title">F&B ERP POS</div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Enterprise RBAC Matrix</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {currentUser && (
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{currentUser.fullName.charAt(0)}</div>
            <div className="user-details">
              <h4>{currentUser.fullName}</h4>
              <span>{currentUser.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Đăng Xuất">
            Thoát
          </button>
        </div>
      )}
    </aside>
  );
};
