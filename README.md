# Full Stack Open - Rate Repository Application

This repository contains the exercises for Part 10 of the Full Stack Open course: React Native.

## 📱 Application QR Code (EAS Update)

Scan the QR code below using the Expo Go app on an Android device, or the Camera app on an iOS device, to open the published version of the application:

<!-- Replace the line below with the path to your actual QR code screenshot once generated -->
![EAS Update QR Code](./part10/rate-repository-app/assets/qr-code.png)

> [!NOTE]
> If you experience issues opening the application via Expo Go on a physical phone using the QR code, try opening the QR code link within an emulator (such as Android Studio or Xcode Simulator).

---

## 🚀 How to Publish the Application via EAS Update

To publish the application and generate your own QR code, follow these steps:

1. **Log in to Expo:**
   If you don't have the CLI installed or aren't logged in, run:
   ```bash
   npx eas-cli login
   ```

2. **Configure the Project:**
   Navigate to the project directory and configure the project for EAS build/update:
   ```bash
   cd part10/rate-repository-app
   npx eas-cli project:init
   npx eas-cli update:configure
   ```

3. **Publish the Update:**
   Run the following command to publish the final version:
   ```bash
   npx eas-cli update --branch production --message "Publish final version"
   ```

4. **Get the QR Code:**
   * After the update is published, the terminal output will print a link to the Expo project dashboard (e.g. `https://expo.dev/...`).
   * Open the link, download or screenshot the generated QR code, and save it as `qr-code.png` inside the `part10/rate-repository-app/assets/` directory.

---

## 🛠️ Local Development Setup

To run the application locally:

1. **Install Dependencies:**
   ```bash
   cd part10/rate-repository-app
   npm install --legacy-peer-deps
   ```

2. **Environment Configuration:**
   Create a `.env` file in `part10/rate-repository-app/` and specify the backend URI:
   ```env
   EXPO_PUBLIC_APOLLO_URI=http://<YOUR_IP_ADDRESS>:4000/graphql
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```

4. **Running Tests:**
   ```bash
   npm test
   ```
