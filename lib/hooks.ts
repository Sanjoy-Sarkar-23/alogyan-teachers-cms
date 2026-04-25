'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

export function useTeacherId() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setTeacherId(u?.uid ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { teacherId, loading };
}

export function useFirestoreCollection<T>(
  collectionName: string,
  teacherId: string | null,
  orderByField?: string
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = orderByField
        ? query(collection(db, collectionName), where('teacherId', '==', teacherId), orderBy(orderByField))
        : query(collection(db, collectionName), where('teacherId', '==', teacherId));
      const snap = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
    } finally {
      setLoading(false);
    }
  }, [teacherId, collectionName, orderByField]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData };
}

export function useFilteredData<T>(
  data: T[],
  search: string,
  filterFn?: (item: T, search: string) => boolean
) {
  const [searchTerm, setSearchTerm] = useState(search);

  const filtered = data.filter(item => {
    if (!searchTerm) return true;
    return filterFn ? filterFn(item, searchTerm) : true;
  });

  return { filtered, searchTerm, setSearchTerm };
}
