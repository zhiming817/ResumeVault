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
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FolderIcon from '@mui/icons-material/Folder';
import { ProjectExperience as ProjectExperienceType } from '@/app/lib/types/resume.types';
import DatePicker from '../shared/DatePicker';
import AIPolishDialog from '@/app/components/AIPolishDialog';

interface ProjectExperienceProps {
  data: ProjectExperienceType[];
  onChange: (projects: ProjectExperienceType[]) => void;
}

export default function ProjectExperience({ data, onChange }: ProjectExperienceProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [polishDialogOpen, setPolishDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectExperienceType>({
    name: '',
    role: '',
    link: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: '',
  });

  const handleAdd = () => {
    onChange([...data, currentProject]);
    setCurrentProject({
      name: '',
      role: '',
      link: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: '',
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
    setCurrentProject({ ...currentProject, description: polishedText });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Project Experience
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

      {/* Project Experience List */}
      {data.map((project, index) => (
        <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.role} | {project.startDate} - {project.current ? 'Present' : project.endDate}
                </Typography>
                {project.link && (
                  <Link href={project.link} target="_blank" rel="noopener noreferrer" variant="body2">
                    {project.link}
                  </Link>
                )}
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Project Description:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {project.description}
              </Typography>
            </Box>
            {project.achievements && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Achievements:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {project.achievements}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card sx={{ border: 2, borderColor: 'primary.main', bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Edit Project Experience
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="Project Name"
                value={currentProject.name}
                onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Role"
                value={currentProject.role}
                onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
                placeholder="Full Stack Developer"
                fullWidth
              />
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  label="Project Link (Optional)"
                  type="url"
                  value={currentProject.link}
                  onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                  placeholder="e.g.: github.com/erik"
                  fullWidth
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Project Duration
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DatePicker
                    value={currentProject.startDate}
                    onChange={(value) => setCurrentProject({ ...currentProject, startDate: value })}
                    views={['year', 'month']}
                  />
                  <Typography color="text.secondary">to</Typography>
                  <DatePicker
                    value={currentProject.endDate}
                    onChange={(value) => setCurrentProject({ ...currentProject, endDate: value })}
                    disabled={currentProject.current}
                    views={['year', 'month']}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentProject.current}
                      onChange={(e) => setCurrentProject({ ...currentProject, current: e.target.checked, endDate: e.target.checked ? '' : currentProject.endDate })}
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
                    Project Description
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
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Please enter content"
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {currentProject.description.length}/3000
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Project Achievements (Optional)
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  value={currentProject.achievements}
                  onChange={(e) => setCurrentProject({ ...currentProject, achievements: e.target.value })}
                  placeholder="Please enter content"
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {currentProject.achievements?.length || 0}/1000
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
            <FolderIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              No project experience yet. Click &quot;Add&quot; button above to create one.
            </Typography>
          </CardContent>
        </Card>
      )}

      <AIPolishDialog
        open={polishDialogOpen}
        onClose={() => setPolishDialogOpen(false)}
        initialText={currentProject.description}
        sectionType="project"
        onApply={handleApplyPolished}
      />
    </Box>
  );
}
