# Yash Dhanraj Jambhulkar — Developer Portfolio

Personal developer portfolio showcasing full-stack web applications, technical skills, and projects built with Python, Django, MySQL, JavaScript, and AI APIs.

🌐 **Live Website:** [https://yashjambhulkar.netlify.app/](https://yashjambhulkar.netlify.app/)  
🛡️ **Admin Panel:** [https://yashjambhulkar.netlify.app/admin.html](https://yashjambhulkar.netlify.app/admin.html)

---

## ⚡ Features

- **Built-in Admin Dashboard (`/admin.html`):** Password-protected management console to update Profile details, Projects, Skills, and Contact information without touching code.
- **GitHub Sync & Netlify One-Click Deploy:** Publish changes directly to GitHub via the GitHub API, which automatically triggers a live Netlify deployment in seconds.
- **Interactive Developer Terminal:** Simulated Python environment in the hero section that transitions into an interactive CLI where visitors can type commands (`help`, `skills`, `projects`, `resume`, `contact`, `theme`, `clear`).
- **High-Resolution Project Mockups:** UI previews for **Resume AI** (Live ATS Analyzer) and **Room Buddies** (Accommodation Platform).
- **Dark & Light Mode:** Seamless theme switcher with persistence in `localStorage` and dynamic `<meta name="theme-color">` synchronization.
- **Direct Resume CTAs:** Quick-access Resume links in both header navigation and hero section.
- **Copy Email with Toast:** One-click clipboard copy for email address with immediate visual feedback.
- **SEO & Social Optimization:** Integrated Open Graph tags, Twitter cards, SVG favicon, and Schema.org JSON-LD structured data.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Custom design system, CSS Variables, Glassmorphism), Vanilla JavaScript (ES6+)
- **Typography:** Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono
- **Backend & Tools Showcased:** Python, Django, MySQL, Groq API, Git, GitHub
- **Deployment:** Netlify Continuous Deployment (via GitHub)

---

## 📁 Project Structure

```text
Portfolio/
├── index.html         # Main semantic HTML5 markup
├── admin.html         # Password-protected Admin Dashboard
├── data/
│   └── portfolio.json # Dynamic portfolio data source
├── css/
│   └── style.css      # Design tokens, layouts, components & animations
├── js/
│   └── main.js        # Theme toggle, interactive CLI, hydration & UX logic
├── assets/
│   ├── favicon.svg    # Pythonic SVG badge favicon
│   ├── resume.pdf     # Developer resume / CV
│   └── images/        # High-res project mockup screenshots
├── netlify.toml       # Netlify headers & publish directory config
└── README.md          # Project documentation
```

---

## 🛡️ Admin Panel Guide

1. Navigate to `/admin.html` (or click **Admin** in the footer).
2. Enter your secure admin password.
3. Edit your profile, projects, or skills in the dashboard tabs.
4. **Publishing options**:
   - **One-Click Netlify Sync**: Under the **GitHub & Deploy** tab, enter your GitHub Personal Access Token (PAT) with `repo` scope. Click **"Publish to Netlify"** — your changes are committed to GitHub and auto-deployed live by Netlify in 10-15 seconds!
   - **Manual Export**: Under the **Backup & JSON** tab, download `portfolio.json`.

---

## 🚀 Local Development

```bash
# Using Python's built-in HTTP server:
python -m http.server 8000

# Open in browser:
# http://localhost:8000
# http://localhost:8000/admin.html
```

---

## 📬 Connect

- **Email:** [jambhulkarn6@gmail.com](mailto:jambhulkarn6@gmail.com)
- **LinkedIn:** [linkedin.com/in/yash-jambhulkar-6092663b6](https://www.linkedin.com/in/yash-jambhulkar-6092663b6)
- **GitHub:** [github.com/yash-jambhulkar06](https://github.com/yash-jambhulkar06)
