import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box, TextField} from '@mui/material'
import styled from '@emotion/styled'
import Header from '../components/header.js'
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from 'firebase/auth'
import {getDoc, getFirestore, doc, setDoc} from 'firebase/firestore'
import getFirebase from '../components/firebaseConfig.js'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles'
import {CookiesProvider, useCookies} from 'react-cookie'
getFirebase()
const auth = getAuth()
const db = getFirestore()
const SignInButton = styled.button`
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
  const [cookies] = useCookies([])
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        window.location="/"
      }
    })
  },[])
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <Box>
          <Helmet>
            <title>Login</title>
          </Helmet>
          <Header currentPage="Login"/>
          <Box style={{display:"flex", alignItems:'center', flexDirection:"column", rowGap:"40px"}}>
            <Typography variant="h2">Login</Typography>
            <TextField label="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <TextField label="Password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <SignInButton onClick={
              ()=>{
                signInWithEmailAndPassword(auth, email, password)
                .catch((errors)=>{
                  console.log(errors)
                })
              }
            }><Typography>Login with email and password</Typography></SignInButton>
            <SignInButton onClick={()=>{
              const provider = new GoogleAuthProvider()
                signInWithPopup(auth, provider)
                  .then(async (result)=>{
                    const user = result.user
                    let userDoc = await getDoc(doc(db, "users", user.email))
                    console.log(userDoc.data())
                    
                    if(typeof userDoc.data() === 'undefined'){
                      console.log(cookies)
                      let userData = {}
                
                      userData['userName']=user.email.split("@")[0]
                      let liked={}
                      console.log(liked)
                      
                      Object.keys(cookies).forEach((picture)=>{
                        liked[picture]=true
                      })
                
                      userData['likes']=liked
                      await setDoc(doc(db, "users", user.email),userData)
                
                      window.location='/'
                    }
                  })
            }}><Typography>Login with Google</Typography></SignInButton>
          </Box>
        </Box>
      </ThemeProvider>
    </CookiesProvider>
  )
}

export default Login