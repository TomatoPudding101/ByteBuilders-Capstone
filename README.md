# ByteBuilders-Capstone

Here are the steps to run the development server:

1. Clone either the main or test branch.(Probably clone main at this time of writing)

2. Make sure that the repo was succefully cloned. In VSCode the left side bar should look like this:

![alt text](<ReadMe Tutorial Pics/image.png>)

2. Change directory to RemindMe in VSCode terminal:
cd RemindMe (if you type R and then tab it should autocomplete).

3. If you haven't already run this command to install EXPO cli globally:
npm install -g expo-cli

4. Start the development server with:
npx expo start

5. The server should be running at this point, and you should see a QR code in the terminal. You can scan it on the camera on your phone.

This QR code probably wont work if you scan it :(

6. There is an app called Expo Go on the App Store that saves your scanned QR codes and allows you to view the server on your 
   phone provided that you did npx expo start. You can make an account. It should allow you to see both Android and IOS development.

7. To make changes to the app, follow through this path: 
RemindMe\app\(tabs)\index.tsx

8. Happy coding! Let me know if you need help or if youre struggling to get the dev server up and running.
