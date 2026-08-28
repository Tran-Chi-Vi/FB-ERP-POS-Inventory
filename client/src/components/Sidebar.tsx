import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: { fullName: string; role: string } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const isManagementRole = currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin';

  const menuItems = [
    { id: 'pos', label: 'POS Bán Hàng', icon: '🛒' },
    { id: 'kds', label: 'KDS Bếp / Bar', icon: '👨‍🍳' },
    { id: 'inventory', label: 'Kho & Độc Tồn (BOM)', icon: '📦' },
    { id: 'crm', label: 'CRM & Loyalty 360', icon: '💎' },
    { id: 'finance', label: 'ERP Tài Chính & PO', icon: '📊' },
    { id: 'bi', label: 'BI Menu Engineering', icon: '⭐' },
    { id: 'hr', label: 'HRM & WiFi Chấm Công', icon: '🆔' },
    ...(isManagementRole ? [{ id: 'users', label: 'Quản Lý Tài Khoản (RBAC)', icon: '🔑' }] : []),
    { id: 'extensions', label: 'FNB Roadmap Extensions', icon: '🚀' },
    { id: 'prompt-skills', label: 'AI Skills & Control', icon: '🤖' },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <span className="sidebar-logo">☕</span>
          <div>
            <div className="sidebar-title">F&B ERP POS</div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super-App Platform</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
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
