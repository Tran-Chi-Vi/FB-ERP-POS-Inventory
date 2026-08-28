import React, { useState, useEffect } from 'react';

interface KdsKitchenPageProps {
  activeTab: string;
}

interface TicketItem {
  id: string;
  name: string;
  quantity: number;
  note: string;
}

interface KdsTicket {
  id: string;
  orderNo: string;
  table: string;
  station: 'Barista' | 'Kitchen';
  timeElapsedMinutes: number;
  slaStatus: 'Normal' | 'Warning' | 'Overdue';
  items: TicketItem[];
}

interface BatchItem {
  dishName: string;
  totalQuantity: number;
  unit: string;
  tables: string[];
}

interface Item86 {
  id: string;
  name: string;
  category: string;
  is86Locked: boolean;
}

interface RecipeGuide {
  id: string;
  name: string;
  ingredients: string[];
  prepSteps: string[];
  standardTempPressure: string;
}

interface SlaHistoryRecord {
  ticketId: string;
  orderNo: string;
  table: string;
  station: string;
  slaMinutes: number;
  completedTime: string;
}

export const KdsKitchenPage: React.FC<KdsKitchenPageProps> = ({ activeTab }) => {
  const [activeStation, setActiveStation] = useState<'Barista' | 'Kitchen'>('Barista');

  // 1. ACTIVE SLA PREP TICKETS - READ FROM LOCALSTORAGE OR DEFAULT
  const [tickets, setTickets] = useState<KdsTicket[]>(() => {
    const saved = localStorage.getItem('fnb_kds_tickets');
    return saved ? JSON.parse(saved) : [
      {
        id: 'TK-101',
        orderNo: 'HD-9921',
        table: 'Bàn 04',
        station: 'Barista',
        timeElapsedMinutes: 14,
        slaStatus: 'Overdue',
        items: [
          { id: '1', name: 'Cà Phê Sữa Đá Sài Gòn', quantity: 2, note: 'Nhiều đá, 100% đường' },
          { id: '2', name: 'Trà Đào Cam Sả Tươi', quantity: 1, note: '50% đường, 50% đá, Topping Trân Châu' },
        ]
      },
      {
        id: 'TK-102',
        orderNo: 'HD-9924',
        table: 'Bàn 01',
        station: 'Barista',
        timeElapsedMinutes: 8,
        slaStatus: 'Warning',
        items: [
          { id: '3', name: 'Trà Đào Cam Sả Tươi', quantity: 3, note: 'Ít đường, 100% đá' },
        ]
      },
      {
        id: 'TK-103',
        orderNo: 'HD-9928',
        table: 'Bàn 03',
        station: 'Kitchen',
        timeElapsedMinutes: 4,
        slaStatus: 'Normal',
        items: [
          { id: '4', name: 'Bánh Croissant Bơ Bơ', quantity: 2, note: 'Nướng nóng hổi' },
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // 2. BATCH COOKING MATRIX
  const [batchList] = useState<BatchItem[]>([
    { dishName: 'Trà Đào Cam Sả Tươi', totalQuantity: 4, unit: 'Ly', tables: ['Bàn 04 (x1)', 'Bàn 01 (x3)'] },
    { dishName: 'Cà Phê Sữa Đá Sài Gòn', totalQuantity: 2, unit: 'Ly', tables: ['Bàn 04 (x2)'] },
    { dishName: 'Bánh Croissant Bơ', totalQuantity: 2, unit: 'Cái', tables: ['Bàn 03 (x2)'] },
  ]);

  // 3. 86-LIST MATRIX
  const [items86, setItems86] = useState<Item86[]>([
    { id: '86-1', name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê', is86Locked: false },
    { id: '86-2', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Trà Sữa', is86Locked: false },
    { id: '86-3', name: 'Bánh Tiramisu Ý', category: 'Bánh Ngọt', is86Locked: true },
    { id: '86-4', name: 'Sinh Tố Bơ Nếp', category: 'Sinh Tố', is86Locked: true },
  ]);

  // 4. BOM RECIPE GUIDES
  const [recipeGuides] = useState<RecipeGuide[]>([
    {
      id: 'REC-1',
      name: 'Cà Phê Sữa Đá Sài Gòn',
      ingredients: [
        'Hạt Cà Phê Espresso: 18g (Xay mịn mức 2)',
        'Sữa Đặc Ngôi Sao: 30ml',
        'Đá Viên Tinh Khiết: 150g'
      ],
      prepSteps: [
        'Bước 1: Nén lực 15kg vào tay pha Portafilter',
        'Bước 2: Chiết xuất 30ml cốt Espresso trong 25 giây',
        'Bước 3: Khuấy đều với sữa đặc, thêm đá và ra món'
      ],
      standardTempPressure: 'Nhiệt độ pha: 92°C | Áp suất: 9 Bar'
    },
    {
      id: 'REC-2',
      name: 'Trà Đào Cam Sả Tươi',
      ingredients: [
        'Trà Sả Ủ Nóng: 120ml',
        'Syrup Đào Monin: 20ml',
        'Nước Cốt Cam Tươi: 15ml',
        'Đào Miếng Giòn: 2 Miếng'
      ],
      prepSteps: [
        'Bước 1: Lấy 120ml cốt trà sả ấm vào bình Shaker',
        'Bước 2: Thêm 20ml syrup đào + 15ml cốt cam',
        'Bước 3: Lắc mạnh 10 nhịp với đá viên và trang trí đào miếng'
      ],
      standardTempPressure: 'Nhiệt độ trà ủ: 85°C | Thời gian ủ: 10 phút'
    }
  ]);

  // 5. SLA HISTORY LOGS
  const [slaHistory] = useState<SlaHistoryRecord[]>([
    { ticketId: 'TK-099', orderNo: 'HD-9915', table: 'Bàn 02', station: 'Trạm Barista', slaMinutes: 5.2, completedTime: '20:45:10' },
    { ticketId: 'TK-098', orderNo: 'HD-9910', table: 'Bàn 03', station: 'Trạm Bếp Nóng', slaMinutes: 6.8, completedTime: '20:30:15' },
    { ticketId: 'TK-097', orderNo: 'HD-9908', table: 'VIP 01', station: 'Trạm Barista', slaMinutes: 4.5, completedTime: '20:15:00' },
  ]);

  // Handlers
  const handleBumpTicket = (ticketId: string) => {
    const updated = tickets.filter(t => t.id !== ticketId);
    setTickets(updated);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updated));
    alert(`XÁC NHẬN HOÀN TẤT: Vé ${ticketId} đã chế biến xong và gửi tín hiệu báo Phục Vụ trả món ra bàn!`);
  };

  const handleTransferStation = (ticketId: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const nextStation = t.station === 'Barista' ? 'Kitchen' : 'Barista';
        return { ...t, station: nextStation };
      }
      return t;
    });
    setTickets(updated);
    localStorage.setItem('fnb_kds_tickets', JSON.stringify(updated));
    alert(`Đã chuyển vé ${ticketId} sang Trạm chế biến tương ứng!`);
  };

  const handleToggle86 = (id: string) => {
    setItems86(items86.map(i => i.id === id ? { ...i, is86Locked: !i.is86Locked } : i));
  };

  const filteredTickets = tickets.filter(t => t.station === activeStation);

  return (
    <div style={{ width: '100%', maxWidth: '100%', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. VIEW 1: KDS ACTIVE TICKETS SCREEN */}
      {(activeTab === 'kds-tickets' || activeTab === 'kitchen') && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0, color: '#0F172A', fontWeight: 'bold' }}>Màn Hình Chế Biến KDS Realtime (Kitchen Display System)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>Chỉ nhận vé chế biến SAU KHU THU NGÂN XÁC NHẬN THANH TOÁN | Đếm ngược SLA theo số Mã Bill.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveStation('Barista')}
                style={{
                  padding: '8px 16px',
                  background: activeStation === 'Barista' ? '#2563EB' : 'transparent',
                  color: activeStation === 'Barista' ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Trạm Pha Chế (Barista)
              </button>
              <button
                onClick={() => setActiveStation('Kitchen')}
                style={{
                  padding: '8px 16px',
                  background: activeStation === 'Kitchen' ? '#2563EB' : 'transparent',
                  color: activeStation === 'Kitchen' ? '#fff' : '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Trạm Bếp Nóng
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', gridColumn: '1 / -1' }}>
                Hiện không có vé chế biến nào đang chờ tại {activeStation === 'Barista' ? 'Trạm Barista' : 'Trạm Bếp Nóng'}.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: '#FFFFFF',
                    border: t.slaStatus === 'Overdue' ? '2px solid #EF4444' : t.slaStatus === 'Warning' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '18px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 'bold' }}>{t.table}</h3>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Vé: {t.id} | Mã Bill: {t.orderNo}</span>
                    </div>
                    <div>
                      {t.slaStatus === 'Overdue' && (
                        <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          TRỄ SLA ({t.timeElapsedMinutes} phút)
                        </span>
                      )}
                      {t.slaStatus === 'Warning' && (
                        <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          CẢNH BÁO SLA ({t.timeElapsedMinutes} phút)
                        </span>
                      )}
                      {t.slaStatus === 'Normal' && (
                        <span style={{ background: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          SLA ({t.timeElapsedMinutes} phút)
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {t.items.map((item) => (
                      <div key={item.id} style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0F172A' }}>
                          <span>{item.name}</span>
                          <span style={{ color: '#2563EB', fontSize: '16px' }}>x{item.quantity}</span>
                        </div>
                        {item.note && (
                          <div style={{ fontSize: '12px', color: '#D97706', marginTop: '4px', fontWeight: 'bold' }}>
                            Trạng thái: {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleTransferStation(t.id)}
                      style={{ flex: 1, padding: '8px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      Chuyển Trạm
                    </button>
                    <button
                      onClick={() => handleBumpTicket(t.id)}
                      style={{ flex: 2, padding: '8px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      HOÀN TẤT CHẾ BIẾN
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. VIEW 2: SMART BATCH COOKING MATRIX */}
      {activeTab === 'kds-batch' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Gom Món Chế Biến Đồng Thời (Smart Batch View)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Hệ thống tự động gom nhóm tổng số lượng món trùng nhau từ tất cả các bàn để đầu bếp pha chế 1 mẻ lớn tối ưu thời gian.</p>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tên Món Chế Biến</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Tổng Số Lượng Cần Pha</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Chi Tiết Các Bàn Đang Đợi</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thao Tác Mẻ</th>
                </tr>
              </thead>
              <tbody>
                {batchList.map((b, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{b.dishName}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669', fontSize: '16px' }}>{b.totalQuantity} {b.unit}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{b.tables.join(', ')}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => alert(`Đã bấm hoàn tất mẻ ${b.totalQuantity} ${b.unit} món "${b.dishName}"!`)} style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        Xong Mẻ {b.totalQuantity} {b.unit}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VIEW 3: 86-LIST LOCK MATRIX */}
      {activeTab === 'kds-86' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Bảng Khóa Món Báo Hết Nguyên Liệu (86-List Toggle Matrix)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Khi món bị khóa 86-List, Menu QR của khách và màn hình Thu Ngân POS sẽ tự động gắn cờ Hết Hàng trong vòng 3 giây.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {items86.map((item) => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#0F172A' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Danh mục: {item.category}</div>
                </div>
                <button
                  onClick={() => handleToggle86(item.id)}
                  style={{
                    padding: '8px 14px',
                    background: item.is86Locked ? '#DC2626' : '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  {item.is86Locked ? 'ĐANG KHÓA (86)' : 'ĐANG BÁN'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW 4: BOM RECIPE GUIDE */}
      {activeTab === 'kds-recipe' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Trình Xem Quy Trình & Định Lượng Chế Biến Chuẩn (BOM Recipe Guide)</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Hướng dẫn định lượng nguyên liệu chuẩn và các bước pha chế tiêu chuẩn cho Barista/Bếp.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {recipeGuides.map((rg) => (
              <div key={rg.id} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2563EB', fontSize: '18px', fontWeight: 'bold' }}>{rg.name}</h3>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>1. Định lượng nguyên liệu chuẩn:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
                    {rg.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>2. Quy trình các bước thực hiện:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
                    {rg.prepSteps.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
                <div style={{ background: '#DBEAFE', color: '#1E40AF', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {rg.standardTempPressure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VIEW 5: SLA HISTORY REPORT */}
      {activeTab === 'kds-history' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0F172A', fontWeight: 'bold' }}>Lịch Sử Vé Bếp Đã Chế Biến & Báo Cáo SLA</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>Thời gian chế biến trung bình ca hiện tại: <strong style={{ color: '#059669' }}>6.0 phút/vé (Đạt chỉ tiêu SLA &lt; 8p)</strong></p>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Mã Vé</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Số Hóa Đơn</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Bàn Phục Vụ</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Trạm Chế Biến</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Thời Gian Hoàn Tất (SLA)</th>
                  <th style={{ padding: '12px', color: '#0F172A', fontWeight: 'bold' }}>Giờ Bấm Xong</th>
                </tr>
              </thead>
              <tbody>
                {slaHistory.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#0F172A' }}>{s.ticketId}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{s.orderNo}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#2563EB' }}>{s.table}</td>
                    <td style={{ padding: '14px 12px', color: '#0F172A' }}>{s.station}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#059669' }}>{s.slaMinutes} phút</td>
                    <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '13px' }}>{s.completedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default KdsKitchenPage;
