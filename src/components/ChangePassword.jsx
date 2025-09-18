import { useState } from 'react';
import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { changePassword } from '../utils/auth';

const ChangePassword = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    
    if (formData.newPassword === formData.currentPassword) {
      setError('New password must be different from current password');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess('Password changed successfully! You will be signed out for security.');
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Notify parent component of success
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { level: 0, text: 'Too short', color: 'text-red-400' };
    if (password.length < 8) return { level: 1, text: 'Weak', color: 'text-orange-400' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { level: 2, text: 'Medium', color: 'text-yellow-400' };
    return { level: 3, text: 'Strong', color: 'text-green-400' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl p-8 w-full max-w-md mx-auto animate-bounce-in border border-gray-600/40">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6 text-gray-300" />
          </button>
          <div>
            <h2 className="text-3xl font-black gradient-text">Change Password</h2>
            <p className="text-gray-300 text-sm">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="animate-slide-in-left">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="input-field pl-12 pr-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="animate-slide-in-left animate-delay-100">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="input-field pl-12 pr-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password strength:</span>
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.level === 0 ? 'bg-red-500 w-1/4' :
                      passwordStrength.level === 1 ? 'bg-orange-500 w-2/4' :
                      passwordStrength.level === 2 ? 'bg-yellow-500 w-3/4' :
                      'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="mt-2 text-xs text-gray-400">
              <p>Password must be at least 6 characters long</p>
              <p>For better security, use uppercase, lowercase, and numbers</p>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="animate-slide-in-left animate-delay-200">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-field pl-12 pr-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-slide-in-up bg-red-900/30 border border-red-500/40 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="animate-slide-in-up bg-green-900/30 border border-green-500/40 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 font-medium text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 animate-slide-in-up animate-delay-500"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl animate-slide-in-up animate-delay-700">
          <p className="text-blue-300 text-sm text-center">
            <strong>Security Notice:</strong> After changing your password, you will be signed out from all devices for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;