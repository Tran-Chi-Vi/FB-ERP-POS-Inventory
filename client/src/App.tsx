import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/impeccable-theme.css';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import { CustomerQrPage } from './pages/customer/CustomerQrPage';
import { StaffRunnerPage } from './pages/staff/StaffRunnerPage';
import { KdsKitchenPage } from './pages/kitchen/KdsKitchenPage';
import { WarehousePage } from './pages/inventory/WarehousePage';
import { ManagerOperationsPage } from './pages/manager/ManagerOperationsPage';
import { AdminErpPage } from './pages/admin/AdminErpPage';
import { SuperAdminConsolePage } from './pages/superadmin/SuperAdminConsolePage';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [selectedTable, setSelectedTable] = useState<string | null>('Bàn 01');
  const [cart, setCart] = useState<CartItem[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [activeTab, currentUser]);

  const handleLoginSuccess = (user: { fullName: string; role: string }) => {
    setCurrentUser(user);
    // Route user to their dedicated role UI per RACI matrix
    switch (user.role) {
      case 'Kitchen':
        setActiveTab('kds');
        break;
      case 'Staff':
        setActiveTab('staff-runner');
        break;
      case 'Cashier':
        setActiveTab('pos');
        break;
      case 'Warehouse':
        setActiveTab('inventory');
        break;
      case 'Manager':
        setActiveTab('manager-dash');
        break;
      case 'Admin':
        setActiveTab('users');
        break;
      case 'SuperAdmin':
        setActiveTab('users');
        break;
      case 'Customer':
        setActiveTab('customer-qr');
        break;
      default:
        setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const categories = ['Tất Cả', 'Cà Phê', 'Trà & Trà Sữa', 'Bánh Ngọt', 'Toppings'];

  const products: Product[] = [
    { id: '1', name: 'Cà Phê Sữa Đá', price: 29000, category: 'Cà Phê', unit: 'Ly' },
    { id: '2', name: 'Bạc Xỉu Đá', price: 32000, category: 'Cà Phê', unit: 'Ly' },
    { id: '3', name: 'Espresso Intenso', price: 35000, category: 'Cà Phê', unit: 'Tách' },
    { id: '4', name: 'Trà Đào Cam Sả', price: 39000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '5', name: 'Trà Sữa Ô Long', price: 42000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '6', name: 'Bánh Croissant Bơ', price: 25000, category: 'Bánh Ngọt', unit: 'Cái' },
    { id: '7', name: 'Bánh Tiramisu', price: 38000, category: 'Bánh Ngọt', unit: 'Cái' },
    { id: '8', name: 'Trân Châu Đen', price: 8000, category: 'Toppings', unit: 'Phần' },
  ];

  const filteredProducts = selectedCategory === 'Tất Cả' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* LEFT VERTICAL SIDEBAR (STRICT ISOLATION, NO EMOJIS, NO TOP BANNER DUPES) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT WRAPPER */}
      <main className="main-wrapper" ref={mainRef}>
        {/* ROLE 1: CUSTOMER UI */}
        {activeTab === 'customer-qr' && <CustomerQrPage />}

        {/* ROLE 2: STAFF UI */}
        {activeTab === 'staff-runner' && <StaffRunnerPage />}

        {/* ROLE 3: KITCHEN UI */}
        {activeTab === 'kds' && <KdsKitchenPage />}

        {/* ROLE 4: CASHIER TOUCH POS UI */}
        {activeTab === 'pos' && (
          <div className="pos-layout">
            <div className="category-menu">
              <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>DANH MỤC MÓN</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Sơ Đồ Bàn Phục Vụ</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {tables.map((t) => (
                    <button
                      key={t}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #334155',
                        background: selectedTable === t ? '#10b981' : '#0f172a',
                        color: selectedTable === t ? '#fff' : '#94a3b8',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTable(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-grid">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="product-card" onClick={() => addToCart(p)}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '0.1rem 0.4rem', borderRadius: '0.2rem' }}>
                        {p.category}
                      </span>
                      <div className="product-title" style={{ marginTop: '0.5rem' }}>{p.name}</div>
                    </div>
                    <div className="product-price">{p.price.toLocaleString('vi-VN')} đ</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Giỏ Hàng {selectedTable ? `- ${selectedTable}` : ''}</h3>
              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Chưa chọn món nào</p>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                      <div>{item.product.name} x {item.quantity}</div>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #10b981', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span>Tổng Tiền:</span>
                    <span>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => alert('Thanh toán thành công! Tự động trừ kho theo công thức BOM và phát hành HĐĐT.')}
                  >
                    Thanh Toán VietQR / Tiền Mặt (Idempotency UUID)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROLE 5: WAREHOUSE UI */}
        {activeTab === 'inventory' && <WarehousePage />}

        {/* ROLE 6: STORE MANAGER OPERATIONS UI */}
        {(activeTab === 'manager-dash' || activeTab === 'manager-void') && <ManagerOperationsPage />}

        {/* ROLE 7: BRAND ADMIN ERP UI */}
        {(activeTab === 'users' || activeTab === 'catalog-bom' || activeTab === 'finance-payroll' || activeTab === 'bi-reports') && currentUser.role === 'Admin' && (
          <AdminErpPage activeTab={activeTab} />
        )}

        {/* ROLE 8: SUPERADMIN CONSOLE UI */}
        {(activeTab === 'users' || activeTab === 'branch-admin' || activeTab === 'audit-log' || activeTab === 'system-console') && currentUser.role === 'SuperAdmin' && (
          <SuperAdminConsolePage activeTab={activeTab} />
        )}
      </main>
    </div>
  );
};
export default App;
