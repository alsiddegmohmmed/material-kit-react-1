// src/app/dashboard/customers/page.tsx

'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import RouterLink from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';
import { paths } from '@/paths';
import Loading from '@/components/loading/loading';// Import the Loading component

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCustomers = async (): Promise<void> => {
      setLoading(true); // Set loading to true before fetching
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
        })) as Customer[];
        setCustomers(usersData);
      } catch (error) {
        console.error('Error fetching customers: ', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    void fetchCustomers();
  }, []);

  const deleteCustomerById = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', id));
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handlePageChange = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = applyPagination(filteredCustomers, page, rowsPerPage);

  if (loading) {
    return <Loading />; // Show loading component while fetching data
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
        </Stack>
        <div>
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" component={RouterLink} href={paths.dashboard.addusers}>
            Add Users
          </Button>
        </div>
      </Stack>
      <CustomersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <CustomersTable
        count={filteredCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDelete={deleteCustomerById}
      />
    </Stack>
  );
}

function applyPagination<T>(items: T[], page: number, rowsPerPage: number): T[] {
  return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
