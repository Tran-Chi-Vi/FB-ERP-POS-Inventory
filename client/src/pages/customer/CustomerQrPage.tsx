import React, { useState, useEffect } from 'react';

interface CustomerQrPageProps {
  activeTab: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface GroupCartItem {
  id: string;
  customerName: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface PendingBill {
  billCode: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PendingPayment' | 'Paid' | 'Expired';
  createdAt: number;
  expiresAt: number;
  timestamp: string;
}

export const CustomerQrPage: React.FC<CustomerQrPageProps> = ({ activeTab }) => {
  const tablesList = ['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'VIP 01', 'VIP 02'];

  // TRACK TABLE OCCUPANCY & PENDING TABLE HOLDS
  const [tableStatusMap, setTableStatusMap] = useState<{ [table: string]: { status: 'Free' | 'PendingHold' | 'Occupied'; expiresAt?: number } }>({});
  const [tableSession, setTableSession] = useState<string>('Bàn 01');

  const syncOccupiedTables = () => {
    const activeKdsTickets = JSON.parse(localStorage.getItem('fnb_kds_tickets') || '[]');
    let pendingBills: PendingBill[] = JSON.parse(localStorage.getItem('fnb_pending_bills') || '[]');
    const now = Date.now();

    // 1. AUTO-SWEEP EXPIRED PENDING BILLS (> 15 MINUTES)
    const validPending = pendingBills.filter(b => b.expiresAt > now);
    if (validPending.length !== pendingBills.length) {
      localStorage.setItem('fnb_pending_bills', JSON.stringify(validPending));
      pendingBills = validPending;
    }

    // 2. COMPUTE TABLE STATUS MAP
    const statusMap: { [table: string]: { status: 'Free' | 'PendingHold' | 'Occupied'; expiresAt?: number } } = {};
    tablesList.forEach(t => { statusMap[t] = { status: 'Free' }; });

    // Official occupied tables (Paid & sent to Kitchen KDS)
    activeKdsTickets.forEach((t: any) => {
      if (t.table) statusMap[t.table] = { status: 'Occupied' };
    });

    // Temporary table holds (Waiting in QR pending queue for <= 15 mins)
    pendingBills.forEach((p: PendingBill) => {
      if (p.table && statusMap[p.table]?.status !== 'Occupied') {
        statusMap[p.table] = { status: 'PendingHold', expiresAt: p.expiresAt };
      }
    });

    setTableStatusMap(statusMap);

    // Auto-select first FREE table if current table is occupied or on hold
    if (statusMap[tableSession]?.status !== 'Free') {
      const freeTable = tablesList.find(t => statusMap[t]?.status === 'Free');
      if (freeTable) setTableSession(freeTable);
    }
  };

  useEffect(() => {
    syncOccupiedTables();
    window.addEventListener('fnb_data_updated', syncOccupiedTables);
    const interval = setInterval(syncOccupiedTables, 1000);
    return () => {
      window.removeEventListener('fnb_data_updated', syncOccupiedTables);
      clearInterval(interval);
    };
  }, [tableSession]);

  const currentUserFullName = 'Trần Chí Vĩ';

  // PERSISTENT GLOBAL SEQUENTIAL BILL ID GENERATOR
  const getNextGlobalBillCode = (prefix: 'BILL' | 'HD') => {
    const currentSeq = parseInt(localStorage.getItem('fnb_global_bill_seq') || '1001', 10);
    const nextSeq = currentSeq + 1;
    localStorage.setItem('fnb_global_bill_seq', nextSeq.toString());
    return `${prefix}-${currentSeq}`;
  };

  // 1. MENU ITEMS
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 29000, category: 'Cà Phê' },
    { id: '2', name: 'Bạc Xỉu Đá Ngọt Dịu', price: 32000, category: 'Cà Phê' },
    { id: '3', name: 'Espresso Intenso', price: 35000, category: 'Cà Phê' },
    { id: '4', name: 'Trà Đào Cam Sả Tươi', price: 39000, category: 'Trà & Trà Sữa' },
    { id: '5', name: 'Trà Sữa Ô Long Kem Trứng', price: 42000, category: 'Trà & Trà Sữa' },
    { id: '6', name: 'Bánh Croissant Bơ Bơ', price: 25000, category: 'Bánh Ngọt' },
    { id: '7', name: 'Bánh Tiramisu Ý', price: 38000, category: 'Bánh Ngọt' },
  ];

  const categories = ['Tất Cả', 'Cà Phê', 'Trà & Trà Sữa', 'Bánh Ngọt'];

  const filteredMenu = selectedCategory === 'Tất Cả'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  // 2. GROUP CART STATE
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([
    { id: 'gc-1', customerName: currentUserFullName, itemName: 'Cà Phê Sữa Đá Sài Gòn', quantity: 1, price: 29000 },
    { id: 'gc-2', customerName: 'Bạn Đi Cùng A', itemName: 'Bạc Xỉu Đá Ngọt Dịu', quantity: 1, price: 32000 },
  ]);

  // 3. SPLIT BILL
  const [splitPeople, setSplitPeople] = useState<number>(2);

  // 4. LOYALTY POINTS
  const [loyaltyPoints] = useState<number>(450);
  const [membershipTier] = useState<string>('Vàng (Gold VIP)');

  // 5. GENERATED BILL POPUP STATE
  const [generatedBill, setGeneratedBill] = useState<PendingBill | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));

    const existingIndex = groupCart.findIndex((gc) => gc.itemName === item.name && gc.customerName === currentUserFullName);
    if (existingIndex > -1) {
      const updated = [...groupCart];
      updated[existingIndex].quantity += 1;
      setGroupCart(updated);
    } else {
      setGroupCart([
        ...groupCart,
        { id: `gc-${Date.now()}`, customerName: currentUserFullName, itemName: item.name, quantity: 1, price: item.price },
      ]);
    }
  };

  const handleIncreaseGroupQuantity = (id: string) => {
    setGroupCart(groupCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const handleDecreaseGroupQuantity = (id: string) => {
    setGroupCart(
      groupCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveGroupItem = (id: string) => {
    setGroupCart(groupCart.filter((item) => item.id !== id));
  };

  // CHECKOUT GROUP CART: GENERATES UNIQUE SEQUENTIAL BILL AND PUSHES TO TEMPORARY HOLD QUEUE (EXPIRES IN 15 MINS)
  const handleCheckoutGroupCart = () => {
    if (groupCart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món trước khi gửi đơn.');
      return;
    }

    const billCode = getNextGlobalBillCode('BILL');
    const totalAmount = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15-Minute Countdown

    const newPendingBill: PendingBill = {
      billCode,
      table: tableSession,
      items: groupCart.map((item) => ({
        name: item.itemName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      status: 'PendingPayment',
      createdAt: now,
      expiresAt: expiresAt,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    };

    const existingPending = JSON.parse(localStorage.getItem('fnb_pending_bills') || '[]');
    const updatedPending = [newPendingBill, ...existingPending];
    localStorage.setItem('fnb_pending_bills', JSON.stringify(updatedPending));

    window.dispatchEvent(new Event('fnb_data_updated'));

    setGeneratedBill(newPendingBill);
    setGroupCart([]);
    setCart({});
  };

  const groupTotal = groupCart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER BANNER WITH REALTIME TABLE HOLD STATUS & SWITCHER */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold', textTransform: 'uppercase' }}>GỌI MÓN MÃ QR TẠI BÀN</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#0F172A', fontWeight: 'bold' }}>Phiên Phục Vụ: {tableSession}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Vị trí bàn:</label>
          <select value={tableSession} onChange={(e) => setTableSession(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 'bold' }}>
            {tablesList.map(t => {
              const st = tableStatusMap[t]?.status || 'Free';
              const isBlocked = st !== 'Free';
              const label = st === 'Occupied' ? 'Đã có chủ' : st === 'PendingHold' ? 'Giữ chỗ chờ thanh toán' : 'Trống';
              return (
                <option key={t} value={t} disabled={isBlocked}>
                  {t} ({label})
                </option>
              );
            })}
          </select>
          <div style={{ background: '#DCFCE7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
            WiFi Nội Bộ Verified
          </div>
        </div>
      </div>

      {/* 1. TAB 1: MENU QR WITH CLEAN SIMPLE QUANTITY COUNTER */}
      {activeTab === 'customer-menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>DANH MỤC THỰC ĐƠN</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: selectedCategory === cat ? '#2563EB' : '#F8FAFC',
                    color: selectedCategory === cat ? '#fff' : '#0F172A',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0F172A', fontWeight: 'bold' }}>SẢN PHẨM {selectedCategory.toUpperCase()}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {filteredMenu.map((item) => {
                const qtyCount = cart[item.id] || 0;
                return (
                  <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0F172A', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ color: '#059669', fontWeight: 'bold', marginTop: '6px', fontSize: '16px' }}>{item.price.toLocaleString('vi-VN')} đ</div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        background: '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {qtyCount > 0 ? `+ Thêm Vào Giỏ (${qtyCount})` : '+ Thêm Vào Giỏ'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB 2: GROUP CART REALTIME */}
      {activeTab === 'customer-group' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Giỏ Hàng Nhóm Thời Gian Thực ({tableSession})</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Tất cả mọi người tại bàn đều có thể thêm, chỉnh sửa hoặc bớt món trước khi chốt đơn gửi xuống Thu Ngân.</p>

          {groupCart.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
              Giỏ hàng nhóm hiện tại đang trống. Vui lòng quay lại tab Thực Đơn để chọn món!
            </div>
          ) : (
            <div>
              <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Món Ăn / Đồ Uống</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Đơn Giá</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Lượng</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thành Tiền</th>
                      <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupCart.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{item.itemName}</td>
                        <td style={{ padding: '14px 12px', color: '#475569' }}>{item.price.toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button onClick={() => handleDecreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                            <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => handleIncreaseGroupQuantity(item.id)} style={{ padding: '2px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '15px' }}>{(item.quantity * item.price).toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '14px 12px' }}>
                          <button onClick={() => handleRemoveGroupItem(item.id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Xóa Món</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>TỔNG TIỀN THANH TOÁN:</span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#059669', fontWeight: 'bold' }}>{groupTotal.toLocaleString('vi-VN')} đ</h3>
                </div>
                <button
                  onClick={handleCheckoutGroupCart}
                  style={{ padding: '14px 28px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                  XÁC NHẬN ĐẶT ĐƠN & TẠO MÃ BILL THANH TOÁN
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 3: SPLIT BILL CALCULATOR */}
      {activeTab === 'customer-split' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Công Cụ Tách Tiền Hóa Đơn Chia Đều</h2>
          <div style={{ marginTop: '20px', maxWidth: '400px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '6px' }}>Số Người Tại Bàn Cần Tách Tiền:</label>
            <input type="number" min="1" max="20" value={splitPeople} onChange={(e) => setSplitPeople(Math.max(1, Number(e.target.value)))} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold' }} />
            
            <div style={{ marginTop: '20px', background: '#DBEAFE', padding: '16px', borderRadius: '8px', border: '1px solid #93C5FD' }}>
              <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 'bold' }}>SỐ TIỀN MỖI NGƯỜI CẦN TRẢ:</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '24px', color: '#1E40AF', fontWeight: 'bold' }}>
                {Math.round(groupTotal / splitPeople).toLocaleString('vi-VN')} đ / người
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 4: LOYALTY WALLET */}
      {activeTab === 'customer-loyalty' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Ví Điểm Thưởng Hội Viên</h2>
          <div style={{ background: '#FEF3C7', padding: '20px', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '24px', maxWidth: '400px' }}>
            <span style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold' }}>ĐIỂM TÍCH LŨY HIỆN CÓ:</span>
            <h3 style={{ margin: '6px 0 0 0', fontSize: '28px', color: '#D97706', fontWeight: 'bold' }}>{loyaltyPoints} Điểm</h3>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#92400E', fontWeight: 'bold' }}>Hạng thẻ: {membershipTier}</div>
          </div>
        </div>
      )}

      {/* BILL GENERATION MODAL FOR CUSTOMER WITH 15-MINUTE HOLD WARNING */}
      {generatedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', maxWidth: '480px', width: '100%', textAlign: 'center', border: '2px solid #059669' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>ĐÃ ĐẶT ĐƠN GIỮ BÀN TẠI QUẦY THU NGÂN</h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Vị trí giữ chỗ: <strong>{generatedBill.table}</strong> (Giữ bàn tối đa 15 phút)</p>
            
            <div style={{ background: '#F8FAFC', border: '2px dashed #2563EB', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 'bold' }}>MÃ BILL ĐƠN HÀNG CỦA BẠN:</span>
              <h2 style={{ margin: '4px 0 2px 0', fontSize: '32px', color: '#0F172A', fontWeight: 'bold' }}>{generatedBill.billCode}</h2>
              <div style={{ fontSize: '15px', color: '#059669', fontWeight: 'bold' }}>Tổng tiền: {generatedBill.totalAmount.toLocaleString('vi-VN')} đ</div>
            </div>

            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', color: '#92400E', textAlign: 'left', border: '1px solid #FDE68A' }}>
              <strong>LƯU Ý GIỮ CHỖ & THANH TOÁN TẠI QUẦY:</strong>
              <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                <li>Hệ thống <strong>giữ chỗ {generatedBill.table} trong vòng 15 phút</strong> cho đơn hàng này.</li>
                <li>Quý khách vui lòng đến Thu Ngân đọc Mã Bill <strong>{generatedBill.billCode}</strong> để thanh toán.</li>
                <li>Sau khi thanh toán thành công, đơn mới được lưu vào hệ thống chính và gửi lệnh xuống Bếp.</li>
                <li>Nếu quá 15 phút không thanh toán, đơn sẽ tự động bị hủy và giải phóng bàn cho khách khác.</li>
              </ol>
            </div>

            <button onClick={() => setGeneratedBill(null)} style={{ width: '100%', padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              ĐÓNG THÔNG BÁO
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerQrPage;
