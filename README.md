# Kampus - College Social Media App

[![2ipPVmF.png](https://iili.io/2ipPVmF.png)](https://freeimage.host/) <!-- Add your logo here -->

Kampus is a **college-focused social media app** designed to help students stay connected, share updates, and engage with their college community. It features news feeds, SOS alerts, event updates, user profiles, and real-time chat functionality. ***It is still under development***.

---

## **Features**

- **News Feed**: Share and view posts related to college events, news, or entertainment.
- **SOS Alerts**: Send and receive emergency alerts within the college community.
- **User Profiles**: Customizable profiles with name, username, profile/header images, and friends list.
- **Posts**: Create, like, and comment on posts.
- **Chats**: Real-time messaging with other users.
- **Edit Profile**: Update profile information and images.

---

## **Tech Stack**

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Styling**: React Native Stylesheet

---

## **Getting Started**

Follow these steps to set up the project on your local machine.

### **Prerequisites**

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (install globally using `npm install -g expo-cli`)
- Firebase account (for backend setup)

### **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/kampus-app.git
   cd kampus
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Firebase**:
   Create a Firebase project at Firebase Console.
   Add a web app to your Firebase project and copy the Firebase configuration.
   Create a .env file in the root directory and add your Firebase configuration:

   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```
4. **Run the App**:
   ```bash
   npm start
   ```
   Scan the QR code using the Expo Go app on your mobile device or use an emulator.
### **Project Structure**

```
kampus-app/
├── .expo/             # Expo development configurations
├── app/               # Main application components
│   ├── (auth)/        # Authentication screens
│   ├── context/       # React context providers
│   ├── home/          # Home screen components
│   └── profile/       # Profile management
├── assets/            # Images, fonts, and static files
├── components/        # Reusable UI components
├── constants/         # Constant values and themes
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── firebaseConfig.js  # Firebase configuration
├── app.json           # Expo app configuration
├── babel.config.js    # Babel configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```
### **Dependencies**

- React Native
- Expo
- Firebase (Authentication/Firestore)
- React Navigation
- TypeScript
- React Native Paper (UI Library)
### **Contributing**

We welcome contributions from the community! Here’s how you can get started:

**Steps to Contribute**
1. **Fork the repository**:
   Click the "Fork" button on the top right of the repository page.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/kampus.git
   cd kampus
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
4. **Commit changes**:
    ```bash
      git commit -m 'Add: Your feature description'
    ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature
    ```
6. **Create a Pull Request**:
- Go to the original repository and click "New Pull Request".
- Provide a clear description of your changes and link any related issues.

### **Issue Labels**
