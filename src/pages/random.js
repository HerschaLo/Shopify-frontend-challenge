import React, {useState} from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box, Paper,  Button} from '@mui/material'
import Header from '../components/header.js'
import PictureDisplay from '../components/pictureDisplay.js'
import {CookiesProvider} from 'react-cookie'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles'
const RandomPictures= ()=>{
  const [updateCount, setUpdateCount] = useState(0)
    return (
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <Helmet>
            <title>Random</title>
          </Helmet>
          <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
            <Header currentPage="Random"/>
            <Typography variant="h2" style={{marginBottom:"25px"}}>Random Pictures</Typography>
            <Paper elevation={7}>
              <Button onClick={()=>{setUpdateCount(updateCount+1)}} style={{borderRadius:"15px"}}>Get new picture</Button>
            </Paper>
            <PictureDisplay key={updateCount} query="https://api.nasa.gov/planetary/apod?api_key=YhaJ1mHsDSLT0BoB0cKr1bCKEIvdYxfKuYb03wWW&count=1"/>
          </Box>  
        </CookiesProvider>
      </ThemeProvider>
    )
}

export default RandomPictures