import React, { useState } from 'react';

interface CustomerQrPageProps {
  activeTab: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedBy: string;
  sugar: number;
  ice: number;
  toppings: string[];
}

export const CustomerQrPage: React.FC<CustomerQrPageProps> = ({ activeTab }) => {
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  
  const [groupCart] = useState<CartItem[]>([
    { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', price: 35000, quantity: 2, addedBy: 'Bạn (Bàn 04)', sugar: 100, ice: 100, toppings: ['Bánh Flan'] },
    { id: '2', name: 'Trà Đào Cam Sả Tươi', price: 45000, quantity: 1, addedBy: 'Minh Tuấn (Khách 2)', sugar: 50, ice: 50, toppings: ['Trân Châu Trắng'] },
  ]);

  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [callCooldown, setCallCooldown] = useState<number>(0);
  const [loyaltyPoints] = useState<number>(450);
  const memberTier = 'Hạng Vàng (Gold Member)';

  const handleCallStaff = (action: string) => {
    if (callCooldown > 0) return;
    setCallStatus(`Đã gửi yêu cầu "${action}" tới phục vụ!`);
    setCallCooldown(60);
    const interval = setInterval(() => {
      setCallCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallStatus(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'VIP2026') {
      setAppliedVoucher({ code: 'VIP2026', discount: 20000 });
      alert('Đã áp dụng mã VIP2026: Giảm 20.000đ!');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const totalRaw = groupCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, totalRaw - (appliedVoucher?.discount || 0));

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* VIEW 1: MENU & QUICK SERVICE */}
      {activeTab === 'customer-menu' && (
        <div>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#F8FAFC' }}>Menu Điện Tử & Đặt Món QR Tại Bàn</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>Phiên bàn: #SESS-89214 | Bàn 04 (Khu Vực Sân Vườn) | Hạn giữ chỗ tồn kho (TTL): 09:45</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Hội viên: <strong style={{ color: '#F8FAFC' }}>Nguyễn Văn A</strong></div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10B981' }}>{memberTier} ({loyaltyPoints} điểm)</div>
            </div>
          </div>

          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ color: '#F8FAFC', fontSize: '14px' }}>Tiện ích gọi hỗ trợ tại bàn (Rate limit 60s):</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>Gửi thông báo trực tiếp đến mPOS của phục vụ gần nhất.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleCallStaff('Xin thêm đá')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#475569' : '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Xin Đá</button>
              <button onClick={() => handleCallStaff('Gọi dọn bàn')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#475569' : '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Gọi Dọn Bàn</button>
              <button onClick={() => handleCallStaff('Yêu cầu thanh toán')} disabled={callCooldown > 0} style={{ padding: '8px 14px', background: callCooldown > 0 ? '#475569' : '#10B981', color: '#fff', border: 'none', borderRadius: '6px', cursor: callCooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Yêu Cầu Tính Tiền</button>
            </div>
          </div>

          {callStatus && (
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', borderRadius: '6px', marginBottom: '16px', fontWeight: 'bold' }}>
              {callStatus} (Thao tác tiếp theo sau {callCooldown}s)
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', background: '#1E293B' }}>
              <span style={{ fontSize: '11px', background: '#312E81', color: '#A5B4FC', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>BÁN CHẠY #1</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#F8FAFC' }}>Cà Phê Sữa Đá Sài Gòn</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>Cà phê đậm đà kết hợp sữa đặc Ngôi Sao Phương Nam</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10B981' }}>35.000đ</span>
                <button style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Thêm Vào Giỏ</button>
              </div>
            </div>

            <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', background: '#1E293B' }}>
              <span style={{ fontSize: '11px', background: '#78350F', color: '#FDE68A', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>RECOMMENDED AI</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#F8FAFC' }}>Trà Đào Cam Sả Tươi</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>Trà sả thơm mát cùng đào miếng giòn sần sật</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10B981' }}>45.000đ</span>
                <button style={{ padding: '6px 12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Thêm Vào Giỏ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SHARED GROUP ORDER CART */}
      {activeTab === 'customer-group' && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#F8FAFC', fontWeight: 'bold' }}>Giỏ Hàng Nhóm Realtime (Bàn 04)</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Tất cả thành viên quét QR tại bàn 04 đều có thể thêm món và theo dõi đơn hàng đồng thời.</p>

          <div style={{ width: '100%', overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A', borderBottom: '2px solid #334155', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Thành viên chọn</th>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Tên món</th>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Tùy chọn Modifier</th>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Đơn giá</th>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Số lượng</th>
                  <th style={{ padding: '12px', color: '#F8FAFC', fontWeight: 'bold' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {groupCart.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#F8FAFC' }}>{item.addedBy}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#F8FAFC' }}>{item.name}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#94A3B8' }}>Nước đá {item.ice}%, Đường {item.sugar}%, Topping: {item.toppings.join(', ')}</td>
                    <td style={{ padding: '14px 12px', color: '#F8FAFC' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '14px 12px', color: '#F8FAFC' }}>x{item.quantity}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#10B981' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', background: '#0F172A', padding: '16px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="text" placeholder="Nhập mã voucher (Mẫu: VIP2026)" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} style={{ padding: '8px 12px', background: '#1E293B', border: '1px solid #334155', borderRadius: '6px', width: '240px', color: '#F8FAFC' }} />
              <button onClick={applyVoucher} style={{ padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Áp dụng mã</button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Tạm tính: {totalRaw.toLocaleString('vi-VN')}đ</div>
              {appliedVoucher && <div style={{ fontSize: '14px', color: '#EF4444' }}>Giảm giá ({appliedVoucher.code}): -{appliedVoucher.discount.toLocaleString('vi-VN')}đ</div>}
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981', marginTop: '4px' }}>Tổng thanh toán: {finalTotal.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AT-TABLE BILL SPLIT */}
      {activeTab === 'customer-split' && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#F8FAFC', fontWeight: 'bold' }}>Công Cụ Tính Toán Chia Tiền Hóa Đơn Tại Bàn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '16px' }}>
            <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', background: '#0F172A' }}>
              <h3 style={{ marginTop: 0, color: '#F8FAFC' }}>Cách 1: Chia Đều Theo Số Người</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>Tổng bill: {finalTotal.toLocaleString('vi-VN')}đ</p>
              <div style={{ margin: '16px 0' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#F8FAFC', fontWeight: 'bold' }}>Số lượng khách tại bàn:</label>
                <input type="number" defaultValue={3} min={1} style={{ padding: '8px', width: '100px', background: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#38BDF8' }}>Mỗi người cần trả: {Math.round(finalTotal / 3).toLocaleString('vi-VN')}đ</div>
            </div>

            <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', background: '#0F172A' }}>
              <h3 style={{ marginTop: 0, color: '#F8FAFC' }}>Cách 2: Chia Tiền Theo Món Đã Chọn</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>Tự động tách tiền dựa theo người tạo món trong giỏ hàng nhóm.</p>
              <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#F8FAFC' }}>
                <li>Bạn (Bàn 04): <strong>70.000đ</strong> (2x Cà Phê Sữa)</li>
                <li>Minh Tuấn: <strong>45.000đ</strong> (1x Trà Đào)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: LOYALTY WALLET */}
      {activeTab === 'customer-loyalty' && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#F8FAFC', fontWeight: 'bold' }}>Ví Điểm Thưởng & Thẻ Hội Viên VIP</h2>
          <div style={{ background: '#0F172A', color: '#F8FAFC', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Mã hội viên: #CUST-99201</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '6px 0' }}>Nguyễn Văn A</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{memberTier}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981' }}>{loyaltyPoints} Điểm Tích Lũy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerQrPage;
