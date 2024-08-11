import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Grid,
} from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { useFetchUser } from '@/hooks/useFetchUser';
import { db } from '../../../../server/lib/firebase';
import { User } from '@/types/user';
import { SelectChangeEvent } from '@mui/material/Select';

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
  const { user, loading, error } = useFetchUser(userId);
  const [formData, setFormData] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => (prevState ? { ...prevState, [name]: value } : null));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevState) => (prevState ? { ...prevState, [name as keyof User]: value } : null));
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleSelectChange}
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
                  onChange={handleInputChange}
                  label="City"
                  name="city"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default AccountDetailsForm;
