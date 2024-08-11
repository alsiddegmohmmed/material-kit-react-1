'use client';
import * as React from 'react';
import { Button, CircularProgress, Grid, Link } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { useDashboardData } from '@/hooks/useDashboardData';
import { paths } from '@/paths';
import RouterLink from 'next/link';
import Loading from '@/components/loading/loading';

export default function Page(): React.JSX.Element {
  const { loading, numProducts, numUsers } = useDashboardData();

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid container item spacing={3} xs={12} alignItems="flex-start">
        <Grid item lg={3} sm={6} xs={12} style={{ flex: 1 }}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value={`${numProducts} Items`} />
        </Grid>
        <Grid item lg={3} sm={6} xs={12} style={{ flex: 1 }}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={`${numUsers} Users`} />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Grid item>
          <Link component={RouterLink} href={paths.dashboard.newproduct}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
              Add
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <LatestProducts sx={{ height: '100%' }} searchTerm="" limit={5} />
      </Grid>
    </Grid>
  );
}
