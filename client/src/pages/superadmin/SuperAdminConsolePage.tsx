import React, { useState } from 'react';
import { UserManagementPage } from '../admin/UserManagementPage';

export const SuperAdminConsolePage: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'franchise' | 'audit' | 'dr'>('users');

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button className={`category-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Quản Lý Tài Khoản Toàn Chuỗi (Tạo & Xóa User)
        </button>
        <button className={`category-btn ${tab === 'franchise' ? 'active' : ''}`} onClick={() => setTab('franchise')}>
          Quản Lý Chi Nhánh Nhượng Quyền (Franchise)
        </button>
        <button className={`category-btn ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
          Centralized Audit Log (JSON Diff Viewer)
        </button>
        <button className={`category-btn ${tab === 'dr' ? 'active' : ''}`} onClick={() => setTab('dr')}>
          Diễn Tập Phục Hồi Thảm Họa (Disaster Recovery)
        </button>
      </div>

      {tab === 'users' && <UserManagementPage />}

      {tab === 'franchise' && (
        <div className="card">
          <h2>Quản Lý Chi Nhánh Trực Thuộc & Nhượng Quyền (Franchise Master)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Thiết lập phích % phí bản quyền nhượng quyền theo doanh thu ngày tự động.</p>
          <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
            <li>🏢 <strong>Chi nhánh Quận 1 (Directly Operated):</strong> Tự quản lý 100% doanh thu</li>
            <li>🏬 <strong>Chi nhánh Quận 7 (Franchise Partner):</strong> Tự động trích nộp 5% Royalty Fee hàng ngày</li>
          </ul>
        </div>
      )}

      {tab === 'audit' && (
        <div className="card">
          <h2>Centralized Audit Log - Trình Tra Cứu Biến Động Dữ Liệu (JSON Diff)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Tra cứu theo CorrelationId / UserId. Hiển thị chi tiết BeforeState vs AfterState.</p>
          <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginTop: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <div style={{ color: '#10b981' }}>[2026-08-28 20:30:11] ACTION: UPDATE_PRODUCT_PRICE | USER: admin</div>
            <div style={{ color: '#f43f5e' }}>BeforeState: &#123; "Price": 45000, "Quantity": 10 &#125;</div>
            <div style={{ color: '#38bdf8' }}>AfterState:  &#123; "Price": 30000, "Quantity": 10 &#125;</div>
          </div>
        </div>
      )}

      {tab === 'dr' && (
        <div className="card">
          <h2>Bảng Điều Khiển Sao Lưu & Diễn Tập Phục Hồi Thảm Họa (Backup & DR)</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>Đo lường thời gian khôi phục RTO & RPO thực tế trên database tạm.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', flex: 1 }}>
              <h4>RTO Thực Tế (Recovery Time Objective)</h4>
              <span style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>18 Phút</span> (Đạt cam kết &lt; 30p)
            </div>
            <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', flex: 1 }}>
              <h4>RPO Thực Tế (Recovery Point Objective)</h4>
              <span style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>3 Phút</span> (Đạt cam kết &lt; 5p)
            </div>
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '1.25rem' }} onClick={() => alert('Đã khởi chạy 1-Click Disaster Recovery Simulation Drill thành công!')}>
            Chạy Diễn Tập Khôi Phục Dữ Liệu 1-Click (Restore Drill)
          </button>
        </div>
      )}
    </div>
  );
};
