'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WorkIcon from '@mui/icons-material/Work';
import { WorkExperience as WorkExperienceType } from '@/app/lib/types/resume.types';
import DatePicker from '../shared/DatePicker';
import AIPolishDialog from '@/app/components/AIPolishDialog';

interface WorkExperienceProps {
  data: WorkExperienceType[];
  onChange: (experiences: WorkExperienceType[]) => void;
}

export default function WorkExperience({ data, onChange }: WorkExperienceProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [polishDialogOpen, setPolishDialogOpen] = useState(false);
  const [currentWork, setCurrentWork] = useState<WorkExperienceType>({
    company: '',
    industry: '',
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const handleAdd = () => {
    onChange([...data, currentWork]);
    setCurrentWork({
      company: '',
      industry: '',
      department: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handlePolish = () => {
    setPolishDialogOpen(true);
  };

  const handleApplyPolished = (polishedText: string) => {
    setCurrentWork({ ...currentWork, description: polishedText });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Work Experience
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          sx={{ textTransform: 'none' }}
        >
          Add
        </Button>
      </Box>

      {/* Work Experience List */}
      {data.map((work, index) => (
        <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {work.company} - {work.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {work.startDate} - {work.current ? 'Present' : work.endDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
              {work.description}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card sx={{ border: 2, borderColor: 'primary.main', bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Edit Work Experience
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="Company Name"
                value={currentWork.company}
                onChange={(e) => setCurrentWork({ ...currentWork, company: e.target.value })}
                placeholder="ABC Technology Co., Ltd."
                fullWidth
              />
              <TextField
                label="Industry"
                value={currentWork.industry}
                onChange={(e) => setCurrentWork({ ...currentWork, industry: e.target.value })}
                placeholder="Internet"
                fullWidth
              />
              <TextField
                label="Department (Optional)"
                value={currentWork.department}
                onChange={(e) => setCurrentWork({ ...currentWork, department: e.target.value })}
                placeholder="e.g.: Product Department"
                fullWidth
              />
              <TextField
                label="Position"
                value={currentWork.position}
                onChange={(e) => setCurrentWork({ ...currentWork, position: e.target.value })}
                placeholder="Full Stack Developer"
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Employment Period
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DatePicker
                    value={currentWork.startDate}
                    onChange={(value) => setCurrentWork({ ...currentWork, startDate: value })}
                    views={['year', 'month']}
                  />
                  <Typography color="text.secondary">to</Typography>
                  <DatePicker
                    value={currentWork.endDate}
                    onChange={(value) => setCurrentWork({ ...currentWork, endDate: value })}
                    disabled={currentWork.current}
                    views={['year', 'month']}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentWork.current}
                      onChange={(e) => setCurrentWork({ ...currentWork, current: e.target.checked, endDate: e.target.checked ? '' : currentWork.endDate })}
                      size="small"
                    />
                  }
                  label="Present"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Job Description
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={handlePolish}
                    sx={{ textTransform: 'none' }}
                  >
                    Polish
                  </Button>
                </Box>
                <TextField
                  multiline
                  rows={8}
                  value={currentWork.description}
                  onChange={(e) => setCurrentWork({ ...currentWork, description: e.target.value })}
                  placeholder="1. Completed module development;&#10;2. Coordinated with testers for module testing;&#10;3. Participated in technical discussions and provided suggestions;&#10;4. Wrote related development documentation."
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {currentWork.description.length}/3000
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setIsAdding(false)}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAdd}
                sx={{ textTransform: 'none' }}
              >
                Done
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {data.length === 0 && !isAdding && (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <WorkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              No work experience yet. Click &quot;Add&quot; button above to create one.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* AI Polish Dialog */}
      <AIPolishDialog
        open={polishDialogOpen}
        onClose={() => setPolishDialogOpen(false)}
        initialText={currentWork.description}
        sectionType="work_experience"
        onApply={handleApplyPolished}
      />
    </Box>
  );
}
