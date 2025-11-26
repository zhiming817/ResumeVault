'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Education as EducationType } from '@/app/lib/types/resume.types';
import DatePicker from '../shared/DatePicker';

interface EducationProps {
  data: EducationType[];
  onChange: (education: EducationType[]) => void;
}

export default function Education({ data, onChange }: EducationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<EducationType>({
    school: '',
    degree: 'bachelor',
    educationType: 'fulltime',
    major: '',
    startDate: '',
    endDate: '',
    experience: '',
    thesis: '',
    thesisDescription: '',
  });

  const handleAdd = () => {
    onChange([...data, currentEdu]);
    setCurrentEdu({
      school: '',
      degree: 'bachelor',
      educationType: 'fulltime',
      major: '',
      startDate: '',
      endDate: '',
      experience: '',
      thesis: '',
      thesisDescription: '',
    });
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const degreeLabels: Record<string, string> = {
    bachelor: '本科',
    master: '硕士',
    doctor: '博士',
    associate: '专科',
  };

  const handlePolish = () => {
    // TODO: 集成 AI 润色功能
    console.log('AI 润色功能待实现');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Education
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

      {/* Education List */}
      {data.map((edu, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <SchoolIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {edu.school}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.major} | {degreeLabels[edu.degree]}·{edu.educationType === 'parttime' ? 'Part-time' : 'Full-time'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {edu.experience && (
                  <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                    <strong>Campus Experience:</strong> {edu.experience}
                  </Typography>
                )}
                {edu.thesis && (
                  <Typography variant="body2">
                    <strong>Thesis/Project:</strong> {edu.thesis}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card sx={{ border: 2, borderColor: 'primary.main', bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Edit Education
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="School Name"
                value={currentEdu.school}
                onChange={(e) => setCurrentEdu({ ...currentEdu, school: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Education Type</InputLabel>
                <Select
                  value={currentEdu.educationType}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, educationType: e.target.value as 'fulltime' | 'parttime' })}
                  label="Education Type"
                >
                  <MenuItem value="fulltime">Full-time</MenuItem>
                  <MenuItem value="parttime">Part-time</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Degree</InputLabel>
                <Select
                  value={currentEdu.degree}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value as EducationType['degree'] })}
                  label="Degree"
                >
                  <MenuItem value="bachelor">Bachelor</MenuItem>
                  <MenuItem value="master">Master</MenuItem>
                  <MenuItem value="doctor">PhD</MenuItem>
                  <MenuItem value="associate">Associate</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Major"
                value={currentEdu.major}
                onChange={(e) => setCurrentEdu({ ...currentEdu, major: e.target.value })}
                placeholder="Computer Science and Technology"
                fullWidth
              />
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  School Period
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DatePicker
                    value={currentEdu.startDate}
                    onChange={(value) => setCurrentEdu({ ...currentEdu, startDate: value })}
                    views={['year', 'month']}
                  />
                  <Typography color="text.secondary">to</Typography>
                  <DatePicker
                    value={currentEdu.endDate}
                    onChange={(value) => setCurrentEdu({ ...currentEdu, endDate: value })}
                    views={['year', 'month']}
                  />
                </Box>
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Resume Highlights
                  </Typography>
                  <Button
                    onClick={handlePolish}
                    startIcon={<AutoFixHighIcon />}
                    sx={{ textTransform: 'none' }}
                    color="secondary"
                    size="small"
                  >
                    Don't know how to showcase education? Try resume highlights
                  </Button>
                </Box>
                <TextField
                  label="Campus Experience (Optional)"
                  value={currentEdu.experience}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, experience: e.target.value })}
                  placeholder="1. Campus leadership roles...&#10;2. Awards and honors...&#10;3. Major courses studied..."
                  multiline
                  rows={5}
                  fullWidth
                  helperText={`${currentEdu.experience?.length || 0}/3000`}
                />
              </Box>
              <TextField
                label="Thesis/Graduation Project (Optional)"
                value={currentEdu.thesis}
                onChange={(e) => setCurrentEdu({ ...currentEdu, thesis: e.target.value })}
                placeholder="Please enter"
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              <TextField
                label="Thesis/Project Description (Optional)"
                value={currentEdu.thesisDescription}
                onChange={(e) => setCurrentEdu({ ...currentEdu, thesisDescription: e.target.value })}
                placeholder="Describe the main content of your thesis/project to showcase your academic ability&#10;For example:&#10;1. Research purpose and significance...&#10;2. Abstract and keywords...&#10;3. Conclusions or results"
                multiline
                rows={5}
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                onClick={() => setIsAdding(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                variant="contained"
              >
                Done
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {data.length === 0 && !isAdding && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              No education history yet. Click &quot;Add&quot; button above to create one.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
