console.log("hello from settings.js")


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




onAuthStateChanged(auth, (user) => {

    const userPersonalization = doc(db, 'accounts', user.uid)
    
    
    

    
    var gotUserPersonalizationData;
    
    var backgrounds = document.querySelectorAll(".pallete")
    var newTheme;

    fetchData().then(loadDefaultSettings)


    async function changeTheme() {



      
      console.log(gotUserPersonalizationData)
      console.log(newTheme)
      console.log("1")
       
      
        gotUserPersonalizationData.theme = newTheme
      

      
      

      

      let thePromise = await setDoc(userPersonalization, {User: gotUserPersonalizationData})
      return thePromise




    }
    



    async function fetchData(){

    var userPersonalizationData =  await getDoc(userPersonalization)
    userPersonalizationData = userPersonalizationData.data()
    gotUserPersonalizationData = userPersonalizationData.User
    return gotUserPersonalizationData

    
    }


    async function changeCustomization(){
      var newProfile = document.querySelector(".newProfile")
      var newUser = document.querySelector(".newUser")
      var newBio = document.querySelector(".newBio")

      console.log(gotUserPersonalizationData)

      gotUserPersonalizationData.profilePic = newProfile.value
      gotUserPersonalizationData.name = newUser.value
      gotUserPersonalizationData.bio = newBio.value


      let thePromise = await setDoc(userPersonalization, {User: gotUserPersonalizationData})
      return thePromise
      
      


    }

    async function loadDefaultSettings(){
      var backgrounds = document.querySelectorAll(".background-theme")
      var textThemes = document.querySelectorAll(".text-theme")
      document.querySelector(".currentProfile").src = gotUserPersonalizationData.profilePic
      document.querySelector(".currentUser").innerHTML = gotUserPersonalizationData.name



      backgrounds.forEach(function(background){


          background.style.backgroundColor = gotUserPersonalizationData.theme
          


      })
            
    
        
      textThemes.forEach(function(textTheme){

          textTheme.style.color = gotUserPersonalizationData.theme
          


      })






    }




    function readyToSubmit() {

      
        window.location.replace("index.html")
      


    }

    console.log(gotUserPersonalizationData)


    document.querySelector(".button1").addEventListener("click", function(){

      
      document.querySelector('.pending').style.display = 'block'
      
     
      changeCustomization().then(readyToSubmit)









    })

    backgrounds.forEach(function(background){


            background.addEventListener("click", function(){

              newTheme = background.name

                
                changeTheme().then(readyToSubmit)






            })
  
    })
    
})

