'use client';

import { useState } from 'react';
import { PRODUCTS, type ProductId } from '@/lib/iap';
import { apiUrl } from '@/lib/config';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

interface Purchase {
  id: string;
  product_id: string;
  status: string;
  created_at: string;
}

interface Props {
  sessionId: string;
}

export function PurchaseHistorySection({ sessionId }: Props) {
  const [purchases, setPurchases] = useState<Purchase[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function loadHistory() {
    if (purchases !== null) {
      setOpen(!open);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/iap/history?sessionId=${sessionId}`));
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases || []);
      } else {
        setPurchases([]);
      }
    } catch {
      setPurchases([]);
    }
    setLoading(false);
    setOpen(true);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function getProductName(productId: string): string {
    const product = PRODUCTS[productId as ProductId];
    return product?.name || productId;
  }

  function getProductPrice(productId: string): string {
    const product = PRODUCTS[productId as ProductId];
    return product?.priceDisplay || '';
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return '결제 완료';
      case 'refunded': return '환불 완료';
      case 'pending': return '처리 중';
      default: return status;
    }
  }

  return (
    <div className={IS_TOSS ? 'mt-6' : 'mt-8'}>
      <button
        onClick={loadHistory}
        className={
          IS_TOSS
            ? 'text-st10 text-tds-grey-500 underline underline-offset-2'
            : 'text-xs text-muted-foreground/50 underline underline-offset-2'
        }
      >
        {loading ? '불러오는 중...' : '결제 내역 확인'}
      </button>

      {open && purchases !== null && (
        <div className={`mt-3 rounded-xl p-4 ${IS_TOSS ? 'border border-tds-grey-200 bg-tds-grey-50' : 'border border-border bg-card'}`}>
          {purchases.length === 0 ? (
            <p className={IS_TOSS ? 'text-st10 text-tds-grey-400 text-center' : 'text-xs text-muted-foreground/40 text-center'}>
              결제 내역이 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {purchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className={IS_TOSS ? 'text-st8 font-medium text-tds-grey-900' : 'text-sm font-medium text-foreground'}>
                      {getProductName(p.product_id)}
                    </p>
                    <p className={IS_TOSS ? 'text-st11 text-tds-grey-400' : 'text-xs text-muted-foreground/40'}>
                      {formatDate(p.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={IS_TOSS ? 'text-st9 font-medium text-tds-grey-700' : 'text-sm font-medium text-foreground/80'}>
                      {getProductPrice(p.product_id)}
                    </p>
                    <p className={
                      p.status === 'completed'
                        ? (IS_TOSS ? 'text-st11 text-tds-blue-500' : 'text-xs text-primary')
                        : p.status === 'refunded'
                          ? (IS_TOSS ? 'text-st11 text-tds-red-500' : 'text-xs text-destructive')
                          : (IS_TOSS ? 'text-st11 text-tds-grey-400' : 'text-xs text-muted-foreground/50')
                    }>
                      {getStatusLabel(p.status)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
