'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import RouterLink from 'next/link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';  // Import authClient
import { paths } from '@/paths';

export function UsersForm(): React.JSX.Element {
  const [formValues, setFormValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [alert, setAlert] = React.useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
        const { error } = await authClient.signUp({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          role: formValues.role as "user" | "admin"
        });
      if (error) {
        setAlert(error);
      } else {
        setAlert("User added successfully!");
      }
    } catch (e) {
      console.error("Error adding user: ", e);
      setAlert("Error adding user!");
    }
  };

  return (
    <div>
      <IconButton>
        <Link component={RouterLink} href={paths.home} underline="none">
          <HomeIcon />
        </Link>
      </IconButton>
      {alert ? <Alert severity={alert.includes("successfully") ? "success" : "error"}>{alert}</Alert> : null}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="Add a new user" title="Team" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <FormControl fullWidth>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  label="First Name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Last Name</InputLabel>
                <OutlinedInput
                  label="Last Name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  label="Password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={formValues.role}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">Create New User</Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
