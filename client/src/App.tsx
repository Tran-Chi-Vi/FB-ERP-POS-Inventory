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
  pagerId?: string;
  parentInvoiceId?: string;
  isAddOn?: boolean;
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
  const [selectedTable, setSelectedTable] = useState<string>('Bàn 01');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // CASHIER COUNTER ORDERING IOT PAGER ID SELECTION
  const [selectedPosPagerId, setSelectedPosPagerId] = useState<string>('PAGER-01');
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState<boolean>(false);

  // PENDING QR BILLS QUEUE FOR CASHIER TO VERIFY PAYMENT AND ASSIGN IOT PAGER ID
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [selectedPagerMap, setSelectedPagerMap] = useState<{ [billCode: string]: string }>({});

  const [paidInvoices, setPaidInvoices] = useState<PaidInvoice[]>(() => {
    const saved = localStorage.getItem('fnb_paid_invoices');
    return saved ? JSON.parse(saved) : [
      {
        id: 'HD-1001',
        table: 'Bàn 04',
        pagerId: 'PAGER-05',
        items: [
          { product: { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 29000, category: 'Cà Phê', unit: 'Ly' }, quantity: 2 },
        ],
        totalAmount: 58000,
        paymentMethod: 'Chuyển Khoản VietQR',
        timestamp: '21:15:30'
      }
    ];
  });

  // PERSISTENT GLOBAL SEQUENTIAL BILL GENERATOR
  const getNextGlobalBillCode = (prefix: 'BILL' | 'HD') => {
    const currentSeq = parseInt(localStorage.getItem('fnb_global_bill_seq') || '1002', 10);
    const nextSeq = currentSeq + 1;
    localStorage.setItem('fnb_global_bill_seq', nextSeq.toString());
    return `${prefix}-${currentSeq}`;
  };

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

  // SMART PAGER & TABLE OCCUPANCY TRACKING FROM ACTIVE KDS TICKETS & PENDING BILLS
  const activeKdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
  const busyPagersMap: { [pagerId: string]: string } = {}; // pagerId -> table
  const occupiedTablesSet = new Set<string>();

  activeKdsTickets.forEach((t: any) => {
    if (t.pagerId) busyPagersMap[t.pagerId] = t.table;
    if (t.table) occupiedTablesSet.add(t.table);
  });
  pendingBills.forEach((p: any) => {
    if (p.table) occupiedTablesSet.add(p.table);
  });

  // GET ALL AVAILABLE PAGERS THAT ARE NOT BUSY
  const allPagers = ['PAGER-01', 'PAGER-02', 'PAGER-03', 'PAGER-04', 'PAGER-05', 'PAGER-06', 'PAGER-07', 'PAGER-08', 'PAGER-09', 'PAGER-10'];
  
  const getFirstAvailablePagerForTable = (targetTable: string) => {
    // If targetTable already has an active ticket with a pager, reuse that pager for add-on!
    const activeTicket = activeKdsTickets.find((t: any) => t.table === targetTable);
    if (activeTicket && activeTicket.pagerId) return activeTicket.pagerId;
    
    // Otherwise pick first free pager not in busyPagersMap
    const free = allPagers.find(p => !busyPagersMap[p]);
    return free || 'PAGER-01';
  };

  useEffect(() => {
    if (selectedTable) {
      const autoPager = getFirstAvailablePagerForTable(selectedTable);
      setSelectedPosPagerId(autoPager);
    }
  }, [selectedTable]);

  // CLEAR TABLE & RELEASE OCCUPANCY ACTION FOR CASHIER
  const handleReleaseTable = (tableToRelease: string) => {
    const updatedTickets = activeKdsTickets.filter((t: any) => t.table !== tableToRelease);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updatedTickets));

    const updatedPending = pendingBills.filter((p: any) => p.table !== tableToRelease);
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    window.dispatchEvent(new Event('fnb_data_updated'));
    alert(`ĐÃ DỌN BÀN & GIẢI PHÓNG "${tableToRelease}" THÀNH CÔNG! Bàn đã trở lại trạng thái TRỐNG.`);
  };

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

  // FIND IF PAGER ID / TABLE ALREADY HAS AN ACTIVE UNCOMPLETED PARENT INVOICE
  const parentInvoiceForPager = paidInvoices.find(inv => inv.pagerId === selectedPosPagerId || inv.table === selectedTable);
  const isAddOnOrder = !!parentInvoiceForPager && activeKdsTickets.some((t: any) => t.table === selectedTable);

  const handleOpenPaymentConfirm = () => {
    if (cart.length === 0) return;
    setShowPaymentConfirmModal(true);
  };

  const handleFinalizePosCheckout = () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const invoiceId = getNextGlobalBillCode('HD');

    const newInvoice: PaidInvoice = {
      id: invoiceId,
      table: selectedTable || 'Bàn Thu Ngân',
      pagerId: selectedPosPagerId,
      parentInvoiceId: isAddOnOrder ? parentInvoiceForPager.id : undefined,
      isAddOn: isAddOnOrder,
      items: [...cart],
      totalAmount: totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR / Tiền Mặt',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    // PUSH TO KDS: IF ACTIVE TICKET FOR PAGER EXISTS, MERGE NEW ITEMS INTO THE SINGLE UNIFIED CARD!
    let existingKdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    const existingTicketIndex = existingKdsTickets.findIndex((t: any) => t.pagerId === selectedPosPagerId || t.table === selectedTable);

    if (existingTicketIndex !== -1) {
      const activeTicket = existingKdsTickets[existingTicketIndex];
      const newItemsFormatted = cart.map(c => ({
        id: `NEW-${c.product.id}-${Date.now()}`,
        name: c.product.name,
        quantity: c.quantity,
        note: `🚨 [MÓN MỚI BỔ SUNG] (Bill ${invoiceId})`
      }));

      existingKdsTickets[existingTicketIndex] = {
        ...activeTicket,
        orderNo: `${activeTicket.orderNo} + ${invoiceId}`,
        isAddOn: true,
        isAddOnNoticePending: true,
        items: [...activeTicket.items, ...newItemsFormatted]
      };
    } else {
      const newKdsTicket = {
        id: `TK-${Math.floor(100 + Math.random() * 900)}`,
        orderNo: invoiceId,
        parentOrderNo: isAddOnOrder ? parentInvoiceForPager.id : undefined,
        table: selectedTable || 'Bàn Thu Ngân',
        pagerId: selectedPosPagerId,
        station: 'Barista',
        timeElapsedMinutes: 1,
        slaStatus: 'Normal',
        isAddOn: isAddOnOrder,
        isAddOnNoticePending: isAddOnOrder,
        items: cart.map(c => ({
          id: c.product.id,
          name: c.product.name,
          quantity: c.quantity,
          note: isAddOnOrder ? `🚨 [MÓN MỚI BỔ SUNG] (Bill ${invoiceId})` : `Thẻ Rung: ${selectedPosPagerId}`
        }))
      };
      existingKdsTickets = [newKdsTicket, ...existingKdsTickets];
    }

    localStorage.setItem('fnb_kds_tickets', JSON.stringify(existingKdsTickets));

    const updatedPaid = [newInvoice, ...paidInvoices];
    setPaidInvoices(updatedPaid);
    localStorage.setItem('fnb_paid_invoices', JSON.stringify(updatedPaid));

    setCart([]);
    setShowPaymentConfirmModal(false);
    window.dispatchEvent(new Event('fnb_data_updated'));

    if (isAddOnOrder) {
      alert(`ĐÃ THANH TOÁN HÓA ĐƠN BỔ SUNG ${invoiceId}!\n- Đã GỘP MÓN MỚI vào Thẻ Rung ${selectedPosPagerId} trên Màn hình Bếp KDS!\n- Bếp thấy cả món cũ và món mới trên 1 vé duy nhất.`);
    } else {
      alert(`THANH TOÁN THÀNH CÔNG HÓA ĐƠN GỐC ${invoiceId}!\n- Trị giá: ${totalAmount.toLocaleString('vi-VN')}đ tại ${newInvoice.table}.\n- Đã gán ${selectedPosPagerId} và chuyển lệnh xuống Bếp!`);
    }
  };

  const handlePayPendingBillWithIotPager = (bill: PendingBill) => {
    const assignedPager = selectedPagerMap[bill.billCode] || getFirstAvailablePagerForTable(bill.table);
    const parentInv = paidInvoices.find(inv => inv.pagerId === assignedPager || inv.table === bill.table);
    const isPagerBusy = !!parentInv && activeKdsTickets.some((t: any) => t.table === bill.table);

    const newInvoice: PaidInvoice = {
      id: bill.billCode,
      table: bill.table,
      pagerId: assignedPager,
      parentInvoiceId: isPagerBusy ? parentInv.id : undefined,
      isAddOn: isPagerBusy,
      items: bill.items.map((b, idx) => ({
        product: { id: idx.toString(), name: b.name, price: b.price, category: 'Món QR', unit: 'Phần' },
        quantity: b.quantity
      })),
      totalAmount: bill.totalAmount,
      paymentMethod: 'Chuyển Khoản VietQR / Tiền Mặt Tại Quầy',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    let existingKdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    const existingTicketIndex = existingKdsTickets.findIndex((t: any) => t.pagerId === assignedPager || t.table === bill.table);

    if (existingTicketIndex !== -1) {
      const activeTicket = existingKdsTickets[existingTicketIndex];
      const newItemsFormatted = bill.items.map((b, idx) => ({
        id: `NEW-QR-${idx}-${Date.now()}`,
        name: b.name,
        quantity: b.quantity,
        note: `🚨 [MÓN MỚI BỔ SUNG QR] (Bill ${bill.billCode})`
      }));

      existingKdsTickets[existingTicketIndex] = {
        ...activeTicket,
        orderNo: `${activeTicket.orderNo} + ${bill.billCode}`,
        isAddOn: true,
        isAddOnNoticePending: true,
        items: [...activeTicket.items, ...newItemsFormatted]
      };
    } else {
      const newKdsTicket = {
        id: `TK-${Math.floor(100 + Math.random() * 900)}`,
        orderNo: bill.billCode,
        parentOrderNo: isPagerBusy ? parentInv.id : undefined,
        table: bill.table,
        pagerId: assignedPager,
        station: 'Barista',
        timeElapsedMinutes: 1,
        slaStatus: 'Normal',
        isAddOn: isPagerBusy,
        isAddOnNoticePending: isPagerBusy,
        items: bill.items.map((b, idx) => ({
          id: idx.toString(),
          name: b.name,
          quantity: b.quantity,
          note: isPagerBusy ? `🚨 [MÓN MỚI BỔ SUNG QR] (Bill ${bill.billCode})` : `Thẻ Rung: ${assignedPager}`
        }))
      };
      existingKdsTickets = [newKdsTicket, ...existingKdsTickets];
    }

    localStorage.setItem('fnb_kds_tickets', JSON.stringify(existingKdsTickets));

    const updatedPending = pendingBills.filter(p => p.billCode !== bill.billCode);
    setPendingBills(updatedPending);
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    const updatedPaid = [newInvoice, ...paidInvoices];
    setPaidInvoices(updatedPaid);
    localStorage.setItem('fnb_paid_invoices', JSON.stringify(updatedPaid));

    window.dispatchEvent(new Event('fnb_data_updated'));

    alert(`XÁC NHẬN THANH TOÁN MÃ BILL ${bill.billCode} THÀNH CÔNG!\n- Gán Thẻ Rung ${assignedPager} cho ${bill.table}.\n- Đã tự động GỘP MÓN MỚI vào vé Bếp KDS hiện tại!`);
  };

  const tables = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-wrapper" ref={mainRef}>
        {(activeTab.startsWith('customer-')) && <CustomerQrPage activeTab={activeTab} />}
        {(activeTab.startsWith('staff-')) && <StaffRunnerPage activeTab={activeTab} />}
        {(activeTab.startsWith('kds-')) && <KdsKitchenPage activeTab={activeTab} />}

        {/* CASHIER PENDING QR QUEUE WITH MATCHED DYNAMIC BUSY PAGER FILTERING */}
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
                {pendingBills.map((b) => {
                  const defaultPager = selectedPagerMap[b.billCode] || getFirstAvailablePagerForTable(b.table);
                  const currentSelectedPager = selectedPagerMap[b.billCode] || defaultPager;

                  return (
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
                            value={currentSelectedPager}
                            onChange={(e) => setSelectedPagerMap({ ...selectedPagerMap, [b.billCode]: e.target.value })}
                            style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0F172A', fontWeight: 'bold', fontSize: '0.9rem' }}
                          >
                            {allPagers.map(p => {
                              const isBusy = !!busyPagersMap[p] && busyPagersMap[p] !== b.table;
                              return (
                                <option key={p} value={p} disabled={isBusy}>
                                  {p} {isBusy ? `(Đang bận - ${busyPagersMap[p]})` : '(Đang rảnh)'}
                                </option>
                              );
                            })}
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
                  );
                })}
              </div>
            )}
          </div>
        )}

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
              {/* SƠ ĐỒ BÀN PHỤC VỤ WITH TABLE STATUS BADGES & CLEAR ACTION */}
              <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Sơ Đồ Bàn Phục Vụ (Trạng Thái Trống & Đang Có Khách)</h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Đã bôi xám các bàn đang có khách</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {tables.map((t) => {
                    const isOccupied = occupiedTablesSet.has(t);
                    const isSelected = selectedTable === t;

                    return (
                      <button
                        key={t}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '0.375rem',
                          border: isOccupied ? '2px solid #EF4444' : '1px solid #CBD5E1',
                          background: isSelected ? '#059669' : isOccupied ? '#FEE2E2' : '#FFFFFF',
                          color: isSelected ? '#fff' : isOccupied ? '#991B1B' : '#0F172A',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                        onClick={() => setSelectedTable(t)}
                      >
                        <span>{t}</span>
                        <span style={{ fontSize: '10px', fontWeight: 'normal' }}>
                          {isOccupied ? '🛑 Đang Có Khách' : '🟢 Trống'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* CLEAR / RELEASE TABLE ACTION BOX */}
                {occupiedTablesSet.size > 0 && (
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#0F172A', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Thao Tác Dọn Bàn & Giải Phóng Ghế Cho Khách Mới:</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Array.from(occupiedTablesSet).map(tbl => (
                        <button
                          key={tbl}
                          onClick={() => handleReleaseTable(tbl)}
                          style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                        >
                          Dọn Bàn & Giải Phóng {tbl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

                  {/* DYNAMIC SMART PAGER SELECTOR EXCLUDING BUSY PAGERS */}
                  <div style={{ marginTop: '1rem', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0F172A', display: 'block', marginBottom: '4px' }}>Gán Thẻ Rung IoT Nhận Món Cho Khách Quầy:</label>
                    <select
                      value={selectedPosPagerId}
                      onChange={(e) => setSelectedPosPagerId(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold', color: '#0F172A' }}
                    >
                      {allPagers.map(p => {
                        const isBusy = !!busyPagersMap[p] && busyPagersMap[p] !== selectedTable;
                        return (
                          <option key={p} value={p} disabled={isBusy}>
                            {p} {isBusy ? `(Đang bận tại ${busyPagersMap[p]})` : '(Đang rảnh)'}
                          </option>
                        );
                      })}
                    </select>

                    {isAddOnOrder && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#DC2626', fontWeight: 'bold', background: '#FEE2E2', padding: '6px', borderRadius: '4px' }}>
                        ⚠️ {selectedTable} đang có khách ({selectedPosPagerId}). Đơn mới này sẽ tự động GỘP MÓN MỚI vào vé Bếp KDS hiện tại!
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
                    onClick={handleOpenPaymentConfirm}
                  >
                    Thanh Toán VietQR Hoặc Tiền Mặt
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASHIER PAYMENT CONFIRMATION MODAL */}
        {showPaymentConfirmModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '100%', border: '2px solid #2563EB' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>XÁC NHẬN THU TIỀN HÓA ĐƠN & GÁN THẺ RUNG IOT</h3>
              
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0F172A', marginBottom: '6px' }}>
                  <span>Vị trí phục vụ:</span>
                  <strong style={{ color: '#2563EB' }}>{selectedTable || 'Bàn Thu Ngân'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0F172A', marginBottom: '6px' }}>
                  <span>Thẻ Rung IoT đã chọn:</span>
                  <strong style={{ color: '#D97706' }}>{selectedPosPagerId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#0F172A', fontWeight: 'bold', paddingTop: '8px', borderTop: '1px solid #CBD5E1' }}>
                  <span>Tổng tiền thu thực tế:</span>
                  <strong style={{ color: '#059669', fontSize: '18px' }}>
                    {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              {isAddOnOrder && (
                <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>
                  ⚠️ LƯU Ý THU NGÂN: Món mới sẽ được GỘP TRỰC TIẾP vào vé Bếp KDS của {selectedPosPagerId}. Bếp sẽ thấy cả món cũ & món mới trên 1 vé duy nhất!
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowPaymentConfirmModal(false)}
                  style={{ padding: '10px 16px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  HỦY BỎ / KIỂM TRA LẠI
                </button>
                <button
                  onClick={handleFinalizePosCheckout}
                  style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  XÁC NHẬN ĐÃ NHẬN ĐỦ TIỀN & XUẤT LỆNH BẾP
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cashier-shift' && (
          <div className="card">
            <h2 style={{ color: '#0F172A', fontWeight: 'bold' }}>Đóng Mở Ca & Kiểm Tiền Két Thu Ngân</h2>
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#0F172A' }}>
                <span>Tiền mặt kỳ vọng trong két:</span>
                <span style={{ fontWeight: 'bold', color: '#059669' }}>5.000.000 đ</span>
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '0.5rem' }} onClick={() => alert('Đã chốt sổ giao ca thu ngân và chuyển báo cáo chênh lệch tới Quản Lý!')}>
                Xác Nhận Chốt Ca Thu Ngân
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cashier-orders' && (
          <div className="card">
            <h2 style={{ color: '#0F172A', fontWeight: 'bold', marginTop: 0 }}>Lịch Sử Hóa Đơn & In Vé Thu Ngân</h2>
            <div style={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Hóa Đơn</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Hóa Đơn Mẹ</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn & Thẻ Rung</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Món</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian</th>
                    <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>
                        {inv.id}
                        {inv.isAddOn && <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: '6px', fontWeight: 'bold' }}>[Bổ Sung]</span>}
                      </td>
                      <td style={{ padding: '14px 12px', color: inv.parentInvoiceId ? '#2563EB' : '#94A3B8', fontWeight: inv.parentInvoiceId ? 'bold' : 'normal' }}>
                        {inv.parentInvoiceId ? `Gốc: ${inv.parentInvoiceId}` : '-'}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{inv.table} ({inv.pagerId || 'PAGER-05'})</td>
                      <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                        {inv.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{inv.totalAmount.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{inv.timestamp}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => alert(`Đã in hóa đơn ${inv.id}!`)} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>In Hóa Đơn</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab.startsWith('wh-')) && <WarehousePage activeTab={activeTab} />}
        {(activeTab.startsWith('manager-')) && <ManagerOperationsPage activeTab={activeTab} />}
        {(activeTab.startsWith('admin-')) && currentUser.role === 'Admin' && <AdminErpPage activeTab={activeTab} />}
        {(activeTab.startsWith('superadmin-') || activeTab.startsWith('super-')) && currentUser.role === 'SuperAdmin' && <SuperAdminConsolePage activeTab={activeTab} />}
      </main>
    </div>
  );
};
export default App;
