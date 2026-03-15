# Task Manager — 3D Immersive Experience

A futuristic, high-performance Task Management application featuring a two-stage immersive user experience, interactive 3D Spline environments, and premium glassmorphic design.

![Splash Preview](https://my.spline.design/thebluemarble-YEL1LmZbaQn7Dvvv2VvRay2n/)

## 🚀 The Experience

The application is split into two distinct stages designed to elevate the standard utility of a task manager into a cinematic experience:

1.  **Stage 1: Global Status Entrance**: A full-screen interactive 3D Earth Spline scene. Users must "Enter Dashboard" to proceed, establishing a high-end atmospheric brand identity.
2.  **Stage 2: The Command Dashboard**: A functional task management hub built with glassmorphism, dynamic soundwave backgrounds, and fluid 3D transitions.

## ✨ Core Features

### 🛠️ Advanced Task Logic
-   **LIFO Sorting**: Newly created tasks are automatically prioritized at the top of the stack for instant feedback.
-   **State-Persistence Pagination**: Navigating between tasks is powered by a custom pagination system that remembers your current page even after returning from the edit screen.
-   **Intelligent Validation**: The application performs deep-state comparison when editing tasks, providing neutral feedback if no changes are detected to preserve data integrity.

### 🎭 Premium 3D Animations
-   **Digital Dive Transition**: A hardware-accelerated 0.9s "zoom-in" effect that fades the splash page while resolving the dashboard's focus-blur.
-   **3D Interactive Hover Tilt**: Task cards tilt and glare in 3D space based on real-time mouse movement.
-   **Void Deletion**: Deleted items don't just vanish; they undergo a cinematic "shrink-into-void" animation.
-   **3D Flip Pagination**: Page transitions trigger a staged "flip-out" and "flip-in" cascade for a physical, tactile feel.

### 🏆 Micro-Interaction "Rewards"
-   **Neon Recoil Bloom**: Completing a task triggers a vibrant neon pulse reward.
-   **Inbox Zero Peace**: A specialized badge appears when all tasks are cleared, celebrating your productivity.

## 💻 Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (via Mongoose)
-   **Frontend**: Vanilla HTML5, Modern CSS (Hardware Accelerated), Vanilla JavaScript (ES6+)
-   **API Client**: Axios
-   **3D Engine**: Spline Web Runtime

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd TaskManager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your credentials:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 4. Run the Application

**For Development (with Nodemon):**
```bash
npm run dev
```

**For Production:**
```bash
npm start
```

## 📈 Performance Optimization
-   **Deferred Spline Loading**: Heavy 3D assets are only loaded when they are needed in the viewport to save system resources.
-   **Hardware Acceleration**: Uses `will-change` CSS properties to offload complex animations to the GPU.
-   **Resource Cleanup**: Back-end 3D scenes are explicitly destroyed when navigating away to ensure zero memory leaks and high FPS during transitions.

---
*Created with a focus on Immersive UI and High-Performance Web Development.*
