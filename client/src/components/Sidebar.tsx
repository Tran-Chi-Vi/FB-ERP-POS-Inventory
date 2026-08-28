import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { fullName: string; role: string } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const role = currentUser?.role || 'Staff';

  // Comprehensive, Strict Role-Isolated Left Menu Items (NO Top Banners, NO Emoji Icons)
  const getMenuItems = () => {
    switch (role) {
      case 'Customer':
        return [
          { id: 'customer-qr', label: 'Menu Điện Tử Gọi Món' },
          { id: 'customer-service', label: 'Tiện Ích Yêu Cầu Tại Bàn' },
          { id: 'customer-loyalty', label: 'Ví Tích Điểm Loyalty' },
        ];

      case 'Staff':
        return [
          { id: 'staff-runner', label: 'Hàng Đợi Trả Món (Runner)' },
          { id: 'staff-kitchen-status', label: 'Soi Trạng Thái Bếp (Read-Only)' },
          { id: 'staff-checkin', label: 'Tự Chấm Công Selfie WiFi' },
        ];

      case 'Kitchen':
        return [
          { id: 'kds-tickets', label: 'KDS Phiếu Order Bếp' },
          { id: 'kds-batch', label: 'Chế Độ Gom Món Nhanh' },
          { id: 'kds-86list', label: 'Khóa Món Tức Thì (86 List)' },
        ];

      case 'Cashier':
        return [
          { id: 'pos', label: 'POS Bán Hàng & Thu Tiền' },
          { id: 'cashier-shift', label: 'Đóng / Mở Ca & Đếm Két' },
        ];

      case 'Warehouse':
        return [
          { id: 'wh-receipt', label: 'Nhập Hàng (Goods Receipt)' },
          { id: 'wh-fefo', label: 'Quản Lý Lô Date FEFO' },
          { id: 'wh-production', label: 'Lệnh Chế Biến Sơ Chế' },
          { id: 'wh-stockcount', label: 'Kiểm Kê Kho & Phiếu Xuất Hủy' },
        ];

      case 'Manager':
        return [
          { id: 'manager-approvals', label: 'Hộp Thư Phê Duyệt Khẩn Cấp' },
          { id: 'manager-live-monitor', label: 'Giám Sát Vận Hành Chi Nhánh' },
          { id: 'manager-scheduling', label: 'Xếp Lịch Ca & Duyệt Phép' },
        ];

      case 'Admin':
        return [
          { id: 'users', label: 'Quản Lý Tài Khoản (Tạo & Xóa User)' },
          { id: 'admin-bom', label: 'Cấu Hình Menu & BOM Builder' },
          { id: 'admin-promotions', label: 'Khuyến Mãi & Conflict Matrix' },
          { id: 'admin-payroll', label: 'Khóa Sổ Bảng Lương' },
          { id: 'admin-pnl', label: 'Báo Cáo Food Cost P&L' },
        ];

      case 'SuperAdmin':
        return [
          { id: 'users', label: 'Quản Lý Tài Khoản Toàn Hệ Thống' },
          { id: 'super-branch', label: 'Quản Lý Chi Nhánh Nhượng Quyền' },
          { id: 'super-audit', label: 'Centralized Audit Log (JSON Diff)' },
          { id: 'super-console', label: 'System Console & Backup DR' },
        ];

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
