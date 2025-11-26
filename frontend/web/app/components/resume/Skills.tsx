'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { ResumeData } from '@/app/lib/types';
import AIPolishDialog from '@/app/components/AIPolishDialog';

interface SkillsProps {
  formData: ResumeData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function Skills({ formData, setFormData }: SkillsProps) {
  const [polishDialogOpen, setPolishDialogOpen] = useState(false);

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value,
    }));
  };

  const handlePolish = () => {
    setPolishDialogOpen(true);
  };

  const handleApplyPolished = (polishedText: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: polishedText,
    }));
  };

  return (
    <Box>
      {/* Header with AI Polish Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          ⭐ Personal Strengths
        </Typography>
        <Button
          variant="contained"
          startIcon={<AutoFixHighIcon />}
          onClick={handlePolish}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8c 100%)',
            },
            textTransform: 'none',
          }}
        >
          AI Polish
        </Button>
      </Box>

      {/* Skills Input */}
      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Personal Skills & Strengths Description
        </Typography>
        <TextField
          multiline
          rows={12}
          fullWidth
          value={formData.skills}
          onChange={handleSkillsChange}
          placeholder="Describe your professional skills, work experience, personal strengths, etc...

For example:
• 5+ years Web3 development experience, familiar with Solana/Ethereum ecosystem
• Proficient in React, TypeScript, experienced in large-scale frontend architecture
• Good coding standards and teamwork skills"
          inputProps={{ maxLength: 1000 }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Highlight your core competencies, use bullet points for clear skill presentation
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formData.skills.length} / 1000
          </Typography>
        </Box>
      </Box>

      {/* AI Polish Dialog */}
      <AIPolishDialog
        open={polishDialogOpen}
        onClose={() => setPolishDialogOpen(false)}
        initialText={formData.skills}
        sectionType="skills"
        onApply={handleApplyPolished}
      />
    </Box>
  );
}
