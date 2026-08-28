import React, { useState } from 'react';

interface KdsKitchenPageProps {
  activeTab: string;
}

interface KdsTicket {
  id: string;
  orderNumber: string;
  tableName: string;
  elapsedMinutes: number;
  station: 'bar' | 'kitchen';
  items: { name: string; quantity: number; modifier: string }[];
  status: 'pending' | 'preparing' | 'ready';
}

export const KdsKitchenPage: React.FC<KdsKitchenPageProps> = ({ activeTab }) => {
  const [currentStation, setCurrentStation] = useState<'bar' | 'kitchen'>('bar');
  const [selectedRecipeItem, setSelectedRecipeItem] = useState<string | null>(null);

  const [tickets, setTickets] = useState<KdsTicket[]>([
    {
      id: 'TK-101',
      orderNumber: 'ORD-9921',
      tableName: 'Bàn 04',
      elapsedMinutes: 14, // SLA Violation Red
      station: 'bar',
      items: [
        { name: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, modifier: 'Nhiều đá, 100% đường' },
        { name: 'Trà Đào Cam Sả Tươi', quantity: 1, modifier: '50% đường, 50% đá, Topping Trân Châu' }
      ],
      status: 'preparing'
    },
    {
      id: 'TK-102',
      orderNumber: 'ORD-9924',
      tableName: 'Bàn 01',
      elapsedMinutes: 8, // SLA Warning Yellow
      station: 'bar',
      items: [
        { name: 'Trà Đào Cam Sả Tươi', quantity: 3, modifier: 'Ít đường, 100% đá' }
      ],
      status: 'pending'
    },
    {
      id: 'TK-103',
      orderNumber: 'ORD-9928',
      tableName: 'Bàn 05',
      elapsedMinutes: 4, // SLA Normal Green
      station: 'kitchen',
      items: [
        { name: 'Bánh Tiramisu Ý', quantity: 1, modifier: 'Kèm dĩa tráng miệng' }
      ],
      status: 'preparing'
    }
  ]);

  const [completedTickets] = useState([
    { id: 'TK-099', orderNumber: 'ORD-9915', tableName: 'Bàn 02', prepTime: '5.2 phút', station: 'Trạm Barista', completedAt: '20:45:10' },
    { id: 'TK-098', orderNumber: 'ORD-9910', tableName: 'Bàn 03', prepTime: '6.8 phút', station: 'Trạm Bếp Nóng', completedAt: '20:30:15' }
  ]);

  const [recalledTickets, setRecalledTickets] = useState<string[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<{ [key: string]: boolean }>({
    'Cà Phê Sữa Đá Sài Gòn': false,
    'Trà Đào Cam Sả Tươi': false,
    'Bánh Tiramisu Ý': true,
  });

  const getSlaBadge = (minutes: number) => {
    if (minutes > 12) {
      return <span style={{ background: '#DC2626', color: '#FFFFFF', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>TRỄ SLA BẾP ({minutes} phút)</span>;
    }
    if (minutes >= 7) {
      return <span style={{ background: '#D97706', color: '#FFFFFF', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>CẢNH BÁO SLA ({minutes} phút)</span>;
    }
    return <span style={{ background: '#059669', color: '#FFFFFF', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>ĐÚNG HẠN ({minutes} phút)</span>;
  };

  const handleBumpTicket = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
    setRecalledTickets([ticketId, ...recalledTickets]);
  };

  const handleToggleStock = (itemName: string) => {
    setOutOfStockItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    alert(`Đã ${!outOfStockItems[itemName] ? 'KHÓA (86-List)' : 'MỞ BÁN LẠI'} món "${itemName}". Tín hiệu SignalR 3s đã phát tới toàn bộ Menu & POS!`);
  };

  const filteredTickets = tickets.filter(t => t.station === currentStation);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', background: '#111827', color: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: KDS ACTIVE TICKETS */}
      {activeTab === 'kds-tickets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>
                Màn Hình KDS: <span style={{ color: '#60A5FA' }}>{currentStation === 'bar' ? 'TRẠM PHA CHẾ (BARISTA)' : 'TRẠM BẾP NÓNG (KITCHEN)'}</span>
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>Tự động làm mới realtime theo SignalR 3s | Thời gian đếm SLA chế biến</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setCurrentStation('bar')} style={{ padding: '10px 20px', background: currentStation === 'bar' ? '#2563EB' : '#374151', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Trạm Pha Chế Bar</button>
              <button onClick={() => setCurrentStation('kitchen')} style={{ padding: '10px 20px', background: currentStation === 'kitchen' ? '#2563EB' : '#374151', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Trạm Bếp Nóng</button>
            </div>
          </div>

          {recalledTickets.length > 0 && (
            <div style={{ marginBottom: '16px', background: '#1F2937', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #4F46E5' }}>
              <span>Vé vừa bấm hoàn tất: <strong>{recalledTickets[0]}</strong></span>
              <button onClick={() => alert(`Đã khôi phục vé ${recalledTickets[0]} về màn hình chế biến!`)} style={{ padding: '6px 14px', background: '#4F46E5', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Khôi Phục Vé Bấm Nhầm</button>
            </div>
          )}

          {/* Tickets Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} style={{ background: '#1F2937', border: ticket.elapsedMinutes > 12 ? '2px solid #EF4444' : '1px solid #374151', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60A5FA' }}>{ticket.tableName}</span>
                  {getSlaBadge(ticket.elapsedMinutes)}
                </div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Mã vé: {ticket.id} | Hóa đơn: {ticket.orderNumber}</div>

                <div style={{ borderTop: '1px solid #374151', borderBottom: '1px solid #374151', padding: '12px 0', margin: '12px 0' }}>
                  {ticket.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>{item.name}</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#F59E0B' }}>x{item.quantity}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#FBBF24', background: '#374151', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>
                        {item.modifier}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button onClick={() => alert(`Đã chuyển vé ${ticket.id} sang Trạm Bếp Nóng`)} style={{ flex: 1, padding: '10px', background: '#4B5563', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Chuyển Trạm</button>
                  <button onClick={() => handleBumpTicket(ticket.id)} style={{ flex: 2, padding: '10px', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>HOÀN TẤT (BUMP)</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: SMART BATCH COOKING VIEW */}
      {activeTab === 'kds-batch' && (
        <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ marginTop: 0, color: '#F59E0B' }}>Gom Món Chế Biến Đồng Thời (Smart Batch View)</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Hệ thống tự động tính tổng số lượng món trùng nhau từ tất cả các bàn để đầu bếp pha chế 1 mẻ lớn.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: '#374151', borderBottom: '1px solid #4B5563', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Tên Món Chế Biến</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Tổng Số Lượng Cần Pha</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Chi Tiết Các Bàn Đợi</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Thao Tác Mẻ</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px' }}>Trà Đào Cam Sả Tươi</td>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#10B981', fontSize: '20px' }}>4 Ly</td>
                <td style={{ padding: '14px 12px', color: '#9CA3AF' }}>Bàn 04 (x1), Bàn 01 (x3)</td>
                <td style={{ padding: '14px 12px' }}>
                  <button onClick={() => alert('Đã chốt hoàn tất mẻ Trà Đào 4 ly!')} style={{ padding: '8px 16px', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Xong Mẻ 4 Ly</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px' }}>Cà Phê Sữa Đá Sài Gòn</td>
                <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#10B981', fontSize: '20px' }}>2 Ly</td>
                <td style={{ padding: '14px 12px', color: '#9CA3AF' }}>Bàn 04 (x2)</td>
                <td style={{ padding: '14px 12px' }}>
                  <button onClick={() => alert('Đã chốt hoàn tất mẻ Cà Phê Sữa 2 ly!')} style={{ padding: '8px 16px', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Xong Mẻ 2 Ly</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 3. VIEW 3: 86-LIST MATRIX */}
      {activeTab === 'kds-86' && (
        <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ marginTop: 0, color: '#EF4444' }}>Bảng Khóa Món Báo Hết Nguyên Liệu (86-List Toggle Matrix)</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Khi món bị khóa 86-List, Menu QR khách và máy Thu Ngân POS sẽ tự động gán cờ Hết Hàng trong vòng 3 giây.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {Object.keys(outOfStockItems).map((item) => (
              <div key={item} style={{ background: '#374151', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFFFFF' }}>{item}</span>
                <button onClick={() => handleToggleStock(item)} style={{ padding: '8px 16px', background: outOfStockItems[item] ? '#DC2626' : '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  {outOfStockItems[item] ? 'ĐANG KHÓA (86)' : 'ĐANG BÁN'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW 4: BOM RECIPE GUIDE */}
      {activeTab === 'kds-recipe' && (
        <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ marginTop: 0, color: '#60A5FA' }}>Trình Xem Quy Trình & Định Lượng Chế Biến Chuẩn (BOM Recipe)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: '#374151', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#F59E0B' }}>Cà Phê Sữa Đá Sài Gòn</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', color: '#F3F4F6' }}>
                <li>Hạt Cà Phê Espresso: <strong>18 gram</strong> (Xay mịn Mức 2)</li>
                <li>Sữa Đặc Ngôi Sao: <strong>30 ml</strong></li>
                <li>Đá Viên Tinh Khiết: <strong>150 gram</strong></li>
                <li>Nhiệt độ pha chiết: <strong>92°C - Áp suất 9 Bar</strong></li>
              </ul>
            </div>
            <div style={{ background: '#374151', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#F59E0B' }}>Trà Đào Cam Sả Tươi</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', color: '#F3F4F6' }}>
                <li>Trà Sả Ứp Nóng: <strong>120 ml</strong></li>
                <li>Syrup Đào Monin: <strong>20 ml</strong></li>
                <li>Nước Cốt Cam Tươi: <strong>15 ml</strong></li>
                <li>Đào Miếng Giòn: <strong>2 Miếng</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW 5: KITCHEN HISTORY & SLA REPORT */}
      {activeTab === 'kds-history' && (
        <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ marginTop: 0, color: '#10B981' }}>Lịch Sử Vé Bếp Đã Chế Biến & Báo Cáo SLA</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Thời gian chế biến trung bình ca hiện tại: <strong style={{ color: '#10B981' }}>6.0 phút/vé (Đạt chỉ tiêu SLA &lt; 8p)</strong></p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: '#374151', borderBottom: '1px solid #4B5563', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Mã Vé</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Số Hóa Đơn</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Bàn Phục Vụ</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Trạm Chế Biến</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Thời Gian Hoàn Tất (SLA)</th>
                <th style={{ padding: '12px', color: '#FFFFFF' }}>Giờ Bấm Xong</th>
              </tr>
            </thead>
            <tbody>
              {completedTickets.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#FFFFFF' }}>{t.id}</td>
                  <td style={{ padding: '12px', color: '#9CA3AF' }}>{t.orderNumber}</td>
                  <td style={{ padding: '12px', color: '#60A5FA', fontWeight: 'bold' }}>{t.tableName}</td>
                  <td style={{ padding: '12px', color: '#F3F4F6' }}>{t.station}</td>
                  <td style={{ padding: '12px', color: '#10B981', fontWeight: 'bold' }}>{t.prepTime}</td>
                  <td style={{ padding: '12px', color: '#9CA3AF' }}>{t.completedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOM Recipe Modal Popup */}
      {selectedRecipeItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', padding: '24px', maxWidth: '500px', width: '100%', color: '#FFFFFF' }}>
            <h3 style={{ marginTop: 0, color: '#60A5FA' }}>Công Thức Pha Chế Chuẩn (BOM): {selectedRecipeItem}</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px' }}>
              <li>Hạt Cà Phê Espresso: <strong>18 gram</strong> (Xay mịn Mức 2)</li>
              <li>Sữa Đặc Ngôi Sao Phương Nam: <strong>30 ml</strong></li>
              <li>Đá Viên Tinh Khiết: <strong>150 gram</strong></li>
              <li>Nhiệt độ pha chiết: <strong>92°C - Áp suất 9 Bar</strong></li>
            </ul>
            <button onClick={() => setSelectedRecipeItem(null)} style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng Cửa Sổ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KdsKitchenPage;
