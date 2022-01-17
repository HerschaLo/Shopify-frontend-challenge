import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box, TextField} from '@mui/material'
import styled from '@emotion/styled'
import Header from '../components/header.js'
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from 'firebase/auth'
import {setDoc, getFirestore, doc, collection, getDocs } from 'firebase/firestore'
import getFirebase from '../components/firebaseConfig.js'
import {CookiesProvider, useCookies} from 'react-cookie'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles';

getFirebase()
const auth = getAuth()
const db = getFirestore()
const SignUpButton = styled.button`
  background-color:white;
  border-radius:40px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid #B6B6B6;
  padding:20px;
  cursor:pointer
`


const Login = ()=>{
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState('')

  const [cookies] = useCookies([])

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        window.location="/"
      }
    })
  })
  const googleSignUpHandler = async () =>{
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then(async (result)=>{
      const user = result.user
      console.log(cookies)
      let userData = {}

      userData['userName']=user.email.split("@")[0]
      let liked={}
      console.log(liked)
      
      Object.keys(cookies).forEach((picture)=>{
        liked[picture]=true
      })

      userData['likes']=liked
      await setDoc(doc(db, "users", email),userData)

      window.location='/'
    })
  }
  const emailSignUpHandler = async ()=>{
    if(password === passwordConfirm){
      let allUsers = await getDocs(collection(db, "users"))

      let isUserNameUnique = true
      allUsers.forEach((user)=>{
        let name=user.data().userName
        if(userName === name){
          isUserNameUnique = false
          setErrors('Username already taken')
        }
      })

      if(isUserNameUnique){
        createUserWithEmailAndPassword(auth, email, password)
        .then(async ()=>{
          console.log(cookies)
          let userData = {}

          userData['userName']=userName
          let liked={}
          console.log(liked)
          
          Object.keys(cookies).forEach((picture)=>{
            liked[picture]=true
          })

          userData['likes']=liked
          await setDoc(doc(db, "users", email),userData)

          window.location='/'
        })
        .catch((error)=>{
          console.log(error)
        })
      }
    }
    else{
      setErrors(`Passwords don't match`)
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <Helmet>
          <title>Signup</title>
        </Helmet>
        <Box style={{display:"flex", alignItems:'center', flexDirection:"column", rowGap:"40px"}}>
          <Header currentPage="Signup"/>
          <Typography variant="h2">Sign up</Typography>
          <TextField label="Username" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
          <TextField label="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          <TextField label="Password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          <TextField label="Confirm Password" type="password" value={passwordConfirm} onChange={(e)=>{setPasswordConfirm(e.target.value)}}/>
          
          {errors?
            <Typography style={{color:"red"}}>{errors}</Typography>
            :
            null
          }
          <SignUpButton onClick={emailSignUpHandler}><Typography>Sign up with email and password</Typography></SignUpButton>
          <SignUpButton onClick={googleSignUpHandler}><Typography>Sign up with Google</Typography></SignUpButton>
        </Box>
      </CookiesProvider>
    </ThemeProvider>
  )
}

export default Login