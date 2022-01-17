import React, {useState,} from 'react';
import { Helmet } from 'react-helmet'
import {Typography, Box} from '@mui/material'
import styled from '@emotion/styled'
import Header from '../components/header.js'
import PictureDisplay from '../components/pictureDisplay.js'
import {CookiesProvider} from 'react-cookie'
import {ArrowBackIos, ArrowForwardIos} from '@mui/icons-material';
import theme from '../components/theme.js'
import { ThemeProvider } from '@mui/material/styles';
const AdjustMonthButton = styled.button`
  background-color:white;
  border:0px solid white;
  display:flex;
  align-items:center;
  cursor:pointer
`
const HomePage = ()=>{
  const currentDate = new Date()
  const [month, setMonth] = useState((currentDate.getMonth()+1).toString())
  const [day, setDay] = useState(currentDate.getDate().toString())
  const [year, setYear] = useState(currentDate.getFullYear().toString())

  const currentDateString = `${year}-${month}-${day}`
  const monthBeginningString = `${year}-${month}-1`
  let query=`https://api.nasa.gov/planetary/apod?api_key=YhaJ1mHsDSLT0BoB0cKr1bCKEIvdYxfKuYb03wWW&start_date=${monthBeginningString}&end_date=${currentDateString}`
  
  const goBackMonth = ()=>{
    let newMonth = parseInt(month)-1

    console.log(newMonth)
    if(newMonth == 0){
      let newYear = (parseInt(year)-1).toString()
      let daysInMonth = new Date(parseInt(newYear), newMonth, 0).getDate()
      
      setDay(daysInMonth)
      setMonth('12')
      setYear(newYear)
    }
    else{
      let daysInMonth = new Date(parseInt(year), newMonth, 0).getDate()
      
      setDay(daysInMonth)
      setMonth(newMonth.toString())
    }
  }

  const goForwardMonth = ()=>{

    let newMonth = parseInt(month)+1

    if(newMonth==13){
      newMonth=1
      let newYear = (parseInt(year)+1).toString()
      let daysInMonth = new Date(parseInt(newYear), newMonth, 0).getDate()
      
      if(newYear == new Date().getFullYear() && newMonth == new Date().getMonth()+1){
        daysInMonth = new Date().getDate()
      }

      setMonth('1')
      setYear(newYear)
      setDay(daysInMonth)

    }

    else{
      let daysInMonth = new Date(parseInt(year), newMonth, 0).getDate()
      
      setDay(daysInMonth)
      setMonth(newMonth.toString())
    }

  }

  let monthName
  switch(month){
    case '1':
      monthName="January"
      break
    case '2':
      monthName="February"
      break
    case '3':
      monthName="March"
      break
    case '4':
      monthName="April"
      break
    case '5':
      monthName="May"
      break
    case '6':
      monthName="June"
      break
    case '7':
      monthName="July"
      break
    case '8':
      monthName="August"
      break
    case '9':
      monthName="September"
      break
    case '10':
      monthName="October"
      break
    case '11':
      monthName="November"
      break
    case '12':
      monthName="December"
      break
  }
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <Helmet>
          <title>Spacestagram</title>
        </Helmet>
        <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
          <Header currentPage="Home"/>
          <Typography variant="h2">{monthName} {year}</Typography>
          <Box style={{display:"flex", justifyContent:"space-between", width:"40vw"}}>
            <AdjustMonthButton onClick={goBackMonth}>
              <ArrowBackIos /> Previous Month
            </AdjustMonthButton>
              { year+month !== currentDate.getFullYear().toString()+(currentDate.getMonth()+1).toString()? 
                <AdjustMonthButton onClick={goForwardMonth}>
                  Next Month <ArrowForwardIos /> 
                </AdjustMonthButton>
                :
                null
              }
            </Box>
          <PictureDisplay key={month} query={query} />
        </Box>  
      </CookiesProvider>
    </ThemeProvider>
  )
}

export default HomePage