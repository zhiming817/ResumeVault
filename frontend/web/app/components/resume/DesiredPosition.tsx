'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DesiredPosition as DesiredPositionType } from '@/app/lib/types/resume.types';

interface DesiredPositionProps {
  data: DesiredPositionType;
  onChange: (field: keyof DesiredPositionType, value: string) => void;
}

export default function DesiredPosition({ data, onChange }: DesiredPositionProps) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Edit Desired Position
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Job Type
          </Typography>
          <ToggleButtonGroup
            value={data.jobType}
            exclusive
            onChange={(e, value) => value && onChange('jobType', value)}
            fullWidth
            sx={{ height: 56 }}
          >
            <ToggleButton value="fulltime" sx={{ textTransform: 'none' }}>
              <WorkIcon sx={{ mr: 1 }} />
              Full-time
            </ToggleButton>
            <ToggleButton value="parttime" sx={{ textTransform: 'none' }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              Part-time
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Salary Range
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="number"
              value={data.salaryMin}
              onChange={(e) => onChange('salaryMin', e.target.value)}
              placeholder="13k"
              fullWidth
            />
            <Typography color="text.secondary">to</Typography>
            <TextField
              type="number"
              value={data.salaryMax}
              onChange={(e) => onChange('salaryMax', e.target.value)}
              placeholder="17k"
              fullWidth
            />
          </Box>
        </Box>
         <Box sx={{ gridColumn: { md: 'span 1' } }}>
          <TextField
            label="Desired Position"
            value={data.position}
            onChange={(e) => onChange('position', e.target.value)}
            placeholder="Java Developer"
            fullWidth
          />
        </Box>
        <Box sx={{ gridColumn: { md: 'span 1' } }}>
          <TextField
            label="Industry"
            value={data.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            placeholder="Enterprise, E-commerce, Healthcare"
            fullWidth
          />
        </Box>

        
        <Box sx={{ gridColumn: { md: 'span 1' } }}>
            <TextField
              label="Work City"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Shanghai"
              fullWidth
            />
        </Box>

        <Box sx={{ gridColumn: { md: 'span 1' } }}>
          <TextField
            label="Other Cities (Optional)"
            value={data.otherCities || ''}
            onChange={(e) => onChange('otherCities', e.target.value)}
            placeholder="Suzhou"
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
