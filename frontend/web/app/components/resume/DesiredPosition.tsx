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
        编辑求职期望
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            工作性质
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
              全职
            </ToggleButton>
            <ToggleButton value="parttime" sx={{ textTransform: 'none' }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              兼职
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          label="期望职位"
          value={data.position}
          onChange={(e) => onChange('position', e.target.value)}
          placeholder="Java开发工程师"
          fullWidth
        />

        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <TextField
            label="期望行业"
            value={data.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            placeholder="企业服务、电商、医疗健康"
            fullWidth
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            薪资要求
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="number"
              value={data.salaryMin}
              onChange={(e) => onChange('salaryMin', e.target.value)}
              placeholder="13k"
              fullWidth
            />
            <Typography color="text.secondary">至</Typography>
            <TextField
              type="number"
              value={data.salaryMax}
              onChange={(e) => onChange('salaryMax', e.target.value)}
              placeholder="17k"
              fullWidth
            />
          </Box>
        </Box>

        <TextField
          label="工作城市"
          value={data.city}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="上海"
          fullWidth
        />

        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <TextField
            label="其他感兴趣城市（选填）"
            value={data.otherCities || ''}
            onChange={(e) => onChange('otherCities', e.target.value)}
            placeholder="苏州"
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
