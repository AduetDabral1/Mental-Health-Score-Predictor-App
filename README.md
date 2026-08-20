# 🧠 Mental Health Predictor - AI-Powered Web Application

A modern, futuristic web application for mental health prediction powered by machine learning. Features animated 3D visuals, smooth interactions, and beautiful UI design.

## 📋 Project Structure

```
├── index.html          # Main HTML file with form and modals
├── style.css           # Complete styling with animations
├── script.js           # Vanilla JavaScript for interactivity
├── Mental_Health_Model.pkl  # Trained ML model (pickle file)
└── main.py            # FastAPI backend (provided)
```

## 🎨 Design Features

### Visual Elements
- **Animated Background**: Floating particles and moving dots create depth
- **Humanoid Face**: Central 3D animated face with glowing eyes
- **Gradient Waves**: Smooth flowing waves with multiple gradient colors
- **Floating Orbs**: 3D spheres with parallax animations
- **Glow Effects**: Subtle pulsing and glowing elements throughout

### Color Palette
- **Muted Dark Purple**: `#2d1f3c`, `#3a2f4e`
- **Coral/Pink**: `#ff6b6b`, `#ff8787`
- **Sage Green**: `#7fb3a0`, `#a8d5ba`
- **Cream**: `#f5e6d3`, `#fef5e7`
- **Gradients**: Sunset and soft color transitions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- FastAPI
- Joblib
- Pandas
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. **Prepare the Flask/FastAPI directory:**
```bash
# Copy the Mental_Health_Model.pkl to your backend directory
cp Mental_Health_Model.pkl /path/to/backend/
```

2. **Create main.py** with the provided code and place Mental_Health_Model.pkl in the same directory

3. **Install dependencies:**
```bash
pip install fastapi uvicorn joblib pandas scikit-learn python-multipart
```

4. **Run the backend:**
```bash
cd /path/to/backend
uvicorn main:app --reload
```

The API will be available at: `http://127.0.0.1:8000`

### Frontend Setup

1. **Place files in web directory:**
```
web-directory/
├── index.html
├── style.css
└── script.js
```

2. **Start a local server** (choose one):

**Python (3.x):**
```bash
python -m http.server 8080
```

**Node.js (npm):**
```bash
npx http-server -p 8080
```

**Live Server (VS Code Extension):**
- Install "Live Server" extension
- Right-click on index.html → "Open with Live Server"

3. **Open in browser:**
```
http://localhost:8080
```

## 📝 Form Fields

The application collects data for all 12 PersonData fields:

| Field | Type | Range | Options |
|-------|------|-------|---------|
| **Age** | Integer | 10-100 | - |
| **Gender** | Select | - | Male, Female |
| **Country** | Select | - | India, USA, Canada, Australia, UK, Germany, Mexico, Turkey, France, Other |
| **Academic Level** | Select | - | High School, Undergraduate, Graduate |
| **Most Used Platform** | Select | - | Facebook, Instagram, Twitter, LinkedIn, TikTok, Snapchat, YouTube, LINE, KakaoTalk, VKontakte, WhatsApp, WeChat |
| **Purpose of Use** | Select | - | Networking, Education, Entertainment, News |
| **Daily Usage (hours)** | Float | 0-24 | - |
| **Daily Unlocks** | Integer | 0+ | - |
| **Study Hours** | Float | 0-24 | - |
| **Physical Activity Hours** | Float | 0-24 | - |
| **Sleep Hours** | Float | 0-24 | - |
| **Stress Level** | Select | - | Low, Medium, High, Very High |

## 🎯 Features

### User Experience
- ✅ **Form Validation**: Real-time error checking
- ✅ **Loading Animation**: Elegant spinner while processing
- ✅ **Result Display**: Beautiful card with score visualization
- ✅ **Wellness Tips**: Personalized recommendations based on input
- ✅ **Error Handling**: Graceful error messages
- ✅ **Mobile Responsive**: Works on all device sizes

