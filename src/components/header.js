import React, {useRef, useEffect} from 'react';
import {Typography,Paper, Grid} from '@mui/material'
import styled from '@emotion/styled'
import {Home, QuestionMark, ThumbUp, AccountCircle} from '@mui/icons-material';
const StyledNavSection = styled.div`
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    column-gap:10px;
    transition:background-color 0.25s ease-in-out;
    border-left:1px solid black;
    border-top:1px solid black;
    &:hover{
      background-color:#B7B7B7;
      cursor:pointer;
    }
`
const Header = (props)=>{
  let homePageRef = useRef(null)
  let randomRef = useRef(null)
  let likedRef = useRef(null)
  let signupRef = useRef(null)
  let loginRef = useRef(null)
  const profileRef = useRef(null)
  useEffect(()=>{

    const highlightCurPage = (section)=>{
      section.current.style.backgroundColor="#939493"
    }
      if(props.currentPage==="Home" && !window.location.search){
        highlightCurPage(homePageRef)
      }
      else if(props.currentPage==="Random"){
        highlightCurPage(randomRef)
      }
      else if(props.currentPage==='Liked'){
        highlightCurPage(likedRef)
      }
      
      else if(props.currentPage==='Signup'){
        highlightCurPage(signupRef)
      }

      else if(props.currentPage==='Login'){
        highlightCurPage(loginRef)
      }

      else if(props.currentPage==='Profile'){
        highlightCurPage(profileRef)
      }
      }, [])
    return (
      <Paper elevation={10}>
        <Grid container style={{width:"100vw", height:"100%"}}>
          <Grid item md={6} xs={12}>
            <Typography variant="h1">Spacestagram</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid container columns={18} style={{height:"100%"}}>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={homePageRef} onClick={()=>{window.location="/"}}>
                  <Home/>
                  <Typography variant="h4">Home</Typography>
                </StyledNavSection>
              </Grid>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={randomRef} onClick={()=>{window.location="/random"}}>
                  <QuestionMark />
                  <Typography variant="h4">Random</Typography>
                </StyledNavSection>
              </Grid>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={likedRef} onClick={()=>{window.location="/liked"}}>
                  <ThumbUp/>
                  <Typography variant="h4">Liked</Typography>
                </StyledNavSection>
              </Grid>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={profileRef} onClick={()=>{window.location="/profile"}}>
                  <AccountCircle />
                  <Typography variant="h4">Profile</Typography>
                </StyledNavSection>
              </Grid>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={signupRef} onClick={()=>{window.location="/signup"}}>
                  <Typography variant="h4">Sign up</Typography>
                </StyledNavSection>
              </Grid>
              <Grid item md={3} xs={6}>
                <StyledNavSection ref={loginRef} onClick={()=>{window.location="/login"}}>
                  <Typography variant="h4">Login</Typography>
                </StyledNavSection>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
}

export default Header