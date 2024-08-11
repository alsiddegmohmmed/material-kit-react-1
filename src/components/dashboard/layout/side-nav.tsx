// src/components/dashboard/layout/side-nav.tsx
'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import { useUser } from '@/hooks/use-user';
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const { user } = useUser();
  const pathname = usePathname();

  // Filter the nav items based on user role
  const filteredNavItems = React.useMemo(() => {
    if (user?.role !== 'admin') {
      return navItems.filter(item => item.key !== 'customers');
    }
    return navItems;
  }, [user]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        width: 240, // Fixed width for the sidebar
        top: 0,
        left: 0,
        zIndex: 1200, // MUI default app bar zIndex
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto', // Scrollable content if needed
        boxShadow: 1, // Shadow for separation
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
        </Box>

          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="text.secondary" variant="body2">
              Warehouse
            </Typography>
            <Typography color="text.primary" variant="subtitle1">
              Management
            </Typography>
          </Box>


      </Stack>
      <Divider sx={{ borderColor: 'divider' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: filteredNavItems })}
      </Box>
      <Divider sx={{ borderColor: 'divider' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 4,
          color: 'text.secondary',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '8px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'background-color 0.3s, color 0.3s',
          ...(disabled && {
            bgcolor: 'background.disabled',
            color: 'text.disabled',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'primary.contrastText' : 'text.secondary'}
              fontSize="medium"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
