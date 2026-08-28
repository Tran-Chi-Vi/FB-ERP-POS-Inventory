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

interface PaidInvoice {
  id: string;
  table: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  timestamp: string;
}

interface PendingBill {
  billCode: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PendingPayment' | 'Paid';
  timestamp: string;
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [selectedTable, setSelectedTable] = useState<string | null>('Bàn 01');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // PENDING QR BILLS WAITING FOR CASHIER PAYMENT FIRST
  const [pendingBills, setPendingBills] = useState<PendingBill[]>(() => {
    const saved = localStorage.getItem('fnb_pending_bills');
    return saved ? JSON.parse(saved) : [
      {
        billCode: 'BILL-8942',
        table: 'Bàn 04',
        items: [
          { name: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, price: 29000 },
          { name: 'Trà Đào Cam Sả Tươi', quantity: 1, price: 39000 },
          { name: 'Bánh Croissant Bơ Bơ', quantity: 1, price: 25000 }
        ],
        totalAmount: 122000,
        status: 'PendingPayment',
        timestamp: '21:30:15'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('fnb_pending_bills', JSON.stringify(pendingBills));
  }, [pendingBills]);

  const [paidInvoices, setPaidInvoices] = useState<PaidInvoice[]>([
    {
      id: 'HD-9921',
      table: 'Bàn 04',
      items: [
        { product: { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 29000, category: 'Cà Phê', unit: 'Ly' }, quantity: 2 },
        { product: { id: '4', name: 'Trà Đào Cam Sả Tươi', price: 39000, category: 'Trà & Trà Sữa', unit: 'Ly' }, quantity: 1 }
      ],
      totalAmount: 97000,
      paymentMethod: 'Chuyển Khoản VietQR',
      timestamp: '21:15:30'
    }
  ]);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current, { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [activeTab, currentUser]);

  const handleLoginSuccess = (user: { fullName: string; role: string }) => {
    setCurrentUser(user);
    switch (user.role) {
      case 'Kitchen':
        setActiveTab('kds-tickets');
        break;
      case 'Staff':
        setActiveTab('staff-runner');
        break;
      case 'Cashier':
        setActiveTab('pos');
        break;
      case 'Warehouse':
        setActiveTab('wh-inventory');
        break;
      case 'Manager':
        setActiveTab('manager-approvals');
        break;
      case 'Admin':
        setActiveTab('admin-users');
        break;
      case 'SuperAdmin':
        setActiveTab('superadmin-users');
        break;
      case 'Customer':
        setActiveTab('customer-menu');
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
    { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 29000, category: 'Cà Phê', unit: 'Ly' },
    { id: '2', name: 'Bạc Xỉu Đá Ngọt Dịu', price: 32000, category: 'Cà Phê', unit: 'Ly' },
    { id: '3', name: 'Espresso Intenso', price: 35000, category: 'Cà Phê', unit: 'Tách' },
    { id: '4', name: 'Trà Đào Cam Sả Tươi', price: 39000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '5', name: 'Trà Sữa Ô Long', price: 42000, category: 'Trà & Trà Sữa', unit: 'Ly' },
    { id: '6', name: 'Bánh Croissant Bơ Bơ', price: 25000, category: 'Bánh Ngọt', unit: 'Cái' },
    { id: '7', name: 'Bánh Tiramisu Ý', price: 38000, category: 'Bánh Ngọt', unit: 'Cái' },
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

  const decreaseQuantity = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item));
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutPayment = () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newInvoice: PaidInvoice = {
      id: `HD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: selectedTable || 'Bàn Thu Ngân',
      items: [...cart],
      totalAmount: totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR / Tiền Mặt',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // Send ticket to KDS Kitchen ONLY AFTER PAYMENT CONFIRMED!
    const kdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    const newKdsTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      orderNo: newInvoice.id,
      table: newInvoice.table,
      station: 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      items: cart.map(c => ({ id: c.product.id, name: c.product.name, quantity: c.quantity, note: 'Đã thanh toán tại quầy' }))
    };
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([newKdsTicket, ...kdsTickets]));

    setPaidInvoices([newInvoice, ...paidInvoices]);
    setCart([]); // Reset giỏ hàng ngay lập tức!
    alert(`THANH TOÁN THÀNH CÔNG!\n- Hóa đơn ${newInvoice.id} trị giá ${totalAmount.toLocaleString('vi-VN')}đ tại ${newInvoice.table} đã thanh toán thành công.\n- Lệnh chế biến đã được tự động chuyển sang Bếp / Barista theo số Bill!`);
  };

  const handlePayPendingBill = (bill: PendingBill) => {
    // Pay pending bill from QR
    const newInvoice: PaidInvoice = {
      id: bill.billCode,
      table: bill.table,
      items: bill.items.map((b, idx) => ({
        product: { id: idx.toString(), name: b.name, price: b.price, category: 'Món QR', unit: 'Phần' },
        quantity: b.quantity
      })),
      totalAmount: bill.totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR Tại Quầy',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // Push new KDS ticket for Kitchen
    const kdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    const newKdsTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      orderNo: bill.billCode,
      table: bill.table,
      station: 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      items: bill.items.map((b, idx) => ({ id: idx.toString(), name: b.name, quantity: b.quantity, note: 'Đã thanh toán mã Bill' }))
    };
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([newKdsTicket, ...kdsTickets]));

    // Remove bill from pending list
    const updatedPending = pendingBills.filter(p => p.billCode !== bill.billCode);
    setPendingBills(updatedPending);
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    // Save to paid invoices
    setPaidInvoices([newInvoice, ...paidInvoices]);

    alert(`XÁC NHẬN THANH TOÁN MÃ BILL ${bill.billCode} THÀNH CÔNG!\n- Tổng tiền: ${bill.totalAmount.toLocaleString('vi-VN')}đ tại ${bill.table}.\n- Bếp / Barista đã nhận lệnh chế biến và Phục vụ sẽ giao món theo Mã Bill!`);
  };

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* LEFT VERTICAL SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT WRAPPER */}
      <main className="main-wrapper" ref={mainRef}>
        {/* ROLE 1: CUSTOMER UI */}
        {(activeTab.startsWith('customer-')) && <CustomerQrPage activeTab={activeTab} />}

        {/* ROLE 2: STAFF UI */}
        {(activeTab.startsWith('staff-')) && <StaffRunnerPage activeTab={activeTab} />}

        {/* ROLE 3: KITCHEN UI */}
        {(activeTab.startsWith('kds-')) && <KdsKitchenPage activeTab={activeTab} />}

        {/* ROLE 4: CASHIER TOUCH POS UI */}
        {activeTab === 'pos' && (
          <div>
            {/* PENDING QR BILLS QUEUE - PAY FIRST RULE */}
            {pendingBills.length > 0 && (
              <div className="card" style={{ marginBottom: '1.25rem', background: '#FEF3C7', border: '2px solid #F59E0B' }}>
                <h3 style={{ margin: 0, color: '#92400E', fontWeight: 'bold' }}>Hàng Đợi Mã Bill QR Chờ Thanh Toán Tại Quầy (Thanh Toán Trước Ra Món)</h3>
                <p style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: '#78350F' }}>Khách hàng đã chốt đơn QR tại bàn. Thu ngân bấm xác nhận nhận tiền để Bếp bắt đầu pha chế!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pendingBills.map((b) => (
                    <div key={b.billCode} style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '6px', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', background: '#2563EB', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{b.billCode}</span>
                        <strong style={{ marginLeft: '8px', color: '#0F172A' }}>{b.table}</strong>
                        <span style={{ marginLeft: '12px', fontSize: '0.85rem', color: '#475569' }}>
                          Món: {b.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#059669' }}>{b.totalAmount.toLocaleString('vi-VN')} đ</span>
                        <button
                          onClick={() => handlePayPendingBill(b)}
                          style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Xác Nhận Nhận Tiền & Chuyển Bếp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pos-layout">
              <div className="category-menu">
                <h3 style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 'bold' }}>DANH MỤC MÓN</h3>
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
                  <h3 style={{ marginBottom: '0.75rem', color: '#0F172A', fontWeight: 'bold' }}>Sơ Đồ Bàn Phục Vụ</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {tables.map((t) => (
                      <button
                        key={t}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #CBD5E1',
                          background: selectedTable === t ? '#059669' : '#FFFFFF',
                          color: selectedTable === t ? '#fff' : '#0F172A',
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
                        <span style={{ fontSize: '0.75rem', color: '#1E40AF', background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 'bold' }}>
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
                <h3 style={{ color: '#0F172A', fontWeight: 'bold' }}>Giỏ Hàng {selectedTable ? `- ${selectedTable}` : ''}</h3>
                {cart.length === 0 ? (
                  <p style={{ color: '#64748B', marginTop: '1rem' }}>Chưa chọn món nào</p>
                ) : (
                  <div style={{ marginTop: '1rem' }}>
                    {cart.map((item) => (
                      <div key={item.product.id} style={{ borderBottom: '1px solid #E2E8F0', padding: '0.75rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F172A', fontWeight: 'bold' }}>
                          <span>{item.product.name}</span>
                          <span style={{ color: '#059669' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#475569' }}>Đơn giá: {item.product.price.toLocaleString('vi-VN')} đ</span>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            <button onClick={() => decreaseQuantity(item.product.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => addToCart(item.product)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                            <button onClick={() => removeItem(item.product.id)} style={{ padding: '2px 8px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', marginLeft: '0.4rem' }}>Xóa</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #059669', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: '#0F172A' }}>
                      <span>Tổng Tiền Hóa Đơn:</span>
                      <span style={{ color: '#059669' }}>{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ marginTop: '1rem' }}
                      onClick={handleCheckoutPayment}
                    >
                      Thanh Toán VietQR Hoặc Tiền Mặt
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cashier-shift' && (
          <div className="card">
            <h2 style={{ color: '#0F172A', fontWeight: 'bold' }}>Đóng Mở Ca & Kiểm Tiền Két Thu Ngân</h2>
            <p style={{ color: '#475569', marginTop: '0.25rem' }}>Đếm chi tiết số lượng từng mệnh giá tiền mặt thực tế khi bàn giao ca trực.</p>
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#0F172A' }}>
                <span>Tiền mặt kỳ vọng trong két:</span>
                <span style={{ fontWeight: 'bold', color: '#059669' }}>5.000.000 đ</span>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label style={{ color: '#0F172A', fontWeight: 'bold' }}>Tiền Mặt Thực Đếm (VNĐ)</label>
                <input type="number" className="form-control" defaultValue={4980000} style={{ border: '1px solid #CBD5E1', color: '#0F172A' }} />
              </div>
              <div className="form-group">
                <label style={{ color: '#0F172A', fontWeight: 'bold' }}>Giải Trình Chênh Lệch (Bắt Buộc Khi Lệch Tiền)</label>
                <input type="text" className="form-control" placeholder="Ví dụ: Thối nhầm tiền lẻ 20.000đ cho đơn #104" style={{ border: '1px solid #CBD5E1', color: '#0F172A' }} />
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '0.5rem' }} onClick={() => alert('Đã chốt sổ giao ca thu ngân và chuyển báo cáo chênh lệch tới Quản Lý!')}>
                Xác Nhận Chốt Ca Thu Ngân
              </button>
            </div>
          </div>
        )}

        {/* CASHIER INVOICE HISTORY TAB */}
        {activeTab === 'cashier-orders' && (
          <div className="card">
            <h2 style={{ color: '#0F172A', fontWeight: 'bold', marginTop: 0 }}>Lịch Sử Hóa Đơn & In Vé Thu Ngân</h2>
            <p style={{ color: '#475569', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Danh sách tất cả các hóa đơn đã thanh toán thành công trong ca làm việc.</p>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Hóa Đơn</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn Phục Vụ</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Các Món</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Phương Thức</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác In</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{inv.id}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{inv.table}</td>
                      <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                        {inv.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{inv.totalAmount.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px' }}><span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{inv.paymentMethod}</span></td>
                      <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{inv.timestamp}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => alert(`Đã gửi lệnh in hóa đơn ${inv.id} tới máy in nhiệt ESC/POS LAN/USB!`)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>In Lại Hóa Đơn</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROLE 5: WAREHOUSE UI */}
        {(activeTab.startsWith('wh-')) && <WarehousePage activeTab={activeTab} />}

        {/* ROLE 6: STORE MANAGER OPERATIONS UI */}
        {(activeTab.startsWith('manager-')) && <ManagerOperationsPage activeTab={activeTab} />}

        {/* ROLE 7: BRAND ADMIN ERP UI */}
        {(activeTab.startsWith('admin-')) && currentUser.role === 'Admin' && (
          <AdminErpPage activeTab={activeTab} />
        )}

        {/* ROLE 8: SUPERADMIN CONSOLE UI */}
        {(activeTab.startsWith('superadmin-') || activeTab.startsWith('super-')) && currentUser.role === 'SuperAdmin' && (
          <SuperAdminConsolePage activeTab={activeTab} />
        )}
      </main>
    </div>
  );
};
export default App;
