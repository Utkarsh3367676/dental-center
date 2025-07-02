import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction, 
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

/**
 * File Upload component for dental appointments and treatments
 * Allows uploading files and displays a preview list
 */
const FileUpload = ({ files = [], onFileAdded, onFileRemoved, maxSizeMB = 5 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      setLoading(false);
      return;
    }

    // Read the file as base64
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const newFile = {
        name: file.name,
        type: file.type,
        data: reader.result,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      
      onFileAdded(newFile);
      setLoading(false);
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Get appropriate icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <PictureAsPdfIcon color="error" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="action" />;
    }
  };

  return (
    <Box my={2}>
      <input
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
        style={{ display: 'none' }}
        id="file-upload-button"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload-button">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload File'}
        </Button>
      </label>
      
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      
      {files.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, maxHeight: '200px', overflow: 'auto' }}>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={`${file.name}-${index}`}>
                <ListItemIcon>
                  {getFileIcon(file.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={`Uploaded: ${file.uploadedAt}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => onFileRemoved(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;
