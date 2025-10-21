// Payment API service
import { supabase } from '../config/supabase';
import { WEB_API_URL } from '../config/env';

export const payFees = async (paymentData: any) => {
  // ...implementation...
};

export interface FeeCategoryItem {
  id: string;
  name: string;
  description?: string | null;
  amount: number;
  is_mandatory?: boolean;
  supports_recurring?: boolean;
  supports_one_time?: boolean;
  category_type?: string | null;
}

export const fetchStudentFeeCategories = async (studentId: string): Promise<FeeCategoryItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }

  const resp = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch student fee details');
  }

  const data = await resp.json();
  const list = Array.isArray(data.student_fees) ? data.student_fees : [];
  const entry = list.find((s: any) => s?.student?.id === studentId);
  if (!entry) return [];
  const categories = Array.isArray(entry.fee_categories) ? entry.fee_categories : [];
  return categories.map((c: any) => ({
    id: String(c.id),
    name: String(c.name || ''),
    description: c.description ?? null,
    amount: Number(c.amount || 0),
    is_mandatory: Boolean(c.is_mandatory),
    supports_recurring: Boolean(c.supports_recurring),
    supports_one_time: Boolean(c.supports_one_time),
    category_type: c.category_type ?? null,
  }));
};

export interface PaymentScheduleItem {
  id: string;
  name: string;
  schedule_type: string;
  discount_percentage?: number | null;
  template_name?: string | null;
  installments: Array<{
    id: string;
    installment_number: number;
    name: string;
    amount: number;
    percentage?: number | null;
    due_date: string;
    term_id?: string | null;
    is_active?: boolean;
    paid?: boolean;
  }>;
}

export const fetchStudentPaymentSchedules = async (studentId: string): Promise<PaymentScheduleItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }

  const resp = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch student fee details');
  }

  const data = await resp.json();
  const list = Array.isArray(data.student_fees) ? data.student_fees : [];
  const entry = list.find((s: any) => s?.student?.id === studentId);
  if (!entry) return [];
  const schedules = Array.isArray(entry.payment_schedules) ? entry.payment_schedules : [];
  return schedules.map((s: any) => ({
    id: String(s.id),
    name: String(s.name || ''),
    schedule_type: String(s.schedule_type || ''),
    discount_percentage: s.discount_percentage ?? null,
    template_name: s.template_name ?? null,
    installments: Array.isArray(s.installments) ? s.installments.map((i: any) => ({
      id: String(i.id),
      installment_number: Number(i.installment_number || 0),
      name: String(i.name || ''),
      amount: Number(i.amount || 0),
      percentage: i.percentage ?? null,
      due_date: String(i.due_date || ''),
      term_id: i.term_id ?? null,
      is_active: Boolean(i.is_active),
      paid: Boolean(i.paid),
    })) : [],
  }));
};