### Technical Features
- ✅ **Vanilla JavaScript**: No frameworks or dependencies
- ✅ **Fetch API**: Modern CORS-enabled communication
- ✅ **CSS Animations**: Smooth 60fps animations
- ✅ **Canvas Animations**: Dynamic particle effects
- ✅ **SVG Graphics**: Scalable vector elements
- ✅ **Responsive Grid Layout**: Adaptive design

## 🔄 API Integration

### Request Format
```javascript
POST http://127.0.0.1:8000/predict

{
    "age": 25,
    "gender": "Male",
    "country": "India",
    "academic_level": "Undergraduate",
    "most_used_platform": "Instagram",
    "purpose_of_use": "Entertainment",
    "avg_daily_usage_hours": 5.5,
    "daily_unlocks": 150,
    "study_hours": 4.0,
    "physical_activity_hours": 1.5,
    "sleep_hours_per_night": 7.0,
    "stress_level": "Medium"
}
```

### Response Format
```json
{
    "predicted_mental_health_score": 72.45
}
```

## 🎨 Customization

### Modify Colors
Edit `:root` variables in `style.css`:
```css
:root {
    --primary-dark: #2d1f3c;
    --accent-coral: #ff6b6b;
    --accent-sage: #7fb3a0;
    /* ... more variables */
}
```

### Adjust Animations
- **Speed**: Modify `--transition-fast` and `--transition-smooth`
- **Durations**: Edit `animation` properties in keyframes
- **Effects**: Change `filter`, `transform`, and `opacity` properties

### Add More Tips
Update `WELLNESS_TIPS` in `script.js`:
```javascript
const WELLNESS_TIPS = {
    category: [
        'Tip 1...',
        'Tip 2...',
        'Tip 3...'
    ]
};
```

## 🌐 Deployment

### Vercel / Netlify
1. Push frontend files to GitHub
2. Connect repository to Vercel/Netlify
3. Update `API_BASE_URL` in `script.js` to your backend URL
4. Deploy backend separately (Heroku, Railway, AWS Lambda, etc.)

### Docker Deployment
Create `docker-compose.yml`:
```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/Mental_Health_Model.pkl
  
  frontend:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
    depends_on:
      - backend
```

## 🔒 Security Notes

- ✅ CORS is enabled on backend
- ✅ Input validation on both frontend and backend
- ✅ No sensitive data stored in browser
- ✅ HTTPS recommended for production
- ⚠️ Keep API keys secure (not in frontend code)

## 📊 Score Interpretation

| Score Range | Label | Color |
|-------------|-------|-------|
| 80-100 | Excellent | Sage Green |
| 60-79 | Good | Light Sage |
| 40-59 | Fair | Pink |
| 0-39 | Needs Attention | Coral |

## 🐛 Troubleshooting

### "CORS Error" or "Failed to fetch"
- Ensure backend is running: `http://127.0.0.1:8000`
- Check CORS middleware in FastAPI backend
- Verify firewall isn't blocking port 8000

### Model not loading
- Ensure `Mental_Health_Model.pkl` is in backend directory
- Check scikit-learn version compatibility
- Run: `pip install --upgrade scikit-learn joblib`

### Animations not smooth
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Check GPU acceleration is enabled
- Close resource-heavy applications

### Form not submitting
- Check browser console for errors (F12)
- Verify all required fields are filled
- Check backend logs for API errors

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console (F12 → Console)
3. Check backend logs
4. Verify API endpoint in `script.js`

## 📈 Future Enhancements

- [ ] User authentication and history
- [ ] Export results as PDF
- [ ] Dark/Light theme toggle
- [ ] Multiple language support
- [ ] Advanced analytics dashboard
- [ ] Integration with health tracking APIs
- [ ] Progressive Web App (PWA) support

---

**Created with ❤️ for mental health awareness and AI-powered well-being insights.**
