console.log("hello from login.js")


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

  //selecting the login form
  const loginForm = document.querySelector(".login")
  
  

  
 
  


  //logging the user in


  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value
    
    
    

    signInWithEmailAndPassword(auth, email, password)
      .then(cred => {
        console.log('user logged in:'+ cred.user)
        console.log(cred.user.uid)
        var created = 0 //track the logging in data
        loginForm.reset()
        
        addOnline().then(asPromised)
        

        function asPromised(){

          created++
          console.log(created)

          //the user has logged in and the user has their personal data has been added to the onlineUsers document

          if(created == 1){
            
            loginForm.reset()
            window.location.replace("index.html")
            
          }

        }


        async function addOnline(){

          //select the onlineUser document in Firebase and fetch it's data

          const onlineUser = doc(db, 'online', 'users')
          const onlineUsers =  await getDoc(onlineUser)
          const onlineUsersData = onlineUsers.data()
          const gotOnlineUserData = onlineUsersData.onlineUsers
          console.log(gotOnlineUserData)

          //select the user's own document and fetch it's data
          const currentUser = doc(db, 'accounts', cred.user.uid)
          var currentUserData = await getDoc(currentUser)
          currentUserData = currentUserData.data()
          const gotCurrentUserData = currentUserData.User
          //add the current user's data to the beginning of the online array
          gotOnlineUserData.unshift(gotCurrentUserData)
          
          //save the data on Firebase
          let thePromise = await setDoc(onlineUser, {onlineUsers: gotOnlineUserData})
          

          return thePromise



          


        }





        
      })
      .catch(err => {
        console.log(err.message)
        


        //the user inputed an email without @gmail.com
        
        if(err.message == "Firebase: Error (auth/invalid-email)." ){
          document.querySelector(".authcheck").style.display = "block"
          document.querySelector(".authcheck").innerHTML = "Invalid Email"
        }

        //the password does not match the email
        if(err.message == "Firebase: Error (auth/wrong-password)."){
          document.querySelector(".authcheck").style.display = "block"
          document.querySelector(".authcheck").innerHTML = "Incorrect Password"
          


        }
        // the account does not exist

        if(err.message == "Firebase: Error (auth/user-not-found)."){
          document.querySelector(".authcheck").style.display = "block"
          document.querySelector(".authcheck").innerHTML = "User Does Not Exist"
        }
        

      })
  })


onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})
