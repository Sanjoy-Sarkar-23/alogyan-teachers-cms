import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, CreateInvoicePayload } from '@/lib/invoice-service';
import type { PaymentMode } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      teacherId: string;
      feeRecordId: string;
      studentId: string;
      studentName: string;
      studentEmail?: string;
      studentPhone?: string;
      batchId: string;
      batchName: string;
      month: string;
      amount: number;
      paidAmount: number;
      paymentMode: PaymentMode;
      paymentType?: string;
      oneTimeDescription?: string;
      paidAt: string;         // ISO string from client
      notes?: string;
      teacherEmail?: string;
      teacherPhone?: string;
    };

    const required = ['teacherId', 'feeRecordId', 'studentId', 'studentName', 'batchId', 'batchName', 'month', 'amount', 'paidAmount', 'paymentMode', 'paidAt'] as const;
    for (const field of required) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const payload: CreateInvoicePayload = {
      teacherId:          body.teacherId,
      feeRecordId:        body.feeRecordId,
      studentId:          body.studentId,
      studentName:        body.studentName,
      studentEmail:       body.studentEmail,
      studentPhone:       body.studentPhone,
      batchId:            body.batchId,
      batchName:          body.batchName,
      month:              body.month,
      amount:             body.amount,
      paidAmount:         body.paidAmount,
      paymentMode:        body.paymentMode,
      paymentType:        body.paymentType,
      oneTimeDescription: body.oneTimeDescription,
      paidAt:             new Date(body.paidAt),
      notes:              body.notes,
      teacherEmail:       body.teacherEmail,
      teacherPhone:       body.teacherPhone,
    };

    const result = await createInvoice(payload);

    return NextResponse.json({ success: true, invoiceId: result.id, invoiceNo: result.invoiceNo });
  } catch (err) {
    console.error('[invoices/generate] error:', err);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
