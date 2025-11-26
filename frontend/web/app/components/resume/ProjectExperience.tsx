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

interface ProjectExperienceProps {
  data: ProjectExperienceType[];
  onChange: (projects: ProjectExperienceType[]) => void;
}

export default function ProjectExperience({ data, onChange }: ProjectExperienceProps) {
  const [isAdding, setIsAdding] = useState(false);
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
    // TODO: 集成 AI 润色功能
    console.log('AI 润色功能待实现');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          项目经历
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          sx={{ textTransform: 'none' }}
        >
          添加
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
                  {project.role} | {project.startDate} - {project.current ? '至今' : project.endDate}
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
                项目描述：
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {project.description}
              </Typography>
            </Box>
            {project.achievements && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  项目成果：
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
              编辑项目经历
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="项目名称"
                value={currentProject.name}
                onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="项目角色"
                value={currentProject.role}
                onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
                placeholder="全栈开发工程师"
                fullWidth
              />
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  label="项目链接（选填）"
                  type="url"
                  value={currentProject.link}
                  onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                  placeholder="例：github.com/erik"
                  fullWidth
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  项目起止时间
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DatePicker
                    value={currentProject.startDate}
                    onChange={(value) => setCurrentProject({ ...currentProject, startDate: value })}
                    views={['year', 'month']}
                  />
                  <Typography color="text.secondary">至</Typography>
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
                  label="至今"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    项目描述
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={handlePolish}
                    sx={{ textTransform: 'none' }}
                  >
                    润色
                  </Button>
                </Box>
                <TextField
                  multiline
                  rows={8}
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="请填写内容"
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {currentProject.description.length}/3000
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  项目成果（选填）
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  value={currentProject.achievements}
                  onChange={(e) => setCurrentProject({ ...currentProject, achievements: e.target.value })}
                  placeholder="请填写内容"
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
                取消
              </Button>
              <Button
                variant="contained"
                onClick={handleAdd}
                sx={{ textTransform: 'none' }}
              >
                完成
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
              暂无项目经历，点击上方&quot;添加&quot;按钮创建
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
