// src/components/dashboard/account/account-details-form.tsx

import * as React from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Grid } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { useFetchUser } from '@/hooks/useFetchUser';
import { db, auth } from '../../../../server/lib/firebase';
import { User } from '@/types/user';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

interface AccountDetailsFormProps {
  userId: string;
}

export function AccountDetailsForm({ userId }: AccountDetailsFormProps): React.JSX.Element {
  // Add logging to see what userId is being passed
  console.log('AccountDetailsForm userId:', userId);

  const { user, loading, error } = useFetchUser(userId);

  const [formData, setFormData] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData) return;

    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, formData);
      alert('User details updated successfully!');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update user details.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!formData) {
    return <p>User data not available</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  label="First name"
                  name="firstName"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  label="Last name"
                  name="lastName"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  value={formData.email || ''}
                  onChange={handleChange}
                  label="Email address"
                  name="email"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  value={formData.phone || ''}
                  onChange={handleChange}
                  label="Phone number"
                  name="phone"
                  type="tel"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state || ''}
                  onChange={handleChange}
                  label="State"
                  name="state"
                  variant="outlined"
                >
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput
                  value={formData.city || ''}
                  onChange={handleChange}
                  label="City"
                  name="city"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default AccountDetailsForm;
