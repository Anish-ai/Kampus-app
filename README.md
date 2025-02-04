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

## **Issues**

We welcome contributions to improve Kampus! Below is a list of open issues categorized by difficulty level. If you're interested in contributing, feel free to pick an issue and work on it. Make sure to follow the [contribution guidelines](#contributing) before submitting a pull request.

---

### **Warnings**

1. **Avoid Uploading Unnecessary Data**  
   - Please ensure that you do not upload unnecessary images or data to the Firebase database during testing. We won't be responsible for any data loss if they went deleted.
   - **Recommendation**: Use dummy data or less-sized images for testing purposes.

2. **Use Your Own Firebase Project**  
   - It is **highly recommended** to create your own Firebase project for testing. This ensures that you do not interfere with the production database and can experiment freely.  
   - **Steps**:  
     - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).  
     - Add a web app to your Firebase project and copy the Firebase configuration.  
     - Replace the Firebase configuration in `firebaseConfig.js` with your own credentials.  
     - Use the `.env` file to securely store your Firebase credentials (see [Getting Started](#getting-started) for details).

---

### **Easy Issues**

These issues are ideal for beginners or those looking to get familiar with the codebase. They involve minor fixes or improvements.

1. **EditProfile Username Uniqueness Check**  
   - **Description**: In `app/profile/EditProfile.tsx`, the username uniqueness check is triggered even when the username hasn't changed. This results in an unnecessary alert stating that the username already exists.  
   - **Expected Behavior**: The uniqueness check should only run when the username is modified, and it should exclude the current user's username from the check.  
   - **Files to Modify**: `app/profile/EditProfile.tsx`.

2. **Post Without Image Rendering**  
   - **Description**: When a post is created without an image, the UI displays a placeholder text ("No Image") or an empty container, which looks inconsistent.  
   - **Expected Behavior**: If a post has no image, the image container should not be rendered at all.  
   - **Files to Modify**: `components/PostDesign.tsx`.

3. **Dynamic Image Cropping Ratio**  
   - **Description**: The image cropping interface currently uses a fixed aspect ratio, which limits flexibility. Additionally, the posted image retains a fixed ratio, which may distort the original image.  
   - **Expected Behavior**: The cropping interface should allow dynamic ratios, and the posted image should maintain the original aspect ratio (within reasonable limits).  
   - **Files to Modify**: `components/AddPost.tsx` and `components/PostDesign.tsx`.

4. **Profile Image in Chat Screen**  
   - **Description**: The user's profile image is not displayed in the personal chat screen header, making it less visually engaging.  
   - **Expected Behavior**: The profile image of the user should be visible in the chat screen header.  
   - **Files to Modify**: `components/ChatDesign.tsx`.

5. **Profile Image on Posts**  
   - **Description**: User profile images are not displayed on individual posts, making it harder to identify the author of a post.  
   - **Expected Behavior**: Each post should display the profile image of the user who created it.  
   - **Files to Modify**: `components/PostDesign.tsx`.

---

### **Moderate Issues**

These issues require a deeper understanding of the codebase and may involve more complex logic or UI changes.

1. **Empty Image Posts Rendering**  
   - **Description**: In the profile's posts section, if a user has posts without images, a blank grey container is rendered, which looks inconsistent.  
   - **Expected Behavior**: Posts without images should not render the image container at all.  
   - **Files to Modify**: `app/profile/Profile.tsx`.

2. **Post Deletion Option**  
   - **Description**: Users currently cannot delete their own posts. Adding a "more-vert" (three-dot) menu option for post deletion would improve functionality.  
   - **Expected Behavior**: Each post should have a "more-vert" menu with a "Delete Post" option.  
   - **Files to Modify**: `components/PostDesign.tsx`.

3. **Tab Navigation Indicator Misalignment**  
   - **Description**: When navigating to a chat screen from a user's profile, the active tab indicator (rectangle) does not update correctly. The indicator remains on the previous tab (e.g., Search) even though the Chats tab is active.  
   - **Expected Behavior**: The active tab indicator should align with the currently active tab.  
   - **Files to Modify**: `components/CustomTabBar.tsx`.

4. **Profile Posts Visibility Issue**  
   - **Description**: When viewing a user's profile via the search tab, the post count is displayed correctly, but the corresponding posts are not visible.  
   - **Expected Behavior**: All posts should be visible in the profile's posts section.  
   - **Files to Modify**: `app/home/search/id.tsx`.
