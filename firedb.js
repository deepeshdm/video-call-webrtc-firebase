

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set, get ,update } from "firebase/database";
import firebaseConfig from "./firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
export const db = getDatabase(app);

//------------------------------------------------------------------

// Insert local or remote sdp object for given user
export async function setSDP(username, sdp, sdp_type = "local") {
    // Ref of where to insert the data
    const location = ref(db, "users/" + username);
    let data = null;

    if (sdp_type == "local") {
        data = { local_sdp: sdp };
    } else {
        data = { remote_sdp: sdp };
    }

    try {
        await set(location, data);
        console.log("Data Inserted !")
    } catch (error) {
        const errorMessage = error.message;
        console.log("Insert Error : ", errorMessage);
    }
}


// Update the existing remote sdp
export async function updateRemoteSDP(username,sdp){
    // Ref of where to update the data
    const location = ref(db, "users/" + username);
    const data = {remote_sdp: sdp}
    try {
        await update(location, data);
        console.log("Remote SDP updated !")
    } catch (error) {
        const errorMessage = error.message;
        console.log("Update Error : ", errorMessage);
    }
    
}


// Updates the "caller" field on receiver's firebase
export async function updateCaller(username,caller){
    // Ref of where to update the data
    const location = ref(db, "users/" + username);
    const data = {caller : caller}
    try {
        await update(location, data);
        console.log("Caller's name updated !")
    } catch (error) {
        const errorMessage = error.message;
        console.log("Update Error : ", errorMessage);
    }
    
}



// Read local or remote sdp object for given user
export async function getSDP(username, sdp_type = "local") {

    try {

        if(sdp_type=="local"){
            const location = ref(db, "users/" + username + "/" + "local_sdp");
            const sdp = await get(location);

            if(sdp.val()==null){
                console.log("Local SDP is empty !")
            }else{
                console.log("Local SDP : ",sdp.val())
            }

        }else{
            
            const location = ref(db, "users/" + username + "/" + "remote_sdp");
            const sdp = await get(location);
            
            if(sdp.val()==null){
                console.log("Remote SDP is empty !")
            }else{
                console.log("Remote SDP : ",sdp.val())
            }
        }

    } catch (error) {
        const errorMessage = error.message;
        console.log("Fetch Error : ", errorMessage);
    }
}

