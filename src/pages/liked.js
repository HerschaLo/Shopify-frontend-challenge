import React from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box} from '@mui/material'
import Header from '../components/header.js'
import PictureDisplay from '../components/pictureDisplay.js'
import {CookiesProvider} from 'react-cookie'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles';

const LikedPictures= ()=>{
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <Helmet>
          <title>Spacestagram</title>
        </Helmet>
        <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
          <Header currentPage="Liked Pictures" currentPage="Liked"/>
          <Typography variant="h2" style={{marginBottom:"25px"}}>Liked Pictures</Typography>
          <PictureDisplay filterByLikes={true} />
        </Box>  
      </CookiesProvider>
    </ThemeProvider>
  )
}

export default LikedPictures