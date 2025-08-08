import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useCollection = (collectionName: string, constraints?: any[]) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    
    if (constraints && constraints.length > 0) {
      q = query(q, ...constraints) as any;
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
        }));
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { documents, loading, error };
};

export const useDocument = (collectionName: string, docId: string | null) => {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setDocument({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
          });
        } else {
          setDocument(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { document, loading, error };
};

export const addDocument = async (collectionName: string, data: any) => {
  const docData = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  return await addDoc(collection(db, collectionName), docData);
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docData = {
    ...data,
    updatedAt: Timestamp.now()
  };
  return await updateDoc(doc(db, collectionName, docId), docData);
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  return await deleteDoc(doc(db, collectionName, docId));
};