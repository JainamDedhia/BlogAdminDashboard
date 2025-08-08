# 📝 Blogging Admin Panel

![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A complete, production-ready blogging admin panel built with **React + Firebase**. Fully functional with user management, post editor, media library, settings, analytics, and more — all using **real data**, not static content.

---

## 🚀 Features

### 🔐 Authentication
- Login / Register / Reset Password
- Role-based access: Admin, Editor, Author
- Firebase Auth integration

### 🧑‍💻 User Management
- View/search/filter users
- Manage roles and profile info
- Activity tracking

### 📝 Post Editor
- WYSIWYG with ReactQuill
- Categories, tags, SEO
- Draft/published/archive statuses
- Image uploads (Firebase Storage)

### 💬 Comments System
- Moderate comments (approve/spam/delete)
- Replies and threading
- Bulk operations

### 🖼️ Media Library
- Drag & drop uploads with preview
- List/grid views
- File search, delete, download
- Bulk actions

### ⚙️ Settings
- General, Writing, Reading
- Media, Permalink, Appearance
- Discussion & Security

### 📈 Analytics
- Real-time traffic charts
- Device and source breakdown
- Top performing posts
- Engagement metrics

---

## 🧰 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Libraries**:
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
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Required Packages

```bash
npm install @headlessui/react @heroicons/react react-beautiful-dnd react-dropzone date-fns chart.js react-chartjs-2 react-hot-toast
```

### 4. Run the Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

```
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
```

---

## ☁️ Deployment

You can deploy this admin panel to:

- Vercel
- Netlify
- Firebase Hosting


---

## 🔧 Scripts

| Command            | Description               |
|--------------------|---------------------------|
| `npm run dev`      | Start development server  |
| `npm run build`    | Build for production      |
| `npm run preview`  | Preview production build  |

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgments

Built with ❤️ using React, Firebase, and TailwindCSS.

---

## 👨‍💻 Author

**[Your Name](https://github.com/JainamDedhia)**
