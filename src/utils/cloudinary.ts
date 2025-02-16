import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: 'drycdsvxy', 
  api_key: '154158246336375', 
  api_secret: 'k2oExvGgn7neMnMCaZwH24mjV1g'
});

// Function to upload base64 image
const uploadBase64Image = async (base64String: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to cloudinary:', error);
    throw error;
  }
};

// Function to get filename for base64 image
export const getFileNameFromBase64 = async (base64String: string): Promise<string> => {
  try {
    const uploadedUrl = await uploadBase64Image(base64String);
    return uploadedUrl;
  } catch (error) {
    console.error('Error getting filename:', error);
    throw error;
  }
};