## Video Call Application (WebRTC+Firebase)
An online video call application based on WebRTC with Firebase as signaling service.

**🔥 Official Website :** https://video-call-webrtc.vercel.app/

<div align="center">
<img src="/public/sample.png"  width="90%"/>
</div>

## To Run (Locally)

1. Git clone the project repository on your local system
```javascipt
git clone https://github.com/deepeshdm/video-call-webrtc-firebase.git
```

2. Install dependencies in package.json
```javascipt
cd video-call-webrtc-firebase
npm install
```
3. Copy your firebase app's configuration into 'firebase-config.js' file
```javascript
const firebaseConfig = {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    databaseURL: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};
```

4. Deploy project on local server
```javascipt
npm run dev
```
