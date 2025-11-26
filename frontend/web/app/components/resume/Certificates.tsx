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
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { Certificate as CertificateType } from '@/app/lib/types/resume.types';
import DatePicker from '../shared/DatePicker';

interface CertificatesProps {
  data: CertificateType[];
  onChange: (certificates: CertificateType[]) => void;
}

export default function Certificates({ data, onChange }: CertificatesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [currentCert, setCurrentCert] = useState<CertificateType>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    noExpiry: false,
    certificateNo: '',
    description: '',
  });

  const handleAdd = () => {
    onChange([...data, currentCert]);
    setCurrentCert({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      noExpiry: false,
      certificateNo: '',
      description: '',
    });
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          证书
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

      {/* Certificates List */}
      {data.map((cert, index) => (
        <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CardMembershipIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.issuer} | 颁发时间：{cert.issueDate}
                  </Typography>
                  {cert.certificateNo && (
                    <Typography variant="body2" color="text.secondary">
                      证书编号：{cert.certificateNo}
                    </Typography>
                  )}
                  {!cert.noExpiry && cert.expiryDate && (
                    <Typography variant="body2" color="text.secondary">
                      有效期至：{cert.expiryDate}
                    </Typography>
                  )}
                </Box>
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
            {cert.description && (
              <Typography variant="body2" sx={{ mt: 2, ml: 7, whiteSpace: 'pre-line' }}>
                {cert.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card sx={{ border: 2, borderColor: 'primary.main', bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              编辑证书
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                label="证书名称"
                value={currentCert.name}
                onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })}
                placeholder="软件设计师"
                fullWidth
              />
              <TextField
                label="颁发机构"
                value={currentCert.issuer}
                onChange={(e) => setCurrentCert({ ...currentCert, issuer: e.target.value })}
                placeholder="中国计算机技术职业资格网"
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  颁发时间
                </Typography>
                <DatePicker
                  value={currentCert.issueDate}
                  onChange={(value) => setCurrentCert({ ...currentCert, issueDate: value })}
                  views={['year', 'month']}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  有效期至
                </Typography>
                <DatePicker
                  value={currentCert.expiryDate || ''}
                  onChange={(value) => setCurrentCert({ ...currentCert, expiryDate: value })}
                  disabled={currentCert.noExpiry}
                  views={['year', 'month']}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentCert.noExpiry}
                      onChange={(e) => setCurrentCert({ ...currentCert, noExpiry: e.target.checked, expiryDate: '' })}
                      size="small"
                    />
                  }
                  label="长期有效"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  label="证书编号（选填）"
                  value={currentCert.certificateNo}
                  onChange={(e) => setCurrentCert({ ...currentCert, certificateNo: e.target.value })}
                  placeholder="123456789"
                  fullWidth
                />
              </Box>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  label="证书描述（选填）"
                  multiline
                  rows={4}
                  value={currentCert.description}
                  onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
                  placeholder="简要描述证书的价值与难度"
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {currentCert.description?.length || 0}/500
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
            <CardMembershipIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              暂无证书，点击上方&quot;添加&quot;按钮创建
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
