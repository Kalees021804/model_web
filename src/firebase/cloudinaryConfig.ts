// Cloudinary configuration for image uploads
export const cloudinaryConfig = {
  cloudName: 'dnzuohvri', // 👈 Replace with your cloud name
  uploadPreset: 'acadifyx_projects', // 👈 The preset we just created
  apiKey: '726564294794514' // 👈 Replace with your API key
};

// Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', 'projects');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url; // Returns the image URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};