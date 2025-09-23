import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/impeccable-theme.css';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'kds' | 'inventory' | 'crm' | 'finance' | 'bi' | 'hr' | 'prompt-skills'>('pos');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });

    if (cartRef.current) {
      gsap.fromTo(cartRef.current, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(1.5)' });
    }
  };

  const sampleProducts: Product[] = [
    { id: '1', name: 'Cà Phê Sữa Đá', price: 29000, unit: 'Ly' },
    { id: '2', name: 'Trà Đào Cam Sả', price: 39000, unit: 'Ly' },
    { id: '3', name: 'Bạc Xỉu Đá', price: 32000, unit: 'Ly' },
    { id: '4', name: 'Bánh Croissant Bơ', price: 25000, unit: 'Cái' },
  ];

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  return (
    <div className="app-container">
      <header className="navbar" ref={headerRef}>
        <div className="brand">
          <span>☕ F&B ERP POS Inventory Super-App</span>
        </div>
        <div className="nav-links">
          <button className={`nav-button ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
            POS Bán Hàng
          </button>
          <button className={`nav-button ${activeTab === 'kds' ? 'active' : ''}`} onClick={() => setActiveTab('kds')}>
            KDS Bếp
          </button>
          <button className={`nav-button ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            Kho & BOM
          </button>
          <button className={`nav-button ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
            CRM & Loyalty
          </button>
          <button className={`nav-button ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
            Tài Chính & PO
          </button>
          <button className={`nav-button ${activeTab === 'bi' ? 'active' : ''}`} onClick={() => setActiveTab('bi')}>
            BI Report & P&L
          </button>
          <button className={`nav-button ${activeTab === 'hr' ? 'active' : ''}`} onClick={() => setActiveTab('hr')}>
            HRM & WiFi Chấm Công
          </button>
          <button className={`nav-button ${activeTab === 'prompt-skills' ? 'active' : ''}`} onClick={() => setActiveTab('prompt-skills')}>
            AI Skills & Prompt
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* POS TAB */}
        {activeTab === 'pos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div>
              <div className="card">
                <h2>Sơ Đồ Bàn - Chi Nhánh Mặc Định</h2>
                <div className="grid-tables">
                  {tables.map((t) => (
                    <div key={t} className={`table-card ${selectedTable === t ? 'serving' : 'available'}`} onClick={() => setSelectedTable(t)}>
                      <h3>{t}</h3>
                      <p>{selectedTable === t ? 'Đang chọn' : 'Trống'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>Thực Đơn Món Ăn & Đồ Uống</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {sampleProducts.map((p) => (
                    <div key={p.id} style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem', cursor: 'pointer' }} onClick={() => addToCart(p)}>
                      <h4>{p.name}</h4>
                      <p style={{ color: '#10b981', fontWeight: 'bold' }}>{p.price.toLocaleString('vi-VN')} đ / {p.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" ref={cartRef}>
              <h2>Giỏ Hàng {selectedTable ? `- ${selectedTable}` : ''}</h2>
              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>Chưa chọn món nào</p>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                      <div>{item.product.name} x {item.quantity}</div>
                      <div style={{ fontWeight: 'bold' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #10b981', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span>Tổng Tiền:</span>
                    <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <button
                    style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => alert('Thanh toán thành công! Tự động trừ kho theo định lượng BOM & lưu Append-Only Inventory Ledger.')}
                  >
                    Xác Nhận Thanh Toán (Split Bill / Dynamic QR)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KDS TAB */}
        {activeTab === 'kds' && (
          <div className="card">
            <h2>KDS Kitchen Queue Realtime (SignalR Integrated)</h2>
            <p>Màn hình hiển thị đơn hàng cho các trạm bếp Bar, Bếp Nóng với Timer & SLA Alerting.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h3>Bàn 01 - Đơn ORD-20260828-A1</h3>
                <p>2x Cà Phê Sữa Đá (Đường 50%, Đá 100%)</p>
                <p style={{ color: '#f59e0b' }}>⏱️ Thời gian chờ: 03:45</p>
                <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Đã Báo Hoàn Thành</button>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="card">
            <h2>Quản Lý Tồn Kho Chi Tiết F&B, Lô Hàng & Hạn Sử Dụng (FEFO/FIFO)</h2>
            <p>Hệ thống sổ cái tồn kho dạng **Append-Only Ledger** (Tuyệt đối không sửa/xóa trực tiếp số lượng).</p>
            <ul>
              <li><strong>Hạt Cà Phê Robusta:</strong> Tồn kho: 50,000 g | HSD: 2027-01-15 (Lô L01) | Quy tắc FEFO</li>
              <li><strong>Sữa Đặc Lon:</strong> Tồn kho: 20,000 ml | HSD: 2026-12-30 (Lô L02) | Quy tắc FIFO</li>
            </ul>
          </div>
        )}

        {/* CRM TAB */}
        {activeTab === 'crm' && (
          <div className="card">
            <h2>CRM Customer 360, Tích Điểm Loyalty & Mã Khuyến Mãi</h2>
            <p>Hệ thống hồ sơ khách hàng 360, tích điểm tự động theo cấp bậc thành viên (Bronze, Silver, Gold, Diamond).</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', color: '#10b981', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Họ Và Tên</th>
                  <th style={{ padding: '0.5rem' }}>Số Điện Thoại</th>
                  <th style={{ padding: '0.5rem' }}>Hạng Thành Viên</th>
                  <th style={{ padding: '0.5rem' }}>Ví Điểm Loyalty</th>
                  <th style={{ padding: '0.5rem' }}>Tổng Chi Tiêu</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>Nguyễn Văn A</td>
                  <td style={{ padding: '0.5rem' }}>0988111222</td>
                  <td style={{ padding: '0.5rem', color: '#f59e0b', fontWeight: 'bold' }}>Gold 🥇</td>
                  <td style={{ padding: '0.5rem' }}>1,250 điểm</td>
                  <td style={{ padding: '0.5rem' }}>12,500,000 đ</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.5rem' }}>Trần Thị B</td>
                  <td style={{ padding: '0.5rem' }}>0977333444</td>
                  <td style={{ padding: '0.5rem', color: '#38bdf8', fontWeight: 'bold' }}>Diamond 💎</td>
                  <td style={{ padding: '0.5rem' }}>5,400 điểm</td>
                  <td style={{ padding: '0.5rem' }}>54,000,000 đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="card">
            <h2>Tài Chính Kế Toán, Đơn Mua Hàng (PO) & Hóa Đơn Điện Tử</h2>
            <p>Tự động hạch toán doanh thu từ POS và chi phí từ Kho nguyên liệu.</p>
            <ul>
              <li><strong>Đơn Mua Hàng PO-2026-001:</strong> Nhập 50kg Hạt Cà Phê | Trạng thái: Đã Phê Duyệt</li>
              <li><strong>Hóa Đơn Điện Tử (Nghị định 123):</strong> Đã phát hành tự động 1,420 hóa đơn GTGT.</li>
            </ul>
          </div>
        )}

        {/* BI DASHBOARD TAB */}
        {activeTab === 'bi' && (
          <div className="card">
            <h2>BI Dashboard - Menu Engineering Matrix & Báo Cáo P&L Realtime</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem' }}>
                <h3>Phân Tích Menu Engineering Matrix</h3>
                <p>⭐ <strong>Star (Món Ngon & Lời Cao):</strong> Cà Phê Sữa Đá</p>
                <p>🐴 <strong>Plowhorse (Bán Chạy & Lời Ít):</strong> Bạc Xỉu Đá</p>
                <p>🧩 <strong>Puzzle (Lời Cao & Bán Chậm):</strong> Trà Đào Cam Sả</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem' }}>
                <h3>Báo Cáo Lãi - Lỗ (P&L) Realtime</h3>
                <p style={{ color: '#10b981' }}>📈 Doanh Thu Gộp: 185,400,000 đ</p>
                <p style={{ color: '#f43f5e' }}>📉 Giá Vốn Hàng Bán (COGS): 55,620,000 đ</p>
                <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>💰 Lợi Nhuận Ròng: 129,780,000 đ (Tỷ suất: 70%)</p>
              </div>
            </div>
          </div>
        )}

        {/* HRM TAB */}
        {activeTab === 'hr' && (
          <div className="card">
            <h2>Quản Lý Nhân Sự, Chấm Công WiFi Nội Bộ & Bảng Lương</h2>
            <p>Hệ thống chống gian lận chấm công qua BSSID/IP mạng WiFi nội bộ cửa hàng.</p>
            <button
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => alert('Chấm công WiFi thành công trên BSSID: 00:11:22:33:44:55 (IP: 192.168.1.102)!')}
            >
              Chấm Công WiFi Cửa Hàng
            </button>
          </div>
        )}

        {/* PROMPT & SKILLS TAB */}
        {activeTab === 'prompt-skills' && (
          <div className="card">
            <h2>AI Prompt & Skills Control Panel (6 Repos GitHub + Apriori AI)</h2>
            <ul>
              <li><strong>pbakaus/impeccable:</strong> GSAP Micro-interactions</li>
              <li><strong>mattpocock/skills:</strong> TypeScript & React Standards</li>
              <li><strong>DietrichGebert/ponytail:</strong> Async Pipeline Helper</li>
              <li><strong>linshenkx/prompt-optimizer:</strong> Prompt Cleansing Engine</li>
              <li><strong>multica-ai/andrej-karpathy-skills:</strong> Minimal Code & Single Source of Truth</li>
              <li><strong>obra/superpowers:</strong> Automated Workflow Superpowers</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
