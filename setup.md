# Quick Setup Guide for Hackathon

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Google + Anonymous)
4. Create Firestore database
5. Copy your config to `src/firebase/config.js`

### 3. Start Development
```bash
npm run dev
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## 🔧 Firebase Setup Details

### Authentication
- Enable Google provider
- Enable Anonymous authentication
- Add your domain to authorized domains

### Firestore Collections
The app will automatically create these collections:
- `users` - User profiles and preferences
- `swapRequests` - Skill swap requests
- `feedback` - User feedback and ratings
- `announcements` - Admin announcements

### Security Rules
Use these basic rules for development:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🎯 Key Features to Demo

1. **User Registration** - Google login or guest access
2. **Profile Management** - Add skills and availability
3. **Skill Search** - Find users with matching skills
4. **Swap Requests** - Send and manage skill exchanges
5. **Admin Panel** - User management and announcements

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Firebase Hosting
```bash
npm run build
firebase init hosting
firebase deploy
```

## 📱 Mobile Responsive
The app is fully responsive and works on all devices!

## 🎨 Customization
- Colors: Edit `src/index.css` CSS variables
- Components: Modify files in `src/components/ui/`
- Styling: Use Tailwind classes throughout

## 🆘 Need Help?
- Check the browser console for errors
- Verify Firebase configuration
- Ensure all dependencies are installed
- Check network connectivity for Firebase

Good luck with your hackathon! 🎉 