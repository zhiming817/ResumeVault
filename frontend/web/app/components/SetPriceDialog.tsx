'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/app/lib/config/api.config';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface SetPriceDialogProps {
  open: boolean;
  onClose: () => void;
  resumeId: string;
  resumeName: string;
  owner: string;
  currentPrice?: number;
  onSuccess?: () => void;
}

export default function SetPriceDialog({
  open,
  onClose,
  resumeId,
  resumeName,
  owner,
  currentPrice = 0,
  onSuccess,
}: SetPriceDialogProps) {
  const [price, setPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Convert lamports to SOL for display (1 SOL = 1,000,000,000 lamports)
      const solPrice = currentPrice / 1_000_000_000;
      setPrice(solPrice > 0 ? solPrice.toString() : '');
      setError(null);
    }
  }, [open, currentPrice]);

  const handleSetPrice = async () => {
    const priceNum = parseFloat(price);
    
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
      const priceInLamports = Math.floor(priceNum * 1_000_000_000);

      const response = await fetch(`${API_BASE_URL}/api/resumes/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resumeId,
          owner: owner,
          price: priceInLamports,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set price');
      }

      const result = await response.json();
      console.log('Price set successfully:', result);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close dialog
      onClose();
    } catch (err) {
      console.error('Failed to set price:', err);
      setError(err instanceof Error ? err.message : 'Failed to set price');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoneyIcon color="primary" />
          <Typography variant="h6">Set Resume Price</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Set the price for viewing: <strong>{resumeName}</strong>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isLoading}
            placeholder="0.001"
            inputProps={{
              min: 0,
              step: 0.001,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color="text.secondary">ETH</Typography>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
            helperText="Enter 0 for free access. Price will be charged in SOL."
          />

          {price && parseFloat(price) > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Price in lamports: {Math.floor(parseFloat(price) * 1_000_000_000).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSetPrice}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {isLoading ? 'Setting...' : 'Set Price'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
