import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Upload, FileAudio, Trash2, Play, Pause, Sparkles, Zap, Clock, CheckCircle, AlertCircle, LogIn, User } from 'lucide-react';
import axios from 'axios';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { getCurrentUser, logoutUser, isAuthenticated } from './utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // Load user and transcriptions on component mount
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      try {
        // Clear any existing authentication data to ensure fresh start
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        
        // Initialize app without automatic sign-in
        // Users must manually sign in each time they open the app
        console.log('App initialized - user must sign in manually');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchTranscriptions = async () => {
    if (!isAuthenticated()) {
      setTranscriptions([]);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/transcriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setTranscriptions(response.data.data.transcriptions || []);
      }
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        handleLogout();
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAndTranscribe(audioBlob, 'recording.webm');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (error) {
      setError('Error accessing microphone. Please check permissions.');
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadAndTranscribe(file, file.name);
    }
  };

  const uploadAndTranscribe = async (audioFile, filename) => {
    if (!isAuthenticated()) {
      setError('Please sign in to transcribe audio files.');
      setShowAuthModal(true);
      return;
    }

    setIsTranscribing(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('audio', audioFile, filename);
      formData.append('source', filename.includes('recording') ? 'recording' : 'upload');

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_BASE_URL}/transcriptions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data.success) {
        setCurrentTranscription(response.data.data.transcription);
        setSuccess('Transcription completed successfully!');
        await fetchTranscriptions(); // Refresh the list
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        handleLogout();
      } else {
        setError(error.response?.data?.message || 'Error transcribing audio');
      }
      console.error('Transcription error:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const deleteTranscription = async (id) => {
    if (!isAuthenticated()) {
      setError('Please sign in to delete transcriptions.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${API_BASE_URL}/transcriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSuccess('Transcription deleted successfully!');
        await fetchTranscriptions();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        handleLogout();
      } else {
        setError(error.response?.data?.message || 'Error deleting transcription');
      }
      console.error('Delete error:', error);
    }
  };

  const handleAuth = async (authData) => {
    setUser(authData.user);
    setSuccess(`Welcome ${authData.user.name}! You're now signed in.`);
    
    // Fetch user's transcriptions after successful login
    await fetchTranscriptions();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setTranscriptions([]);
    setCurrentTranscription('');
    setSuccess('You have been signed out successfully.');
  };

  const handleDeleteAccount = async () => {
    try {
      await logoutUser(); // This will clear tokens
      setUser(null);
      setTranscriptions([]);
      setCurrentTranscription('');
      setSuccess('Your account has been deleted.');
    } catch (error) {
      console.error('Delete account error:', error);
      setError('Error deleting account');
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center animate-fade-in-scale">
          <div className="w-32 h-32 glass-card rounded-full flex items-center justify-center mb-8 mx-auto pulse-glow">
            <Sparkles className="w-16 h-16 text-white shimmer" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4 tracking-tight text-shadow">
            Speech-to-Text
          </h1>
          <p className="text-xl text-white/80 mb-8">Loading your professional experience...</p>
          <div className="animate-spin-slow rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Professional animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 floating-animation" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400/8 rounded-full mix-blend-multiply filter blur-2xl opacity-40 floating-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-400/8 rounded-full mix-blend-multiply filter blur-3xl opacity-50 floating-animation" style={{animationDelay: '3s'}}></div>
        
        {/* Professional grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8 animate-slide-in-up">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white text-shadow">Speech-to-Text</h1>
              <p className="text-white/80 text-sm">Professional Audio Transcription</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfile 
                user={user} 
                onLogout={handleLogout} 
                onDeleteAccount={handleDeleteAccount}
                onUserUpdate={handleUserUpdate}
              />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16 animate-slide-in-up animate-delay-200">
          <h1 className="text-7xl font-black text-white mb-6 tracking-tight text-shadow">
            Speech-to-Text
            <span className="block text-5xl gradient-text mt-3 animate-pulse-slow">Converter</span>
      </h1>
          <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium text-shadow">
            Transform your voice into text with professional-grade technology. 
            Record live or upload audio files for instant transcription.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Upload Section */}
          <div className="glass-effect rounded-3xl p-10 mb-12 shadow-2xl hover-lift animate-slide-in-up animate-delay-300">
            <div className="flex items-center mb-10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-black gradient-text">Upload & Record</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10">
              {/* File Upload */}
              <div className="space-y-8 animate-slide-in-left animate-delay-500">
                <h3 className="text-2xl font-bold text-gray-200 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  Upload Audio File
                </h3>
                <div className="relative group">
                  <div className="gradient-border p-2 rounded-3xl">
                    <div className="border-2 border-dashed border-gray-500/50 rounded-3xl p-10 text-center hover:border-cyan-400/50 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-cyan-900/20 group-hover:to-blue-900/20 backdrop-blur-sm">
                      <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <Upload className="w-12 h-12 text-white" />
                      </div>
              <p className="text-gray-200 mb-6 text-xl font-semibold">Choose an audio file to transcribe</p>
              <p className="text-sm text-gray-400 mb-8 font-medium">Supports WAV, MP3, OGG, WebM formats</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary text-xl px-10 py-5"
                      >
                        Select File
      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Recording */}
              <div className="space-y-8 animate-slide-in-right animate-delay-700">
                <h3 className="text-2xl font-bold text-gray-200 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  Record Live Audio
                </h3>
                <div className="text-center">
                  <div className="relative">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing}
                      className={`relative w-40 h-40 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                        isRecording
                          ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 shadow-2xl pulse-glow'
                          : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 shadow-2xl hover:shadow-3xl neon-glow'
                      } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isRecording ? <MicOff size={56} /> : <Mic size={56} />}
                      {isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping"></div>
                      )}
                      {!isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse"></div>
                      )}
      </button>
                  </div>
                <p className="mt-8 text-gray-200 text-xl font-bold">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
                <p className="text-sm text-gray-400 mt-3 font-medium">
                  {isRecording ? 'Speak clearly into your microphone' : 'Make sure your microphone is enabled'}
                </p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-10 p-8 bg-gradient-to-r from-red-900/20 to-pink-900/20 border-l-4 border-red-500 rounded-2xl flex items-center shadow-lg">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4 pulse-glow">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                        <p className="text-red-300 font-bold text-lg">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-10 p-8 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-l-4 border-green-500 rounded-2xl flex items-center shadow-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 pulse-glow">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                        <p className="text-green-300 font-bold text-lg">{success}</p>
              </div>
            )}
          </div>

          {/* Current Transcription */}
          {currentTranscription && (
            <div className="glass-effect rounded-3xl p-10 mb-12 shadow-2xl hover-lift">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black gradient-text">Transcription Result</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-3xl p-8 border border-gray-600/30 backdrop-blur-sm shadow-xl">
                        <p className="text-gray-200 leading-relaxed text-xl font-medium">{currentTranscription}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isTranscribing && (
            <div className="glass-effect rounded-3xl p-10 mb-12 shadow-2xl">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="animate-spin-slow rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
                  </div>
                </div>
                        <span className="ml-6 text-gray-300 text-2xl font-bold">Processing audio transcription...</span>
              </div>
            </div>
          )}

          {/* Transcription History */}
          <div className="glass-effect rounded-3xl p-10 shadow-2xl hover-lift">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
                  <FileAudio className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black gradient-text">Transcription History</h2>
              </div>
                      <div className="flex items-center text-gray-300 bg-gray-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-6 h-6 mr-2" />
                <span className="font-bold text-lg">{transcriptions.length} transcriptions</span>
              </div>
            </div>
            
            {transcriptions.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center floating-animation">
                  <FileAudio className="w-16 h-16 text-gray-400" />
                </div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-4">No transcriptions yet</h3>
                        <p className="text-gray-400 text-lg">Upload or record some audio to get started!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {transcriptions.map((transcription, index) => (
                  <div key={transcription._id} className="bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 hover:bg-gray-800/90 transition-all duration-500 border border-gray-600/30 hover:shadow-2xl hover-lift">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-lg mr-6 pulse-glow">
                          {index + 1}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-200 text-xl">{transcription.originalName}</h3>
                            <p className="text-gray-400 text-sm flex items-center font-medium">
                            <Clock className="w-5 h-5 mr-2" />
                            {new Date(transcription.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTranscription(transcription._id)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                            <div className="bg-gradient-to-br from-gray-700/90 to-gray-600/90 rounded-2xl p-6 mb-6 border border-gray-500/30">
                              <p className="text-gray-200 leading-relaxed text-lg font-medium">{transcription.transcription}</p>
                            </div>
                    {transcription.confidence && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-400 font-medium">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 pulse-glow"></div>
                          Confidence: {(transcription.confidence * 100).toFixed(1)}%
                        </div>
                                <div className="text-xs text-gray-400 font-bold bg-gray-700/50 px-3 py-1 rounded-full">
                                  Auto Generated
                                </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-white/80 animate-slide-in-up animate-delay-1000">
          <div className="glass-card p-6 rounded-2xl max-w-md mx-auto">
            <p className="text-lg font-bold gradient-text">Professional Audio Processing • Built with React & Node.js</p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}

export default App;

