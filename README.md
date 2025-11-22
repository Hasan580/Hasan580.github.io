# متجر الطباعة ثلاثية الأبعاد | 3D Printing Store

A beautiful, modern e-commerce website for selling 3D printed products with bilingual support (Arabic/English).

## ✨ Features

- 🤖 **AI Image-to-3D Converter**: Upload any image and convert it to a 3D printable model using AI! ⭐ NEW
- 🌐 **Bilingual Support**: Full Arabic and English interface with RTL/LTR support
- 🛒 **Shopping Cart**: Add, remove, and manage products with quantities
- 💳 **Checkout System**: Complete order form with customer information
- 📧 **Order Notifications**: Automatic email sending to receive orders
- 🎨 **Modern Design**: Beautiful animations and responsive layout using Tailwind CSS
- 📱 **Mobile Friendly**: Fully responsive design for all devices
- 🎯 **Category Filtering**: Filter products by categories (Figures, Accessories, Decorations)
- 💾 **Local Storage**: Cart data persists across browser sessions
- 🎭 **Smooth Animations**: Professional animations and transitions
- 🎨 **Custom Orders**: Create custom 3D models from your images and order prints

## 🎨 Design Features

- Custom color scheme extracted from your logo
- Floating logo animation
- Product hover effects with scale and shadow
- Smooth cart sidebar with slide animations
- Category filter buttons with active states
- Success modal with animated icons
- Custom scrollbar styling
- Notification toasts for user feedback

## 📁 Files Structure

```
zain website/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS with animations
├── script.js           # JavaScript functionality
├── IMG_1778.PNG        # Your logo image
├── README.md           # This file
└── AI_SETUP_GUIDE.md   # AI converter setup instructions
```

## 🚀 Getting Started

### Method 1: Open Directly

1. Simply open `index.html` in any modern web browser
2. The website will work immediately with all features

### Method 2: Local Server (Recommended)

For better performance and testing:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🤖 AI Image-to-3D Feature

The website now includes an **AI-powered image-to-3D converter**!

### How it Works (Demo Mode - No Setup Required):

1. Scroll to "Can't Find What You Love?" section
2. Upload or drag-and-drop any image (JPG, PNG, WEBP)
3. Select model type (Figure, Relief, Lithophane, Keychain)
4. Set desired size (1-30 cm)
5. Click "Convert to 3D Model"
6. Watch AI process your image (simulated in demo)
7. Download STL file or add to cart for printing

### Features:

- ✨ Drag & drop image upload
- 🎨 Multiple model types
- 📏 Adjustable size
- 💾 Download STL files
- 🛒 Add custom models to cart
- 📱 Fully responsive
- 🌐 Bilingual support

### Production Setup (Real AI):

To enable **real AI conversion** with services like Meshy AI, Kaedim3D, or CSM:

**See `AI_SETUP_GUIDE.md` for detailed instructions!**

