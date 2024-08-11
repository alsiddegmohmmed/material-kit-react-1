// src/hooks/useFetchUser.ts

import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../server/lib/firebase';
import { User } from '../types/user';

export const useFetchUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if userId is valid
        if (!userId) {
          throw new Error('Invalid userId');
        }

        // Log the userId being used
        console.log('Fetching user with userId:', userId);

        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          console.error('No such document!');
          setError('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
