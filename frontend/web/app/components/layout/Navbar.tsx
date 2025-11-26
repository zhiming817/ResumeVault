'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Navbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const navigation = [
    { name: 'Home', href: '/resume' },
    { name: 'Create Resume', href: '/resume/create' },
    { name: 'My Resumes', href: '/resume/list' },
    { name: 'Browse Resumes', href: '/resume/browse' },
  ];

  const isActive = (href: string) => {
    if (href === '/resume/list') return pathname === '/resume/list' || pathname === '/resume';
    return pathname?.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuAnchor(null);
  };

  const handleConnectWallet = () => {
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setWalletMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ maxWidth: '80rem', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Logo */}
        <Box
          onClick={() => handleNavigation('/resume')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 4 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
              p: 1,
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontSize: '1.25rem' }}>🏦</Typography>
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            ResumeVault
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navigation.map((item) => (
            <Button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              sx={{
                color: isActive(item.href) ? 'primary.main' : 'text.secondary',
                bgcolor: isActive(item.href) ? 'primary.50' : 'transparent',
                '&:hover': {
                  bgcolor: isActive(item.href) ? 'primary.100' : 'grey.50',
                },
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isConnected && address ? (
            <>
              <Chip
                avatar={<Avatar sx={{ width: 24, height: 24 }}>{address[2]}</Avatar>}
                label={formatAddress(address)}
                onClick={(e) => setWalletMenuAnchor(e.currentTarget)}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  cursor: 'pointer',
                }}
              />
              <Menu
                anchorEl={walletMenuAnchor}
                open={Boolean(walletMenuAnchor)}
                onClose={() => setWalletMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleCopyAddress}>
                  <ListItemIcon>
                    <ContentCopyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy Address</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDisconnect}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Disconnect</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleConnectWallet}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
              }}
            >
              Connect Wallet
            </Button>
          )}

          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Navigation Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => setMobileMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {navigation.map((item) => (
            <MenuItem
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              selected={isActive(item.href)}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
