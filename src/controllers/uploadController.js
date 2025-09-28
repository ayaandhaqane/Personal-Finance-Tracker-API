import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

// Upload profile picture

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'finance-tracker/profile-pictures',
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image'
          });
        }

        try {
          // Update user profile picture
          const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: result.secure_url },
            { new: true }
          ).select('-password');

          res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {
              profilePicture: result.secure_url,
              user: user
            }
          });
        } catch (updateError) {
          console.error('Database update error:', updateError);
          res.status(500).json({
            success: false,
            message: 'Failed to update profile picture'
          });
        }
      }
    );

    // Send the buffer to Cloudinary
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'finance-tracker/profile-pictures',
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image'
          });
        }

        try {
          // Update user profile picture
          const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: result.secure_url },
            { new: true }
          ).select('-password');

          res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {
              profilePicture: result.secure_url,
              user: user
            }
          });
        } catch (updateError) {
          console.error('Database update error:', updateError);
          res.status(500).json({
            success: false,
            message: 'Failed to update profile picture'
          });
        }
      }
    ).end(req.file.buffer);

  } catch (error) {
    next(error);
  }
};

export {
  uploadProfilePicture
};

