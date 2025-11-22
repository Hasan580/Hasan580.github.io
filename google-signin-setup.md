# Google Sign-In Setup Guide for 3D Hub

This guide will help you implement Google Sign-In authentication for your website.

## Option 1: Firebase Authentication (Recommended for Beginners)

Firebase is the easiest way to implement Google Sign-In. It handles all the OAuth complexity for you.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: "3D Hub" (or your preferred name)
4. Follow the setup wizard (you can disable Google Analytics if you want)

### Step 2: Enable Google Sign-In

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Enable it and add your support email
4. Click **Save**

### Step 3: Register Your Web App

1. In Firebase Console, click the **Settings** gear icon → **Project settings**
2. Scroll down and click the **Web** icon (`</>`)
3. Register your app with a nickname (e.g., "3D Hub Web")
4. Copy the Firebase configuration (you'll need this)

The config will look like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 4: Update login.html

Add Firebase SDK before the closing `</body>` tag in `login.html`:

```html
<!-- Firebase SDK -->
<script type="module">
  // Import Firebase
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Google Sign-In Function
  window.signInWithGoogle = function() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User signed in successfully
        const user = result.user;
        
        // Save user info to localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhoto', user.photoURL);
        
        // Show success message
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
        
        // Redirect to main page after 1 second
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      })
      .catch((error) => {
        console.error('Error during sign in:', error);
        showNotification('خطأ في تسجيل الدخول: ' + error.message, 'error');
      });
  };
</script>
```

### Step 5: Update Google Button

Find the Google button in `login.html` and update it:

```html
<button onclick="signInWithGoogle()" type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
    <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span class="font-medium">تسجيل الدخول بواسطة Google</span>
</button>
```

---

## Option 2: Google OAuth 2.0 (More Control)

If you want more control without Firebase:

### Step 1: Create OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost` (for testing)
   - `https://yourdomain.com` (your actual domain)
7. Add authorized redirect URIs:
   - `http://localhost/login.html`
   - `https://yourdomain.com/login.html`
8. Copy your **Client ID**

### Step 2: Add Google Identity Services

Add this to `login.html` in the `<head>` section:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 3: Add Sign-In Button

Replace your Google button with:

```html
<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID.apps.googleusercontent.com"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>
```

### Step 4: Add JavaScript Handler

```javascript
function handleCredentialResponse(response) {
  // Decode the JWT token
  const responsePayload = parseJwt(response.credential);
  
  // Save user info
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userName', responsePayload.name);
  localStorage.setItem('userEmail', responsePayload.email);
  localStorage.setItem('userPhoto', responsePayload.picture);
  
  // Redirect to main page
  window.location.href = 'index.html';
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
```

---

## Testing

1. Open your website in a browser
2. Click the Google Sign-In button
3. Select your Google account
4. Grant permissions
5. You should be redirected to the main page with your name displayed

## Important Notes

- **Localhost Testing**: Google Sign-In works on localhost for testing
- **HTTPS Required**: For production, your site MUST use HTTPS
- **Domain Verification**: Add your domain in Firebase/Google Cloud Console
- **Session Management**: Currently using localStorage (consider JWT tokens for production)

## Troubleshooting

### "Popup blocked" error
- Enable popups for your site in browser settings

### "Origin not allowed" error
- Add your domain to authorized origins in Firebase/Google Cloud Console

### "Invalid client ID" error
- Double-check your Client ID is correct
- Make sure the project is properly configured

---

## Next Steps (Production)

For a production-ready implementation:

1. **Backend Verification**: Verify the Google token on your server
2. **Secure Sessions**: Use JWT tokens instead of localStorage
3. **User Database**: Store user data in a proper database
4. **HTTPS**: Deploy with SSL certificate
5. **Privacy Policy**: Add privacy policy page (required by Google)

## Cost

- Firebase Authentication: **FREE** for up to 10,000 monthly active users
- After 10,000 users: Check [Firebase Pricing](https://firebase.google.com/pricing)

---

Need help? Check:
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Identity Services Docs](https://developers.google.com/identity/gsi/web)
