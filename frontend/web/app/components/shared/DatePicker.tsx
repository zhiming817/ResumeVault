'use client';

import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showMonthYearPicker?: boolean;
  showYearPicker?: boolean;
  views?: ('year' | 'month' | 'day')[];
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

/**
 * Unified DatePicker Component using MUI
 * Supports Year, Month-Year, and Full Date selection
 */
export default function DatePicker({
  value,
  onChange,
  placeholder,
  showMonthYearPicker = false,
  showYearPicker = false,
  views: propViews,
  disabled = false,
  minDate,
  maxDate,
  className = '',
}: DatePickerProps) {
  // Convert string value to dayjs object
  const dateValue: Dayjs | null = value ? dayjs(value) : null;

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue || !newValue.isValid()) {
      onChange('');
      return;
    }

    // Format based on mode
    let formatString = 'YYYY-MM-DD';
    if (showYearPicker) {
      formatString = 'YYYY';
    } else if (showMonthYearPicker) {
      formatString = 'YYYY-MM';
    }

    onChange(newValue.format(formatString));
  };

  // Determine views and format
  let views: ('year' | 'month' | 'day')[] = propViews || ['year', 'month', 'day'];
  let format = 'YYYY-MM-DD';

  // Override with showYearPicker and showMonthYearPicker if specified
  if (showYearPicker) {
    views = ['year'];
    format = 'YYYY';
  } else if (showMonthYearPicker) {
    views = ['year', 'month'];
    format = 'YYYY-MM';
  } else if (propViews) {
    // Determine format based on views
    if (propViews.includes('day')) {
      format = 'YYYY-MM-DD';
    } else if (propViews.includes('month')) {
      format = 'YYYY-MM';
    } else if (propViews.includes('year')) {
      format = 'YYYY';
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        value={dateValue}
        onChange={handleChange}
        views={views}
        format={format}
        disabled={disabled}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            placeholder: placeholder,
            size: 'small',
            className: className,
            sx: {
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease-in-out',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#14b8a6',
                  borderWidth: '2px',
                },
                '& input': {
                  padding: '8.5px 14px',
                  fontSize: '0.875rem',
                  color: '#111827',
                },
              },
              '& .MuiInputAdornment-root': {
                color: '#6b7280',
                marginRight: '4px',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.25rem',
              },
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                borderRadius: '1rem',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6',
              },
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: '#14b8a6',
                '&:hover': {
                  backgroundColor: '#0d9488',
                },
              },
              '& .MuiPickersYear-yearButton.Mui-selected': {
                backgroundColor: '#14b8a6',
                '&:hover': {
                  backgroundColor: '#0d9488',
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
