// src/app/dashboard/account/page.tsx
'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

const fetchUserData = async () => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) {
    throw new Error('No user is currently signed in.');
  }

  const userDoc = await getDoc(doc(getFirestore(), 'users', userId));
  if (!userDoc.exists()) {
    throw new Error('User does not exist in Firestore.');
  }

  return { id: userDoc.id, ...userDoc.data() };
};

export default function Page(): React.JSX.Element {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchUserData()
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo user={user} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm userId={user.id} />
        </Grid>
      </Grid>
    </Stack>
  );
}
