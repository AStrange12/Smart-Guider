# Deployment Instructions for Salary Guider

This guide provides instructions to deploy your Next.js application. You can choose between Firebase App Hosting (the default) or Vercel.

---

## Option 1: Deploying to Vercel (Recommended for Next.js)

Vercel is the creator of Next.js and provides a seamless deployment experience.

### Prerequisites

1.  **Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com).
2.  **Git Repository**: Your project needs to be in a GitHub, GitLab, or Bitbucket repository.
3.  **Environment Variables**: You'll need the Firebase project credentials from your `.env.local` file.

### Step-by-Step Deployment

#### Step 1: Push Your Code to a Git Repository

If you haven't already, push your project to a service like GitHub.

#### Step 2: Import Your Project in Vercel

1.  Log in to your Vercel dashboard.
2.  Click **"Add New... > Project"**.
3.  Select the Git repository where you pushed your code. Vercel will automatically detect that it is a Next.js project.

#### Step 3: Configure Environment Variables

This is the most important step to connect your live app to Firebase.

1.  In the "Configure Project" screen, expand the **"Environment Variables"** section.
2.  You will need to add all the variables from your `.env.local` file one by one.
    *   **Key**: The name of the variable (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).
    *   **Value**: The secret value from your `.env.local` file (e.g., `AIza...`).
3.  Add all the `NEXT_PUBLIC_FIREBASE_*` variables that are in your `.env.example` file.

#### Step 4: Deploy

1.  After adding the environment variables, click the **"Deploy"** button.
2.  Vercel will build and deploy your application. Once it's done, you'll be given a live URL for your project.

Your app is now live! Vercel will automatically redeploy your application every time you push a new commit to your main branch.

---

## Option 2: Deploying to Firebase App Hosting

### Prerequisites

1.  **Firebase Project**: Make sure you have a Firebase project created.
2.  **Firebase CLI**: Install with `npm install -g firebase-tools`.
3.  **Authentication**: Log in with `firebase login`.

### Step-by-Step Deployment

#### 1. Initialize Firebase in Your Project

If you haven't already, initialize Firebase in your project directory.

```bash
firebase init
```

- Select **App Hosting**.
- Choose your Firebase project.
- When asked for the public directory, enter `.next`.
- Say **No** to configuring as a single-page app.

#### 2. Build Your Next.js App

```bash
npm run build
```

#### 3. Deploy to Firebase Hosting

```bash
firebase deploy --only apphosting
```

The CLI will upload your project and provide you with a live URL.
