# 📝 Blogging Admin Panel

![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A complete and production-ready blogging admin panel built with **React** and **Firebase**. Manage posts, users, comments, media, settings, and view analytics with real-time updates — no static content, no "coming soon" pages.

---

## ✨ Features

### 🔐 Authentication
- Login / Register / Password Reset
- Role-based access: **Admin**, **Editor**, **Author**
- Secure session management (Firebase Auth)

### 📊 Dashboard
- Real-time statistics
- Activity feeds
- Quick actions & system status

### 📝 Post Management
- Full WYSIWYG editor (ReactQuill)
- Image uploads to Firebase Storage
- Categories, tags, SEO settings
- Draft/Published/Archived states
- Bulk operations

### 👥 Users
- User list with search & filters
- Role management and profile editing
- Joined and last login info

### 💬 Comments
- Moderation (approve, spam, delete)
- Reply to comments
- Bulk operations and filtering

### 🖼️ Media Library
- Drag & drop file uploads (react-dropzone)
- Grid/List view
- Delete, download, search
- Bulk file operations

### ⚙️ Settings
- General, Writing, Reading, Media, Permalink
- Appearance, Discussion, Security
- Fully editable settings

### 📈 Analytics
- Traffic charts (Chart.js)
- Device breakdown
- Top posts and engagement metrics
- Traffic sources analysis

---

## 🧰 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Libraries:**
  - `@headlessui/react`
  - `@heroicons/react`
  - `react-beautiful-dnd`
  - `react-dropzone`
  - `date-fns`
  - `chart.js`, `react-chartjs-2`
  - `react-hot-toast`
  - `react-quill`
  - `lucide-react`

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blog-admin-panel.git
cd blog-admin-panel
2. Install Dependencies
bash
Copy
Edit
npm install
Then install these additional packages:

bash
Copy
Edit
npm install @headlessui/react @heroicons/react react-beautiful-dnd react-dropzone date-fns chart.js react-chartjs-2 react-hot-toast
3. Start Development Server
bash
Copy
Edit
npm run dev
📁 Project Structure
css
Copy
Edit
src/
├── components/
│   ├── analytics/
│   ├── comments/
│   ├── layout/
│   ├── media/
│   ├── posts/
│   ├── settings/
│   └── users/
├── hooks/
├── pages/
├── App.tsx
└── main.tsx
🚀 Deployment
You can deploy this admin panel to:

Vercel

Netlify

Firebase Hosting

Make sure to add your Firebase credentials in .env (this project does not include Firebase setup for security reasons).

🛠 Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build

📝 License
Licensed under the MIT License.

🙌 Acknowledgments
Built with ❤️ using React, Firebase, and TailwindCSS.

👨‍💻 Author
Your Name

yaml
Copy
Edit

---

✅ You can **copy the entire content above and paste it directly** into your `README.md`.

Let me know if you want:
- Firebase setup instructions  
- Hosting instructions  
- Or want it styled with screenshots or GIFs!
