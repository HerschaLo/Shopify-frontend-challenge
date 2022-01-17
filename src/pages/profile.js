import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box, TextField, Button} from '@mui/material'
import Header from '../components/header.js'
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
import {getDoc, getDocs, getFirestore, doc, updateDoc, collection} from 'firebase/firestore'
import getFirebase from '../components/firebaseConfig.js'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles'

getFirebase()
const auth = getAuth()
const db = getFirestore()


const Login = ()=>{
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    onAuthStateChanged(auth, async (user)=>{
      if(user){
        let userDoc = await getDoc(doc(db, "users", user.email))
        
        let userData = userDoc.data()
        setUserName(userData.userName)
        setEmail(user.email)
      }
      else{
        window.location="/login"
      }
    })
  },[])

  const changeUserName = async ()=>{
    let usersData = await getDocs(collection(db, "users"))

    let isUserNameUnique = true

    usersData.forEach((doc)=>{
      const docEmail = doc.id
      if(doc.data().userName === userName && email!==docEmail){
        isUserNameUnique = false
      }
    })

    if(isUserNameUnique){
      updateDoc(doc(db, "users", email),{
        userName:userName
      })
    }
    else{
      setError('Username is already taken')
    }
  }
  return(
    <ThemeProvider theme={theme}>
      <Box>
        <Helmet>
          <title>Profile</title>
        </Helmet>
        <Header currentPage="Profile"/>
        <Box style={{display:"flex",justifyContent:"center", width:"100vw"}}>
          <Box style={{  display:"flex", flexDirection:"column", alignItems:"center", rowGap:"35px"}}>
            <Typography variant="h2">Profile</Typography>
            <Box style={{display:"flex", rowGap:"25px", flexDirection:"column"}}>
              <Typography><span style={{fontWeight:"bold"}}>Email: </span>{email}</Typography>
              <Box style={{display:"flex", alignItems:"center", columnGap:"10px"}}>
                <Typography style={{fontWeight:"bold"}}>Username:</Typography>
                <TextField 
                value={userName} onChange={(e)=>{
                  if(e.target.value.length<150){
                    setUserName(e.target.value)
                  }
                  setError('')
                }}/>
                <Button onClick={changeUserName}>
                  Save
                </Button>
              </Box>
              <Typography style={{color:"red"}}>{error}</Typography>
              <Button style={{color:'red'}}
              onClick={()=>{
                signOut(auth)
                window.location="/login"
              }}
              >Sign out</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Login