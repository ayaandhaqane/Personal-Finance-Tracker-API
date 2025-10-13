import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function ProfileSection({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

function EditableField({ label, value, type = 'text', onSave, placeholder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="form-input flex-1"
              placeholder={placeholder}
            />
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-900">{value || 'Not set'}</p>
        )}
      </div>
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-primary-color"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { changePassword } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        setMessage('Password changed successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            Updating Password...
          </>
        ) : (
          'Update Password'
        )}
      </button>
    </form>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (field, value) => {
    try {
      const result = await updateProfile({ [field]: value });
      
      if (result.success) {
        setMessage('Profile updated successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="px-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Profile Information */}
      <ProfileSection title="Profile Information">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-primary-color rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {user?.name || 'User Name'}
            </h4>
            <p className="text-gray-500">
              {user?.email || 'user@example.com'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <EditableField
          label="Full Name"
          value={user?.name}
          onSave={(value) => handleUpdateProfile('name', value)}
          placeholder="Enter your full name"
        />

        <EditableField
          label="Email Address"
          value={user?.email}
          type="email"
          onSave={(value) => handleUpdateProfile('email', value)}
          placeholder="Enter your email address"
        />
      </ProfileSection>

      {/* Security Settings */}
      <ProfileSection title="Security Settings">
        <PasswordChangeForm />
      </ProfileSection>

      {/* Account Preferences */}
      <ProfileSection title="Account Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Monthly Reports</h4>
              <p className="text-sm text-gray-500">Get monthly financial summary reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Dark Mode</h4>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>
        </div>
      </ProfileSection>

      {/* Account Actions */}
      <ProfileSection title="Account Actions">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Export Data</h4>
              <p className="text-sm text-gray-500">Download your transaction data as CSV</p>
            </div>
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </ProfileSection>
    </div>
  );
}