Quick setup:
1. Sign up for an AI service (e.g., https://www.meshy.ai/)
2. Get your API key
3. Update `script.js` lines 13-14:
```javascript
aiApiKey: 'YOUR_API_KEY_HERE',
aiApiEndpoint: 'https://api.meshy.ai/v1/image-to-3d'
```

## 📧 Email Configuration

The website is configured to send orders via email. There are two methods:

### Option 1: Mailto (Default - No Setup Required)

The website uses `mailto:` links which open the user's default email client with order details pre-filled. This works immediately without any setup.

**To change the recipient email:**

1. Open `script.js`
2. Find line 8-9:
```javascript
yourEmail: 'your-email@example.com'
```
3. Replace with your actual email address

### Option 2: EmailJS (Advanced - Automatic Sending)

For automatic email sending without opening email client:

1. Sign up for free at [EmailJS.com](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{customer_name}}`
   - `{{customer_phone}}`
   - `{{customer_email}}`
   - `{{customer_address}}`
   - `{{order_items}}`
   - `{{total_amount}}`
   - `{{order_date}}`

4. Update `script.js` configuration (lines 4-6):
```javascript
emailServiceId: 'YOUR_SERVICE_ID',      // From EmailJS dashboard
emailTemplateId: 'YOUR_TEMPLATE_ID',    // From EmailJS dashboard
emailUserId: 'YOUR_USER_ID',            // From EmailJS dashboard
```

5. Add EmailJS library to `index.html` (before closing `</body>`):
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

## 🛠 Customization

### Adding Products

Edit `script.js` and modify the `products` array (starting at line 16):

```javascript
{
    id: 13,
    nameAr: 'اسم المنتج بالعربي',
    nameEn: 'Product Name in English',
    descriptionAr: 'وصف المنتج بالعربي',
    descriptionEn: 'Product description in English',
    price: 100,
    image: 'https://your-image-url.com/image.jpg',
    category: 'figures' // or 'accessories' or 'decorations'
}
```

### Changing Colors

Edit `styles.css` and modify the CSS variables (lines 1-7):

```css
:root {
    --primary: #1a237e;      /* Deep Blue */
    --secondary: #3949ab;     /* Medium Blue */
    --accent: #ff6f00;        /* Orange */
    --accent-dark: #e65100;   /* Dark Orange */
}
```

### Adding Categories

1. Add category button in `index.html`:
```html
<button class="category-btn" data-category="new-category" 
        data-en="New Category" data-ar="فئة جديدة">فئة جديدة</button>
```

2. Add products with that category in `script.js`

## 🌐 Language Support

The website automatically switches between Arabic (RTL) and English (LTR):
- Language preference is saved in browser
- All UI elements are translated
- Direction changes automatically
- Font families switch appropriately (Cairo for Arabic, Poppins for English)

## 🛒 Shopping Flow

### Standard Products:
1. Browse products by category
2. Click "Add to Cart" on desired items
3. View cart and adjust quantities
4. Proceed to checkout
5. Fill customer information
6. Submit order (email sent)

### Custom AI-Generated Models:
1. Upload your image
2. Configure model type and size
3. AI converts to 3D model
4. Download STL file OR order print service
5. If ordering: model added to cart with custom pricing
6. Complete checkout as normal

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Animations

- `slideDown`: Header entrance
- `fadeIn`: Content appearance
- `float`: Logo animation
- `scaleIn`: Modal entrance
- `slideInRight`: Cart items
- `pulse`: Cart badge
- `shimmer`: Loading states

## 🔧 Browser Support

- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ Latest
- Opera: ✅ Latest
- Internet Explorer: ❌ Not supported

## 📝 To-Do (Optional Enhancements)

- [x] ~~AI image-to-3D converter~~ ✅ COMPLETED
- [ ] Add product search functionality
- [ ] Implement user reviews and ratings
- [ ] Add image gallery for products
- [ ] 3D model preview viewer (Three.js)
- [ ] Create admin panel for product management
- [ ] Integrate payment gateway (Stripe, PayPal)
- [ ] Add wish list feature
- [ ] Implement product comparison
- [ ] Add social media sharing
- [ ] Create order tracking system
- [ ] User accounts and order history
- [ ] Real-time chat support

## 🐛 Troubleshooting

### Cart doesn't persist
- Check if browser allows localStorage
- Clear browser cache and cookies
- Try in incognito/private mode

### Emails not sending
- Verify email address in script.js
- Check EmailJS configuration
- Ensure email client is installed (for mailto)
- Check browser console for errors

### Images not loading
- Check internet connection
- Verify image URLs are correct
- Use local images instead of URLs

### Language not switching
- Clear localStorage: `localStorage.clear()`
- Refresh the page
- Check browser console for errors

## 📄 License

Free to use for personal and commercial projects.

## 🤝 Support

For issues or questions, please check:
1. Browser console for error messages
2. Network tab for failed requests
3. localStorage for saved data

## 🎉 Credits

- Tailwind CSS for styling framework
- Font Awesome for icons
- Google Fonts for typography
- Unsplash for sample product images

---

**Built with ❤️ for 3D Printing enthusiasts**

**مصمم بحب لعشاق الطباعة ثلاثية الأبعاد**
