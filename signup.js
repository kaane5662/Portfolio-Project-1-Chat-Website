console.log("hello from signUp.js")


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, doc, onSnapshot, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBny1yByD2vgTlqc43OMcdyRN4XX0JgV0",
    authDomain: "chat-app-2f715.firebaseapp.com",
    projectId: "chat-app-2f715",
    storageBucket: "chat-app-2f715.appspot.com",
    messagingSenderId: "3380653034",
    appId: "1:3380653034:web:31ebce2690cc9801f32093",
    measurementId: "G-EZMBBL6KTE"
  };




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()






const user = auth.currentUser;

// const boi = firebase.firestore();




//selecting the signUp form
const signupForm = document.querySelector('.signUp')







//selecting the signup button

document.querySelector(".sign-up-button").addEventListener("click", function(){




  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //defining the form values

    const email = signupForm.email.value
    const password = signupForm.password.value
    const username =  signupForm.username.value

    //creating account

     createUserWithEmailAndPassword(auth, email, password)
      .then(cred => {
        var created = 0 //tracks the account creation
        console.log('user created:', cred.user)

        //display account creation block

        document.querySelector('.pending-creation').style.display = 'block'
        
        
        //create the user object
        createUserDocument().then(asPromised)
        //create the globalBubble
        addChat().then(asPromised)

        
        


        function asPromised(){

          created++
          console.log(created)

          //both the account and the global bubble has been created
          if(created == 2){
            signupForm.reset();
            window.location.replace("index.html")
            
          }

        }

        //create the user object and add it to firebase
        
       async function createUserDocument(){
          //make a new document named the user's id
          const colAccount = doc(db, 'accounts', cred.user.uid)
          
          
          var user = {
            name: username,
            bio: "This person has not set up yet",
            localBubbles: ["New Person Joined: "+ username],
            profilePic : "https://archive.org/download/twitter-default-pfp/e.png",
            uid: cred.user.uid,
            theme: "rgb(69,69,165)"

            
          }


         

          let thePromise = await setDoc(colAccount, {User: user})
          return thePromise
       
      }
        
        
        
      
        

        
        //create a global join bubble for the user
        
        async function addChat(){
          //get the globalChat document from Firestore

          const globalChat = doc(db, 'globalBubble', 'bubbles')
          const globalChatBubbles =  await getDoc(globalChat)
          const globalChatBubblesData = globalChatBubbles.data()
          const gotGlobalChatBubbles = globalChatBubblesData.globalBubbles
          
        
        
        
          
          var joinChatBubble = {
            name: username,
            profilePic: "https://archive.org/download/twitter-default-pfp/e.png",
            globalBubbles: "New Person Joined: "+ username,
            uid: cred.user.uid
            
          }
        
          gotGlobalChatBubbles.push(joinChatBubble)

     
      
        
        let thePromise = await setDoc(globalChat, {globalBubbles: gotGlobalChatBubbles})
        return thePromise

          

          
        
        }
        console.log(addChat())
        console.log(createUserDocument())
        console.log(created)

        
        
        
        
        
      }).catch(err => {
        // console.log(err.message)

        //Show an error text on the site when the user gets an error
        
        //occurs when the user does not input @something.com
        if(err.message === "Firebase: Error (auth/invalid-email)."){

          document.querySelector(".authcheck").style.display = "block"
          document.querySelector(".authcheck").innerHTML = "Invalid Email"
        
        }
        //occurs when the user does not have a strong password
        if(err.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){

          document.querySelector(".authcheck").style.display = "block"
          document.querySelector(".authcheck").innerHTML = "Password Must Be At Least 6 Characters"
          

        }
        
        
        

      })



  })




  
})




