import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'
import {Box} from '@mui/material'
import Header from '../components/header.js'
import PictureDisplay from '../components/pictureDisplay.js'
import {CookiesProvider} from 'react-cookie'
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles';
const SinglePicture = ()=>{
  const [isDoneLoading, setIsDoneLoading] = useState(false) //When deploying to Netlify, window is undefined during the server-side build process
                                                            //To circumvent this I can only use window after all the components are mounted
  useEffect(()=>{
    setIsDoneLoading(true)
  },[])

  if(isDoneLoading){
    let search=window.location.search.split("=")[1]
    console.log(search)
    let query=`https://api.nasa.gov/planetary/apod?api_key=YhaJ1mHsDSLT0BoB0cKr1bCKEIvdYxfKuYb03wWW&date=${search}`

    return (
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <Helmet>
            <title>Spacestagram</title>
          </Helmet>
          <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
            <Header />
            <PictureDisplay query={query} />
          </Box>  
        </CookiesProvider>
      </ThemeProvider>
    )
  }
  return(
    <Box>

    </Box>
  )
}

export default SinglePicture