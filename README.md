# Patrice Mirindi - Professional Website

A modern, responsive static website with an intelligent chat Q&A agent built for GitHub Pages.

## 🌟 Features

- **Static Multi-Page Website**: Clean, professional design with HTML/CSS/JS
- **Dual-Source Chat Agent**: AI-powered chat with strict grounding to FAQ and About data
- **Mobile-First Design**: Fully responsive and accessible
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **GitHub Pages Ready**: Automated CI/CD with GitHub Actions
- **Serverless Backend**: Cloudflare Workers function for chat API

## 📁 Repository Structure

```
/
├── docs/                          # GitHub Pages output
│   ├── index.html                 # Home page
│   ├── about.html                 # About page
│   ├── faq.html                   # FAQ page
│   ├── contact.html               # Contact page
│   ├── assets/
│   │   ├── css/style.css         # Main stylesheet
│   │   ├── js/
│   │   │   ├── main.js           # Main JavaScript
│   │   │   ├── chat.js           # Chat functionality
│   │   │   ├── faq.js            # FAQ page logic
│   │   │   └── contact.js        # Contact form logic
│   │   └── img/                  # Images and assets
│   └── data/                     # JSON data files (generated)
│       ├── faq.json              # FAQ data
│       └── about.json            # About data
├── data/
│   ├── faq.xlsx                  # Source FAQ data (Excel)
│   ├── faq.csv                   # Alternative FAQ source (CSV)
│   └── about.json                # Structured "About Me" data
├── api/
│   └── chat.js                   # Cloudflare Workers function
├── tools/
│   ├── excel_to_json.R           # R script for data conversion
│   └── excel_to_json.py          # Python script for data conversion
├── .github/workflows/
│   └── site.yml                  # GitHub Actions workflow
└── README.md                     # This file
```

## 🚀 Quick Start

### 1. Setup Repository

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The site will be available at `https://yourusername.github.io/repository-name`

### 2. Customize Content

#### Update About Information
Edit `data/about.json` with your details:

```json
{
  "name": "Your Name",
  "roles": ["Your Role 1", "Your Role 2"],
  "summary": "Your professional summary...",
  "location": "Your Location",
  "languages": ["English", "French", "etc"],
  "skills": ["Skill 1", "Skill 2", "etc"],
  "experience_highlights": [
    {"title": "Job Title", "org": "Organization", "since": "2024-01"}
  ],
  "education": [
    {"degree": "Your Degree", "institution": "University", "year": "Year"}
  ],
  "links": {
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername"
  },
  "availability": "Your availability status"
}
```

#### Update FAQ Data
Add/edit questions in `data/faq.csv` or `data/faq.xlsx`:

| Question | Keywords | Answer |
|----------|----------|--------|
| What do you do? | job,work,profession | I am a... |
| How can I contact you? | contact,email | You can reach me at... |

### 3. Add Your Profile Image

1. Add your profile image as `docs/assets/img/patricemirindi.jpg`
2. Or update the image path in the HTML files

### 4. Deploy Chat API (Optional)

For full chat functionality, deploy the serverless function:

#### Cloudflare Workers (Recommended)

1. Sign up for [Cloudflare Workers](https://workers.cloudflare.com/)
2. Create a new Worker
3. Copy the content from `api/chat.js`
4. Set environment variables:
   - `OPENAI_API_KEY` (optional, for enhanced responses)
5. Deploy and get your Worker URL
6. Update the `apiEndpoint` in `docs/assets/js/chat.js`

#### Alternative: Netlify Functions

1. Deploy to Netlify
2. Convert `api/chat.js` to Netlify Functions format
3. Update the API endpoint in the frontend

## 🛠️ Development

### Local Development

1. **Serve locally:**
   ```bash
   # Using Python
   cd docs
   python -m http.server 8000

   # Using Node.js
   npx http-server docs -p 8000

   # Using PHP
   cd docs
   php -S localhost:8000
   ```

2. **Access at:** `http://localhost:8000`

### Building Data Files

**Using R:**
```bash
Rscript tools/excel_to_json.R
```

**Using Python:**
```bash
python tools/excel_to_json.py
```

### Testing Chat Functionality

The chat widget will work in fallback mode without the serverless function, using client-side keyword matching.

## 📝 Content Management

### Adding New FAQ Entries

1. Edit `data/faq.csv` or `data/faq.xlsx`
2. Add new row with Question, Keywords (comma-separated), Answer
3. Commit and push - GitHub Actions will automatically convert to JSON

### Updating Pages

1. Edit HTML files in `docs/` directory
2. Update CSS in `docs/assets/css/style.css`
3. Modify JavaScript in `docs/assets/js/` as needed
4. Commit and push for automatic deployment

### Managing About Data

Edit `data/about.json` directly and commit. The file is automatically copied to `docs/data/` during build.

## 🔧 Customization

### Styling

Main styles are in `docs/assets/css/style.css`:
- CSS variables for easy color/font changes
- Responsive design with mobile-first approach
- Dark/light theme support (add theme toggle if needed)

### Chat Behavior

Customize chat responses in `docs/assets/js/chat.js`:
- Modify intent classification logic
- Adjust keyword matching
- Add custom responses for specific queries

### SEO & Analytics

Add analytics tracking:
```html
<!-- Add to all HTML files before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security & Privacy

- No personal data stored in browser
- Chat conversations are ephemeral
- API keys secured as environment variables
- CORS properly configured for API endpoints

## 📊 Performance

- Minified CSS and JS (optional: add build step)
- Lazy loading for images
- Efficient chat widget (only loads when needed)
- Fast GitHub Pages CDN delivery

## 🐛 Troubleshooting

### Common Issues

**1. FAQ data not loading:**
- Check that `data/faq.json` exists in `docs/data/`
- Verify JSON format with online validator
- Check browser console for errors

**2. Chat not working:**
- Fallback mode should work without API
- Check browser console for JavaScript errors
- Verify API endpoint URL if using serverless function

**3. Images not displaying:**
- Ensure images are in `docs/assets/img/` directory
- Check file paths in HTML files
- Verify image file extensions match references

**4. Deployment failing:**
- Check GitHub Actions logs
- Ensure all required files are present
- Verify GitHub Pages is enabled in repository settings

### Debug Mode

Enable debug logging:
```javascript
// Add to browser console
localStorage.setItem('debug', 'true');
```

## 📈 Analytics & Monitoring

### Tracking Metrics

Monitor these key metrics:
- Page views and user engagement
- Chat widget usage and success rate
- Contact form submissions
- FAQ search queries and results

### Performance Monitoring

Use browser DevTools to monitor:
- Page load times
- JavaScript performance
- Mobile responsiveness
- Accessibility compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Contact: patricemirindi@gmail.com

## 🔄 Updates

This template is actively maintained. Check for updates regularly and review the changelog for new features and improvements.

---

**Last Updated:** September 2024
**Version:** 1.0.0