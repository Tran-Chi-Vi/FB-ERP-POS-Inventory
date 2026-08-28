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
  
  // CASHIER COUNTER ORDERING IOT PAGER ID SELECTION
  const [selectedPosPagerId, setSelectedPosPagerId] = useState<string>('PAGER-05');

  // PENDING QR BILLS QUEUE FOR CASHIER TO VERIFY PAYMENT AND ASSIGN IOT PAGER ID
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [selectedPagerMap, setSelectedPagerMap] = useState<{ [billCode: string]: string }>({});

  // DYNAMICALLY SYNC PENDING BILLS & PAID INVOICES FROM LOCALSTORAGE REALTIME
  const syncLocalState = () => {
    const savedPending = localStorage.getItem('fnb_pending_bills');
    setPendingBills(savedPending ? JSON.parse(savedPending) : []);

    const savedPaid = localStorage.getItem('fnb_paid_invoices');
    if (savedPaid) {
      setPaidInvoices(JSON.parse(savedPaid));
    }
  };

  useEffect(() => {
    syncLocalState();
    window.addEventListener('fnb_data_updated', syncLocalState);
    const interval = setInterval(syncLocalState, 1500);
    return () => {
      window.removeEventListener('fnb_data_updated', syncLocalState);
      clearInterval(interval);
    };
  }, [activeTab]);

  const [paidInvoices, setPaidInvoices] = useState<PaidInvoice[]>(() => {
    const saved = localStorage.getItem('fnb_paid_invoices');
    return saved ? JSON.parse(saved) : [
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
    ];
  });

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

  // CHECK IF SELECTED PAGER ID IS ALREADY ACTIVE FOR AN ONGOING KDS ORDER
  const existingKdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
  const activePagerTicket = existingKdsTickets.find((t: any) => t.pagerId === selectedPosPagerId);
  const isAddOnOrder = !!activePagerTicket;

  const handleCheckoutPayment = () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const invoiceId = `HD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: PaidInvoice = {
      id: invoiceId,
      table: selectedTable || 'Bàn Thu Ngân',
      items: [...cart],
      totalAmount: totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR / Tiền Mặt',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // Send ticket to KDS Kitchen with Pager ID & Add-On alert flag if re-using an active pager!
    const newKdsTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      orderNo: invoiceId,
      table: selectedTable || 'Bàn Thu Ngân',
      pagerId: selectedPosPagerId,
      station: 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      isAddOn: isAddOnOrder,
      items: cart.map(c => ({
        id: c.product.id,
        name: c.product.name,
        quantity: c.quantity,
        note: isAddOnOrder ? `🚨 ĐƠN GỘP BỔ SUNG MÓN (Thẻ ${selectedPosPagerId})` : `Thẻ Rung: ${selectedPosPagerId}`
      }))
    };
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([newKdsTicket, ...existingKdsTickets]));

    const updatedPaid = [newInvoice, ...paidInvoices];
    setPaidInvoices(updatedPaid);
    localStorage.setItem('fnb_paid_invoices', JSON.stringify(updatedPaid));

    setCart([]);
    window.dispatchEvent(new Event('fnb_data_updated'));

    if (isAddOnOrder) {
      alert(`ĐÃ THANH TOÁN ĐƠN BỔ SUNG ${invoiceId} THÀNH CÔNG!\n- Đơn được tự động ĐỔI NỔI ÂM THÀNH VÀ CẢNH BÁO BỔ SUNG MÓN sang Bếp cho Thẻ Rung ${selectedPosPagerId}!`);
    } else {
      alert(`THANH TOÁN THÀNH CÔNG!\n- Hóa đơn ${invoiceId} trị giá ${totalAmount.toLocaleString('vi-VN')}đ tại ${newInvoice.table}.\n- Đã gán ${selectedPosPagerId} và chuyển lệnh chế biến xuống Bếp!`);
    }
  };

  const handlePayPendingBillWithIotPager = (bill: PendingBill) => {
    const assignedPager = selectedPagerMap[bill.billCode] || 'PAGER-05';
    const isPagerBusy = existingKdsTickets.some((t: any) => t.pagerId === assignedPager);

    const newInvoice: PaidInvoice = {
      id: bill.billCode,
      table: bill.table,
      items: bill.items.map((b, idx) => ({
        product: { id: idx.toString(), name: b.name, price: b.price, category: 'Món QR', unit: 'Phần' },
        quantity: b.quantity
      })),
      totalAmount: bill.totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR / Tiền Mặt Tại Quầy',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // Push new KDS ticket for Kitchen with assigned IoT Pager ID!
    const newKdsTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      orderNo: bill.billCode,
      table: bill.table,
      pagerId: assignedPager,
      station: 'Barista',
      timeElapsedMinutes: 1,
      slaStatus: 'Normal',
      isAddOn: isPagerBusy,
      items: bill.items.map((b, idx) => ({
        id: idx.toString(),
        name: b.name,
        quantity: b.quantity,
        note: isPagerBusy ? `🚨 ĐƠN GỘP BỔ SUNG MÓN (Thẻ ${assignedPager})` : `Thẻ Rung: ${assignedPager}`
      }))
    };
    localStorage.setItem('fnb_kds_tickets', JSON.stringify([newKdsTicket, ...existingKdsTickets]));

    // Remove bill from pending list
    const updatedPending = pendingBills.filter(p => p.billCode !== bill.billCode);
    setPendingBills(updatedPending);
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    // Save to paid invoices
    const updatedPaid = [newInvoice, ...paidInvoices];
    setPaidInvoices(updatedPaid);
    localStorage.setItem('fnb_paid_invoices', JSON.stringify(updatedPaid));

    window.dispatchEvent(new Event('fnb_data_updated'));

    alert(`XÁC NHẬN THANH TOÁN MÃ BILL ${bill.billCode} THÀNH CÔNG!\n- Đã gán ${assignedPager} cho khách tại ${bill.table}.\n- Bếp / Barista đã nhận lệnh chế biến và sẽ kích hoạt thẻ rung ${assignedPager} khi xong!`);
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

        {/* ROLE 4: SEPARATE PENDING QR BILLS QUEUE PAGE */}
        {activeTab === 'cashier-pending' && (
          <div className="card">
            <h2 style={{ color: '#0F172A', fontWeight: 'bold', marginTop: 0 }}>Hàng Đợi Đơn QR Chờ Xác Nhận Thanh Toán & Gán Thẻ Rung IoT</h2>
            <p style={{ color: '#475569', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Danh sách các mã Bill do khách chốt qua QR tại bàn. Thu ngân xác nhận nhận tiền và gán Thẻ Rung trước khi gửi xuống Bếp.</p>

            {pendingBills.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                Hiện không có mã Bill QR nào đang chờ xác nhận thanh toán.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingBills.map((b) => (
                  <div key={b.billCode} style={{ background: '#FEF3C7', padding: '16px', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', background: '#2563EB', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{b.billCode}</span>
                      <strong style={{ marginLeft: '8px', color: '#0F172A', fontSize: '1.05rem' }}>{b.table}</strong>
                      <div style={{ marginTop: '6px', fontSize: '0.9rem', color: '#475569' }}>
                        Món ăn: {b.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#92400E', display: 'block', marginBottom: '2px' }}>Gán Thẻ Rung IoT Nhận Món:</label>
                        <select
                          value={selectedPagerMap[b.billCode] || 'PAGER-05'}
                          onChange={(e) => setSelectedPagerMap({ ...selectedPagerMap, [b.billCode]: e.target.value })}
                          style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                          <option value="PAGER-01">Thẻ Rung IoT #01</option>
                          <option value="PAGER-02">Thẻ Rung IoT #02</option>
                          <option value="PAGER-03">Thẻ Rung IoT #03</option>
                          <option value="PAGER-04">Thẻ Rung IoT #04</option>
                          <option value="PAGER-05">Thẻ Rung IoT #05</option>
                          <option value="PAGER-06">Thẻ Rung IoT #06</option>
                        </select>
                      </div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{b.totalAmount.toLocaleString('vi-VN')} đ</span>
                      <button
                        onClick={() => handlePayPendingBillWithIotPager(b)}
                        style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                      >
                        Xác Nhận Đã Thanh Toán & Gán Thẻ Gửi Bếp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROLE 4: PURE CASHIER TOUCH POS UI */}
        {activeTab === 'pos' && (
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

                  {/* COUNTER ORDERING IOT PAGER ALLOCATION DROPDOWN */}
                  <div style={{ marginTop: '1rem', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Gán Thẻ Rung IoT Nhận Món Cho Khách Quầy:</label>
                    <select
                      value={selectedPosPagerId}
                      onChange={(e) => setSelectedPosPagerId(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold', color: '#0F172A' }}
                    >
                      <option value="PAGER-01">Thẻ Rung IoT #01</option>
                      <option value="PAGER-02">Thẻ Rung IoT #02</option>
                      <option value="PAGER-03">Thẻ Rung IoT #03</option>
                      <option value="PAGER-04">Thẻ Rung IoT #04</option>
                      <option value="PAGER-05">Thẻ Rung IoT #05</option>
                      <option value="PAGER-06">Thẻ Rung IoT #06</option>
                    </select>

                    {isAddOnOrder && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#DC2626', fontWeight: 'bold', background: '#FEE2E2', padding: '6px', borderRadius: '4px' }}>
                        ⚠️ Thẻ Rung {selectedPosPagerId} đang hoạt động tại {activePagerTicket.table}. Đơn này sẽ tự động GỘP BỔ SUNG MÓN & phát cảnh báo âm thanh tới Bếp!
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1.2rem', paddingTop: '0.75rem', borderTop: '2px solid #059669', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: '#0F172A' }}>
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
            <div style={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
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
