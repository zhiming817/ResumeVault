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
          教育经历
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
                      {edu.major} | {degreeLabels[edu.degree]}·{edu.educationType === 'parttime' ? '在职' : '全日制'}
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
                    <strong>在校经历：</strong> {edu.experience}
                  </Typography>
                )}
                {edu.thesis && (
                  <Typography variant="body2">
                    <strong>论文/毕业设计：</strong> {edu.thesis}
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
              编辑教育经历
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="学校名称"
                value={currentEdu.school}
                onChange={(e) => setCurrentEdu({ ...currentEdu, school: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>学历类型</InputLabel>
                <Select
                  value={currentEdu.educationType}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, educationType: e.target.value as 'fulltime' | 'parttime' })}
                  label="学历类型"
                >
                  <MenuItem value="fulltime">全日制</MenuItem>
                  <MenuItem value="parttime">在职</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>学历</InputLabel>
                <Select
                  value={currentEdu.degree}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value as EducationType['degree'] })}
                  label="学历"
                >
                  <MenuItem value="bachelor">本科</MenuItem>
                  <MenuItem value="master">硕士</MenuItem>
                  <MenuItem value="doctor">博士</MenuItem>
                  <MenuItem value="associate">专科</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="专业"
                value={currentEdu.major}
                onChange={(e) => setCurrentEdu({ ...currentEdu, major: e.target.value })}
                placeholder="计算机科学与技术"
                fullWidth
              />
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  在校时间
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DatePicker
                    value={currentEdu.startDate}
                    onChange={(value) => setCurrentEdu({ ...currentEdu, startDate: value })}
                    views={['year', 'month']}
                  />
                  <Typography color="text.secondary">至</Typography>
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
                    简历亮点关键词
                  </Typography>
                  <Button
                    onClick={handlePolish}
                    startIcon={<AutoFixHighIcon />}
                    sx={{ textTransform: 'none' }}
                    color="secondary"
                    size="small"
                  >
                    不知道如何展示教育经历？试试开启简历亮点关键词
                  </Button>
                </Box>
                <TextField
                  label="在校经历（选填）"
                  value={currentEdu.experience}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, experience: e.target.value })}
                  placeholder="1. 在校担任职务...&#10;2. 获得荣誉奖项...&#10;3. 学习主修课程..."
                  multiline
                  rows={5}
                  fullWidth
                  helperText={`${currentEdu.experience?.length || 0}/3000`}
                />
              </Box>
              <TextField
                label="论文/毕业设计（选填）"
                value={currentEdu.thesis}
                onChange={(e) => setCurrentEdu({ ...currentEdu, thesis: e.target.value })}
                placeholder="请输入"
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              <TextField
                label="论文/毕业设计描述（选填）"
                value={currentEdu.thesisDescription}
                onChange={(e) => setCurrentEdu({ ...currentEdu, thesisDescription: e.target.value })}
                placeholder="描述你的论文/毕业设计的主要内容，展示你的学术能力&#10;例如：&#10;1. 选题目的和意义...&#10;2. 摘要和关键词...&#10;3. 论文结论或成果"
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
                取消
              </Button>
              <Button
                onClick={handleAdd}
                variant="contained"
              >
                完成
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
              暂无教育经历，点击上方"添加"按钮创建
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
