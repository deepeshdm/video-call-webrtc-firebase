
import * as firedb from "./firedb"
import { ref, onValue } from "firebase/database";

// Google STUN servers
const servers = {
  iceServers: [{
    urls: ['stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302']
  }], iceCandidatePoolSize: 10
};

const start_webcam_btn = document.getElementById("start-webcam-btn")
const call_btn = document.getElementById("call-btn")
const username_input = document.getElementById("username-input")
const clientname_input = document.getElementById("clientname-input")
const local_video = document.getElementById("local-video")
const remote_video = document.getElementById("remote-video")
const client_label = document.getElementById("client-label")
const receiver_label = document.getElementById("receiver-label")
let peerConnection = new RTCPeerConnection(servers)
let localstream;
let remotestream;
let clientname;
let localSDP;
let remoteSDP;
let callerName;
let receivername = null
let isCaller = false

// disable call inputs
call_btn.disabled = true;
username_input.disabled = true;

//============================================================================================

async function create_answer(offer) {

  peerConnection.onicecandidate = async (event) => {
    console.log("New answer created...updating caller's remote sdp")
    //Event that fires off when a new answer ICE candidate is created
    if (event.candidate) {
      const answer = JSON.stringify(peerConnection.localDescription)
      remoteSDP = answer;
      firedb.updateRemoteSDP(callerName, answer);
    }
  };

  console.log("Creating answer now...")
  await peerConnection.setRemoteDescription(JSON.parse(offer));
  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
}

//============================================================================================

start_webcam_btn.onclick = async () => {

  clientname = clientname_input.value;
  if (clientname == "") {
    window.alert("Please enter your own username !")
    clientname_input.focus()
    return;
  }

  // get local webcam feed and display it
  console.log("Starting Local Webcam !")
  localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  remotestream = new MediaStream()
  local_video.srcObject = localstream
  remote_video.srcObject = remotestream

  //------------------------------------------------------------

  // push localstream to peerConnection
  console.log("Pushing LocalStream to PeerConnection ")
  localstream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localstream)
  });

  // pull remotestream to peerConnection when remote-sdp is added
  peerConnection.ontrack = (event) => {
    console.log("Pushing RemoteStreams to PeerConnection ")
    event.streams[0].getTracks().forEach((track) => {
      remotestream.addTrack(track);
    });
  };

  //------------------------------------------------------------

  // create and save LocalSDP / Offer to client's firebase

  peerConnection.onicecandidate = async (event) => {
    // executes when new offer ICE candidate is created
    if (event.candidate) {
      console.log("New Offer created...saving localSDP to firebase"),
        localSDP = JSON.stringify(peerConnection.localDescription)
      firedb.setSDP(clientname, localSDP)
    }
  };

  console.log("Creating new offer now...")
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  //------------------------------------------------------------

  // executes when we update receiver's remote sdp on firebase

  const location = ref(firedb.db, "users/" + clientname + "/remote_sdp")
  onValue(location, (snapshot) => {
    console.log("onValue() called !")
    if (snapshot.exists()) {

      const offer = snapshot.val();

      if (isCaller) {
        // This part gets executed on caller's side

        console.log("From Caller : ", offer)

        console.log("Accepting the call now...")
        if (peerConnection.currentRemoteDescription == null) {
          console.log("Adding remote SDP from receiver...")
          peerConnection.setRemoteDescription(JSON.parse(offer));
        }

        receiver_label.innerText = receivername;

      } else {
        // This part gets executed on receiver's side

        console.log("From Receiver : ", offer)
        create_answer(offer)
        receiver_label.innerText = callerName;

      }

    } else {
      console.log("Remote-SDP does'nt exist !");
    }
  })

  //------------------------------------------------------------

  // executes when 'caller' field is updated on receiver's firebase

  const callerRef = ref(firedb.db, "users/" + clientname + "/caller")
  onValue(callerRef, (snapshot) => {
    console.log("onValue() called for CallerRef !")
    if (snapshot.exists()) {
      callerName = snapshot.val();
      console.log("Caller : ", callerName)
    } else {
      console.log("Caller does'nt exist !");
    }
  })

  //------------------------------------------------------------

  // activate call inputs
  call_btn.disabled = false;
  username_input.disabled = false;
  client_label.innerText = clientname;

}

//============================================================================================

call_btn.onclick = async () => {

  receivername = username_input.value;
  if (receivername == "") {
    window.alert("Please enter an username to call !")
    username_input.focus()
    return;
  }
  console.log("Making a call to ", receivername)
  isCaller = true;

  //------------------------------------------------------------

  // Update LocalSDP as Remote SDP on receiver's firebase ref
  console.log("Making offer to the receiver now...")
  firedb.updateCaller(receivername, clientname)
  firedb.updateRemoteSDP(receivername, localSDP);

}

