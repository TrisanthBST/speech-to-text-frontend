# Speech-to-Text Frontend

A modern, responsive React frontend for speech-to-text transcription with beautiful UI and seamless user experience.

## 🚀 Features

- **🎤 Live Recording**: Record audio directly in the browser
- **📁 File Upload**: Support for various audio formats (WAV, MP3, OGG, WebM)
- **🔐 User Authentication**: Secure login and registration system
- **👤 Profile Management**: User profiles with bio and preferences
- **🔑 Password Management**: Secure password change functionality
- **📊 Transcription History**: View and manage personal transcription history
- **🎨 Modern UI**: Beautiful glass-morphism design with smooth animations
- **📱 Responsive**: Optimized for desktop and mobile devices

## 🛠 Technology Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see [speech-to-text-backend](https://github.com/yourusername/speech-to-text-backend))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/speech-to-text-frontend.git
cd speech-to-text-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**

The app is configured to connect to `http://localhost:5000` by default. If your backend runs on a different URL, update the `API_BASE_URL` in `src/utils/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || \"http://localhost:5000/api\";
```

Or create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## 🎯 Usage

### Getting Started

1. **Sign Up**: Create a new account with your name, email, and password
2. **Sign In**: Log in with your credentials
3. **Record Audio**: Click the microphone button to start/stop recording
4. **Upload Files**: Use the file upload area to select audio files
5. **View Results**: See transcription results appear in real-time
6. **Manage History**: View, delete, and organize your transcription history

### Supported Audio Formats

- **WAV** - Uncompressed audio (best quality)
- **MP3** - Compressed audio (good balance)
- **OGG** - Open source format
- **WebM** - Web-optimized format

### File Size Limits

- Maximum file size: **10MB**
- For best results, use clear, high-quality audio recordings

## 🎨 UI Components

### Main Components

- **App.jsx** - Main application component with routing and state management
- **AuthModal.jsx** - Login and registration modal
- **UserProfile.jsx** - User profile management dropdown
- **ChangePassword.jsx** - Secure password change interface

### Key Features

- **Glass Morphism Design** - Modern, translucent UI elements
- **Smooth Animations** - CSS transitions and transforms
- **Responsive Layout** - Mobile-first design approach
- **Accessibility** - Keyboard navigation and screen reader support

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Speech-to-Text
VITE_APP_VERSION=1.0.0
```

### Customization

#### Theme Colors
Update colors in `src/index.css` under the CSS custom properties:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
}
```

#### API Endpoints
Modify API endpoints in `src/utils/api.js`:

```javascript
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Add custom configuration
  }
}
```

## 📁 Project Structure

```
speech-to-text-frontend/
├── public/
│   ├── index.html           # HTML template
│   └── favicon.ico          # App icon
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx    # Authentication modal
│   │   ├── UserProfile.jsx  # User profile dropdown
│   │   └── ChangePassword.jsx # Password change form
│   ├── utils/
│   │   ├── api.js           # API client and methods
│   │   └── auth.js          # Authentication utilities
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🚀 Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deployment Options

#### Vercel (Recommended for Full-Stack)
1. **Deploy Backend First**:
   - Deploy your backend repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Get your backend URL: `https://your-backend-app.vercel.app`

2. **Deploy Frontend**:
   - Connect your frontend GitHub repository to Vercel
   - Vercel will automatically detect Vite configuration
   - Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-app.vercel.app/api
   ```
   - Deploy automatically on every push to main branch

3. **Single-Domain Option**:
   - For single domain deployment, deploy as a monorepo
   - Frontend serves as static files, backend as API routes
   - All under one Vercel domain: `https://your-app.vercel.app`

#### Alternative: Netlify
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard:
   ```
   VITE_API_URL=https://your-backend-app.vercel.app/api
   ```
4. Configure redirects for SPA: Create `_redirects` file in `public/` with:
   ```
   /*    /index.html   200
   ```

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your web server
3. Configure your server to serve `index.html` for all routes

## 🔐 Security Features

- **JWT Token Management** - Automatic token refresh and secure storage
- **Input Validation** - Client-side form validation
- **XSS Protection** - Sanitized user inputs
- **HTTPS Ready** - Secure communication with backend
- **Session Management** - Automatic logout on token expiration

## 🎨 Styling and Theming

### Tailwind CSS Classes

The project uses custom utility classes:

- `.glass-effect` - Glass morphism background
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.gradient-text` - Gradient text effect
- `.animate-*` - Custom animations

### Custom Animations

Defined in `src/index.css`:
- `floating` - Gentle floating animation
- `pulseGlow` - Pulsing glow effect
- `shimmer` - Shimmer loading effect
- `gradientText` - Animated gradient text

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for new components (optional)
- Maintain responsive design principles
- Add proper error handling and loading states
- Write tests for critical functionality

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Required Browser Features

- **MediaRecorder API** - For audio recording
- **File API** - For file uploads
- **Fetch API** - For HTTP requests
- **LocalStorage** - For token persistence

## 🆘 Troubleshooting

### Common Issues

1. **Microphone not working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify MediaRecorder API support

2. **API connection failed**
   - Verify backend is running
   - Check CORS configuration
   - Confirm API URL in environment variables

3. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode

Set `NODE_ENV=development` to enable:
- Detailed error messages
- React development tools
- Hot module replacement

## 🔗 Related Projects

- [Speech-to-Text Backend](https://github.com/yourusername/speech-to-text-backend) - Node.js API server

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Vite** - For the fast build tool

---

**Built with ❤️ for seamless speech-to-text experiences**