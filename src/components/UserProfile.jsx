import { useState, useEffect } from 'react';
import { User, LogOut, Settings, Trash2, ChevronDown, Edit3, Key, Save, X } from 'lucide-react';
import { updateProfile } from '../utils/auth';
import ChangePassword from './ChangePassword';

const UserProfile = ({ user: initialUser, onLogout, onDeleteAccount, onUserUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || '',
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData({
        name: initialUser.name || '',
        bio: initialUser.profile?.bio || '',
      });
    }
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateProfile(formData);
      
      if (response.success) {
        setUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        onUserUpdate?.(response.data.user);
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all transcriptions.')) {
      onDeleteAccount();
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePasswordSuccess = () => {
    setShowChangePassword(false);
    setSuccess('Password changed successfully! You will be signed out shortly.');
    // Sign out user after password change for security
    setTimeout(() => {
      onLogout();
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl px-4 py-3 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-500 hover:scale-105 border border-gray-700/40 animate-pulse hover:shadow-lg hover:shadow-purple-500/20"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-float">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="text-white font-bold text-sm">{user.name}</p>
          <p className="text-white/70 text-xs">{user.email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl animate-slide-up z-50 border border-gray-700/40 hover:border-purple-500/40 transition-all duration-300">
          {/* Profile Info Section */}
          <div className="p-4 bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 rounded-xl mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Edit Profile Section */}
          {activeTab === 'profile' && (
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-xl p-4 mb-4 border border-gray-700/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </h4>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Bio</label>
                    <p className="text-white">{user.profile?.bio || 'No bio added yet'}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Display Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 bg-gray-700/30 rounded-lg border border-gray-600 text-gray-400 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || '',
                          bio: user.profile?.bio || '',
                        });
                        setError('');
                        setSuccess('');
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-1">
            <div 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === 'profile' ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-white/10'
              }`}
            >
              <Edit3 className="w-5 h-5 text-gray-300" />
              <span className="text-gray-200 font-medium">Edit Profile</span>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 my-3"></div>
          
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-900/20 transition-all duration-300 cursor-pointer w-full text-left"
          >
            <Key className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Change Password</span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-900/20 transition-all duration-300 cursor-pointer w-full text-left"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-red-400 font-medium">Delete Account</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer w-full text-left"
          >
            <LogOut className="w-5 h-5 text-gray-300" />
            <span className="text-gray-200 font-medium">Sign Out</span>
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in-scale">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 animate-bounce-in border border-gray-700/40 hover:border-red-500/40 transition-all duration-300 shadow-2xl shadow-red-500/10">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Delete Account</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This will permanently remove all your transcriptions and data. This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex-1"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="fixed inset-0 z-50">
          <ChangePassword 
            onBack={() => setShowChangePassword(false)}
            onSuccess={handleChangePasswordSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;

