import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Copy images from client/public to server/uploads directory
 */
const copyImages = () => {
  try {
    // Source directories
    const clientPublicDir = path.join(__dirname, '../../../client/public');
    const clientCrmPublicDir = path.join(__dirname, '../../../crm-client/public');
    
    // Destination directory
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Created uploads directory: ${uploadsDir}`);
    }
    
    // Copy images from client/public
    if (fs.existsSync(clientPublicDir)) {
      const files = fs.readdirSync(clientPublicDir);
      
      // Filter image files
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      });
      
      // Copy each image file
      imageFiles.forEach(file => {
        const sourcePath = path.join(clientPublicDir, file);
        const destPath = path.join(uploadsDir, file);
        
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file}`);
      });
      
      console.log(`Copied ${imageFiles.length} images from client/public`);
    } else {
      console.log('Client public directory not found');
    }
    
    // Copy images from client-crm/public
    if (fs.existsSync(clientCrmPublicDir)) {
      const files = fs.readdirSync(clientCrmPublicDir);
      
      // Filter image files
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      });
      
      // Copy each image file
      imageFiles.forEach(file => {
        const sourcePath = path.join(clientCrmPublicDir, file);
        const destPath = path.join(uploadsDir, file);
        
        // Don't overwrite if file already exists
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied: ${file}`);
        } else {
          console.log(`Skipped (already exists): ${file}`);
        }
      });
      
      console.log(`Copied images from client-crm/public`);
    } else {
      console.log('Client-CRM public directory not found');
    }
    
    console.log('Image copying completed successfully!');
  } catch (error) {
    console.error('Error copying images:', error);
  }
};

// Run the copy function
copyImages();
