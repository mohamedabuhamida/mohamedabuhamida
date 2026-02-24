# 🚀 Mohamed AbuHamida – Cinematic Portfolio

A scroll-driven, immersive portfolio built with **Next.js**, **Framer Motion**, and **Supabase**.

This project showcases selected works in Artificial Intelligence, Machine Learning, and Modern Web Development through cinematic interactions and horizontal scroll experiences.

---

## ✨ Highlights

* 🎬 Scroll-based horizontal project gallery
* 🧠 AI-focused project presentation
* 🎥 Smooth motion powered by Framer Motion
* 🌑 Premium dark UI with modern layout
* 📱 Fully responsive design
* ⚡ Optimized performance with Next.js App Router
* 🗄 Dynamic data from Supabase

---

## 🛠 Tech Stack

**Framework:** Next.js (App Router)
**Styling:** Tailwind CSS
**Animation:** Framer Motion
**Database & Storage:** Supabase
**Icons:** Lucide React
**Deployment:** Vercel

---

## 📂 Project Structure

```
components/
  ui/
  sections/
    ProjectsSection.tsx
    Achievements.tsx
    Certifications.tsx
    Experience.tsx
    Education.tsx
    ContactSection.tsx

types/
  index.ts
```

---

## 🎬 Projects Section Architecture

The Projects section uses vertical scroll to drive horizontal animation.

### Core Concept

* Vertical scroll controls horizontal translation.
* Sticky container keeps gallery centered.
* `useScroll` + `useTransform` drive movement.
* Dynamic width calculation ensures smooth transitions.

### Core Logic

```ts
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
})

const x = useTransform(
  scrollYProgress,
  [0, 1],
  [0, -totalDistance]
)
```

---

## 🗄 Supabase Projects Schema

Each project includes:

* Title
* Tagline
* Description
* Technologies[]
* Main Image
* Hero Image
* Accent Color
* GitHub Link
* Like System

---

## 🧠 Design Philosophy

This portfolio avoids traditional card layouts.

Instead, it focuses on:

* Immersive storytelling
* Motion-driven presentation
* Exhibition-style project browsing
* Clean minimal interface
* Strong AI identity

The goal is not just to display projects — but to present them as experiences.

---

## 📸 Featured Projects

* 🛒 Smart Shopping Cart (AI + IoT)
* 🏥 Medicare – AI Medical Diagnosis System
* ☄ Asteroid Hazard Prediction
* 🪨 Mining Process Flotation Analysis
* 🛍 Customer Segmentation Analysis
* 🍕 Pizza Hut Modern Web App

---

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/mohamedabuhamida/portfolio.git
cd portfolio
npm install
npm run dev
```

---

## 🌍 Live Demo

Add your deployed link here:

```
https://mohamedabuhamida.vercel.app
```

---

## 📬 Contact

📧 [mohamedabuhamida3@gmail.com](mailto:mohamedabuhamida3@gmail.com)
💼 LinkedIn: [https://www.linkedin.com/in/mohamedabuhamida](https://www.linkedin.com/in/mohamedabuhamida)
🧑‍💻 GitHub: [https://github.com/mohamedabuhamida](https://github.com/mohamedabuhamida)

---

## 🏆 Author

**Mohamed Ramdan AbuHamida**
Artificial Intelligence Engineer
Computer Vision & Machine Learning Specialist

---

> "Building intelligent systems that merge AI and modern web technologies."
