import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { aiService, PolishRequest } from '@/app/services/ai.service';

interface AIPolishDialogProps {
  open: boolean;
  onClose: () => void;
  initialText: string;
  sectionType: PolishRequest['section_type'];
  onApply: (polishedText: string) => void;
}

export default function AIPolishDialog({
  open,
  onClose,
  initialText,
  sectionType,
  onApply,
}: AIPolishDialogProps) {
  const [isPolishing, setIsPolishing] = useState(false);
  const [originalText, setOriginalText] = useState(initialText);
  const [polishedText, setPolishedText] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handlePolish = async () => {
    if (!originalText.trim()) {
      setError('Please enter content to polish');
      return;
    }

    setIsPolishing(true);
    setError('');
    setPolishedText('');
    setImprovements([]);

    try {
      const result = await aiService.polishText({
        text: originalText,
        section_type: sectionType,
      });

      setPolishedText(result.polished);
      setImprovements(result.improvements);
    } catch (err) {
      console.error('AI润色失败:', err);
      setError(err instanceof Error ? err.message : 'AI润色失败，请稍后重试');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleApply = () => {
    if (polishedText) {
      onApply(polishedText);
      onClose();
    }
  };

  const handleReset = () => {
    setPolishedText('');
    setImprovements([]);
    setError('');
  };

  const getSectionName = () => {
    const names: Record<PolishRequest['section_type'], string> = {
      skills: 'Skills',
      work_experience: 'Work Experience',
      project: 'Project Experience',
      education: 'Education',
      general: 'Content',
    };
    return names[sectionType] || 'Content';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '600px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoFixHighIcon color="primary" />
          <Typography variant="h6">AI Polish - {getSectionName()}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* 原文输入 */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Original
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder={`Enter ${getSectionName().toLowerCase()} to polish...`}
              disabled={isPolishing}
            />
          </Box>

          {/* 润色按钮 */}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={isPolishing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
              onClick={handlePolish}
              disabled={isPolishing || !originalText.trim()}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minWidth: 200,
              }}
            >
              {isPolishing ? 'Polishing...' : 'Start Polish'}
            </Button>
          </Box>

          {/* 润色结果 */}
          {polishedText && (
            <>
              <Divider>
                <CompareArrowsIcon sx={{ color: 'text.secondary' }} />
              </Divider>

              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  Polished
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  value={polishedText}
                  onChange={(e) => setPolishedText(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: 'success.50',
                    },
                  }}
                />
              </Box>

              {/* 改进点 */}
              {improvements.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    <CheckCircleIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                    Improvements
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {improvements.map((improvement, index) => (
                      <Chip
                        key={index}
                        label={improvement}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        {polishedText && (
          <Button onClick={handleReset} color="secondary">
            Re-polish
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!polishedText}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
