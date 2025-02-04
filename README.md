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

We welcome you to contribute and fix easy to medium issues in this project and as a learning project.
**Easy to fix issues**:
1. In //app/profile/EditProfile.tsx during editing profile, clicking on save profile will trigger uniqueness check on username which must be checked on changing the username only and during its checking it also considers your current username which results in an alert that username already exists. you have to fix that during checking the username, it should not consider your current username.
2. When someone posts without an image, it should be just posted without an image but it has a text saying 'No Image'. Remove that text or say whole image container as there is no image
3. During posting any image from gallery, there comes an intrface to crop the image from gallery which is set to a fixed ratio. change to a dynamic ratio. when the image is posted the ratio in posts is also fixed, change it to adjust with real image upto some extent.
4. the profile image is not visible in personal chat screen on top. make it visible.
5. The user profile image should also be shown on each post of that user.
**Moderate Issues**:
1. In posts section of profile, if the user has empty image-posts, it should not be rendered there but it is rendering with a blank grey color looking odd. remove that.
2. add a more-vert option for each post to delete post.
3. There is an issue when i am changing tab without actually clicking the tab. for example if i searched any user in search tab and click on that profile then click on 'Message' it will redirect to chatscreen of that user so the Chats tab will be active so it is shown 'bold' but the rectangle is still on search tab only. Fix that rectangle to also travel to Chats tab
4. When I am going to someone's profile through search. The posts count is showing correct value but the corresponding posts are not being visible there. fix that.
