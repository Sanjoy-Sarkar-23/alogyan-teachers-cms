'use client';

import { useParams } from 'next/navigation';

import { BatchForm } from '@/components/batches/BatchForm';

export default function EditBatchPage() {
  const { id } = useParams<{ id: string }>();
  return <BatchForm batchId={id} />;
}
