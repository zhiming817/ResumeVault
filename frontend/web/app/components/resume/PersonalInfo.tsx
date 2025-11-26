'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import DatePicker from '../shared/DatePicker';
import { PersonalInfo as PersonalInfoType } from '@/app/lib/types';

interface PersonalInfoProps {
  formData: {
    personal: PersonalInfoType;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
}

export default function PersonalInfo({ formData, handleInputChange }: PersonalInfoProps) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Edit Personal Information
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <TextField
          label="Name"
          value={formData.personal.name}
          onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
          placeholder="John"
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>Current Job Status</InputLabel>
          <Select
            value={formData.personal.jobStatus}
            onChange={(e) => handleInputChange('personal', 'jobStatus', e.target.value)}
            label="Current Job Status"
          >
            <MenuItem value="employed">Available - Ready to Start</MenuItem>
            <MenuItem value="looking">Employed - Open to Opportunities</MenuItem>
            <MenuItem value="unemployed">Actively Looking</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.personal.gender}
            onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Identity</InputLabel>
          <Select
            value={formData.personal.identity}
            onChange={(e) => handleInputChange('personal', 'identity', e.target.value)}
            label="Identity"
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="fresh">Fresh Graduate</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Date of Birth
          </Typography>
          <DatePicker
            value={formData.personal.birthDate}
            onChange={(value) => handleInputChange('personal', 'birthDate', value)}
            placeholder="Select date of birth"
            showMonthYearPicker
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Work Start Date
          </Typography>
          <DatePicker
            value={formData.personal.workStartDate}
            onChange={(value) => handleInputChange('personal', 'workStartDate', value)}
            placeholder="Select work start date"
            showMonthYearPicker
          />
        </Box>
        <TextField
          label="Phone"
          type="tel"
          value={formData.personal.phone}
          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
          fullWidth
        />

       

        <TextField
          label="WeChat (Optional)"
          value={formData.personal.wechat}
          onChange={(e) => handleInputChange('personal', 'wechat', e.target.value)}
          fullWidth
        />

        <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <TextField
            label="Email (Optional)"
            type="email"
            value={formData.personal.email}
            onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
