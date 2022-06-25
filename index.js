




console.log("hello from index.js")


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


    



    console.log('user status changed:', user.email)


    //get the user local documents
    // const userBubbles = doc(db, 'accounts', user.uid)
    const globalBubbles = doc(db, 'globalBubble', 'bubbles')
    const onlineUsers = doc(db, 'online', 'users')
    // //get the user profile info
    // const  userStuff = doc(db, 'online', 'users')
    const userPersonalization = doc(db, 'accounts', user.uid)


    var gotUserPersonalizationData; //got the user object
    var usingUserPersonalizationData; //using the user object(mainly to delete and splice)
    var chatText; //save the inputs in the chatbox
    var gotOtherChatBubbles; //the globalChat bubbles
    var joinBubbleLength = 0; //the globalBubbles the user joined with in the begginning
    var currentOnlineUsers = 0; //the online users the user joined with in the beginning
    
    // var gotGlobalChatData;

    fetchData()
    
    //get the user object
    async function fetchData(){

      var userPersonalizationData =  await getDoc(userPersonalization)
      userPersonalizationData = userPersonalizationData.data()
      gotUserPersonalizationData = userPersonalizationData.User
      usingUserPersonalizationData = userPersonalizationData.User
      return gotUserPersonalizationData
      
  
      
    }

    
    //load based on the user object's theme
    async function loadDefaultSettings(){

      console.log(gotUserPersonalizationData)
      
      var backgrounds = document.querySelectorAll(".background-theme")
      
      

      //make all the current colored elements based on the user's theme

      backgrounds.forEach(function(background){

          console.log(gotUserPersonalizationData.theme)
          background.style.backgroundColor = gotUserPersonalizationData.theme
          


      })
            
    
        
      



  
  
  
    }
    //add a chat bubble based on the user's input
    async function addLocalBubble(){
     
      

        bubbling(gotUserPersonalizationData.profilePic, gotUserPersonalizationData.name, chatText)
        gotUserPersonalizationData.localBubbles.push(chatText)

        console.log(gotUserPersonalizationData)
        
      



      

      let thePromise = await setDoc(userPersonalization, {User: gotUserPersonalizationData})
      return thePromise
   
  }

  //add the chat bubble to the global database of chat bubbles

  async function addGlobalBubble(){

    var joinChatBubble = {
      name: gotUserPersonalizationData.name,
      profilePic: gotUserPersonalizationData.profilePic,
      globalBubbles: chatText,
      uid: user.uid
      
    }

    //add the chat bubble along with the other bubbles

     gotOtherChatBubbles.push(joinChatBubble)
    console.log(gotOtherChatBubbles)

    let thePromise = await setDoc(globalBubbles, {globalBubbles: gotOtherChatBubbles})
    return thePromise





  }

  

  
  //LIVE
  
  onSnapshot(globalBubbles, (doc) => {

    // document.getElementById("viewport").reload
    //fetch the global chat bubbles from the database
    var otherChatBubbles = doc.data().globalBubbles
    gotOtherChatBubbles = otherChatBubbles
    

    compareBubbles()

    
    
    function compareBubbles(){
        for(var i = joinBubbleLength; i<otherChatBubbles.length; i++){

          joinBubbleLength = otherChatBubbles.length+1
          fetchData()

          // the global chat bubble matches the local bubble based on id so give it a local chat bubble

          if((usingUserPersonalizationData.localBubbles[0] == otherChatBubbles[i].globalBubbles) && (usingUserPersonalizationData.uid == otherChatBubbles[i].uid)){

            bubbling(otherChatBubbles[i].profilePic, otherChatBubbles[i].name, otherChatBubbles[i].globalBubbles)
            usingUserPersonalizationData.localBubbles.shift()
                            
          }else {
            globalChat(otherChatBubbles[i].profilePic, otherChatBubbles[i].name, otherChatBubbles[i].globalBubbles)
          }
      }





    }
    
    //at the end of fetching the data, load the themes
    loadDefaultSettings()

    document.querySelector('.generate').addEventListener('click', function(){

      chatText = document.querySelector(".text-box").value //save the input text value
      console.log(otherChatBubbles)
  
      //add the input to the globalBubble and add it to the array of the user's local bubbles
      fetchData().then(addLocalBubble).then(addGlobalBubble)


  
  
  
    })






  })

  onSnapshot(onlineUsers, (doc) => {

    //grab the onlineUsers document

    var gotOnlineUsers = doc.data().onlineUsers
    console.log(gotOnlineUsers)


    //put all the current users on to the sidebar
    for(var i = currentOnlineUsers; i < gotOnlineUsers.length; i++){
      currentOnlineUsers = gotOnlineUsers.length+1



      online(gotOnlineUsers[i].profilePic, gotOnlineUsers[i].name, gotOnlineUsers[i].bio)











    }

    //the user clicked the logout icon

    document.querySelector('.logout-button').addEventListener('click', function(){



      
      signOut(auth).then(() => {
          

        removeOnlineUser().then(reDirect)
          
        //remove the user from the online array 
        async function removeOnlineUser(){
          console.log(gotOnlineUsers + 'current user') 
            //search for the user
            for(var i = 0; i < gotOnlineUsers.length; i++){

                //the user id matches the id of the profile
                if(gotOnlineUsers[i].uid == user.uid){
                  gotOnlineUsers.splice(i, 1)
                  console.log(gotOnlineUsers + 'removed user')

                let thePromise = await setDoc(onlineUsers, {onlineUsers: gotOnlineUsers})
                return thePromise
                  


                }

            }

          }

          //when the user has been signed out AND removed from the online array this will run
          function reDirect(){

            window.location.replace('login.html')


          }




      })






    })




  })

  







})





