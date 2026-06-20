# InvenTech Deployment & GitHub Guide

This guide provides step-by-step instructions to upload the **InvenTech IT Asset Management System** to a GitHub repository and deploy it to live hosting platforms.

---

## 🐙 Part 1: Uploading the Source Code to GitHub

Follow these steps to host your source code on GitHub.

### Step 1: Initialize Git Local Repository
If you haven't already initialized git in the project directory, run:
```bash
git init
```

### Step 2: Configure `.gitignore`
Make sure you have a `.gitignore` file to avoid committing unnecessary files (e.g., `node_modules`). Verify your `.gitignore` contains at least:
```text
node_modules/
.DS_Store
.env
```

### Step 3: Stage and Commit Files
Add all project files to Git staging and make an initial commit:
```bash
git add .
git commit -m "Initial commit of InvenTech Prototype"
```

### Step 4: Create a New GitHub Repository
1. Go to [GitHub](https://github.com/) and log in.
2. Click the **New** button (or "+" sign in the top-right corner) to create a new repository.
3. Name your repository (e.g., `inventech-app`).
4. Set the visibility to **Public** or **Private** based on your needs.
5. Do **NOT** initialize the repository with a README, `.gitignore`, or License (since we already have them).
6. Click **Create repository**.

### Step 5: Link Local Repository and Push to GitHub
Under the heading **"…or push an existing repository from the command line"**, copy and run the commands in your terminal:
```bash
# Rename default branch to main
git branch -M main

# Add your GitHub repository as remote origin (replace URL with your repository's URL)
git remote add origin https://github.com/YOUR_USERNAME/inventech-app.git

# Push your code
git push -u origin main
```

---

## 🚀 Part 2: Deploying to Render (Recommended)

[Render](https://render.com/) is a cloud hosting platform that supports Node.js applications natively. It offers a generous free tier perfect for prototype deployment.

### Step 1: Create a Render Account
Go to [Render](https://render.com/) and sign up. Connecting your GitHub account is recommended as it automates deployments.

### Step 2: Create a New Web Service
1. On your Render dashboard, click the blue **New** button and select **Web Service**.
2. Select **Connect repository**.
3. Choose the `inventech-app` repository you pushed in Part 1. (If you don't see it, configure Render's GitHub app permissions to grant access).

### Step 3: Configure Settings
Provide the following configurations on the creation page:
- **Name**: `inventech-app` (or any unique name)
- **Region**: Select the region closest to your audience (e.g., Singapore or US Oregon).
- **Branch**: `main`
- **Root Directory**: Leave blank (representing the root directory)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Select **Free** (or Starter/Individual if preferred).

### Step 4: Click Deploy Web Service
Render will download your code, run `npm install`, and start your server using `npm start`.
- Once completed, the log output will say `InvenTech Prototype Server running on http://localhost:3000`.
- The live URL of your application will be displayed in the top-left corner of the dashboard page (e.g., `https://inventech-app.onrender.com`).

---

## ⚡ Part 3: Deploying to Railway (Alternative)

[Railway](https://railway.app/) is another developer-friendly platform that makes deploying Node.js servers extremely fast.

### Step 1: Sign up
Sign up on [Railway](https://railway.app/) using your GitHub account.

### Step 2: Create a Project
1. Click **New Project** on your dashboard.
2. Select **Deploy from GitHub repo**.
3. Select your `inventech-app` repository.
4. Click **Deploy Now**.

### Step 3: Configure Public URL
Railway will build and deploy the app automatically. Once it builds:
1. Go to the project settings of your newly deployed service.
2. Scroll to the **Networking** section.
3. Click **Generate Domain** to get a public link to your application.

---

## 🔍 Verifying the Deployment
After your application is live, navigate to your public URL (e.g., `https://your-app.onrender.com`) to verify that:
1. The dashboard page loads correctly with the CSS styling.
2. Data updates (like creating a new physical asset or starting a maintenance ticket) work seamlessly.
3. Database resets and simulation syncs return positive API responses.
