import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material'
import PictureOfTheDay from '../components/pictureOfTheDay.js'
import {useCookies} from 'react-cookie'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getDoc, getFirestore, doc} from 'firebase/firestore'
import getFirebase from '../components/firebaseConfig.js'
getFirebase()
const db = getFirestore()
const auth = getAuth()
const PictureDisplay = (props)=>{
  const [pictures, setPictures] = useState([])
  const query=props.query
  const [cookies] = useCookies([])
  const filterByLikes = props.filterByLikes

  console.log(cookies)
  useEffect(()=>{
      let picturesCopy = []
      let images
      let imageDates
      onAuthStateChanged(auth, async (user)=>{
        if(user){
          let userDoc = await getDoc(doc(db, "users", user.email))
          imageDates = Object.keys(userDoc.data()['likes'])
          images = userDoc.data()['likes']
        }

        else{
          imageDates = Object.keys(cookies)
          images = cookies
        }

        if(filterByLikes){
          let limit=0
          let counter=0
          
          console.log(cookies)
          console.log(images)
          Object.values(images).forEach((value)=>{
            if(value){
              limit+=1
            }
          })
          
          imageDates.forEach((imageDate)=>{
            if(images[imageDate]){
            
            fetch(`https://api.nasa.gov/planetary/apod?api_key=YhaJ1mHsDSLT0BoB0cKr1bCKEIvdYxfKuYb03wWW&date=${imageDate}`)
            
            .then(async (response)=>{

              console.log(response)
              let apiData = await response.json()
              
              console.log("response")
              console.log(apiData)
              picturesCopy.push([<PictureOfTheDay 
                imgLink={apiData.url} 
                date={apiData.date}
                isLiked={true}
                explanation={apiData.explanation} 
                title={apiData.title}/>, apiData.date])
                counter+=1

                if(counter==limit){
                  picturesCopy = picturesCopy.sort((a,b)=>new Date(a[1]).getTime()-new Date(b[1]).getTime()).reverse().map(entry => entry[0])
                  setPictures(picturesCopy)
                }
              })
            }
            })
        }

        else{
          fetch(query)
          .then(async (response)=>{
            let apiData = await response.json()
            console.log(apiData)
          
            let picturesCopy = []
            console.log(picturesCopy)
            
            if(!apiData.length){
              apiData = [apiData]
            }
            apiData.forEach((picture)=>{
              let isLiked = false

              if(images[picture.date]){
                isLiked = true
              }
                picturesCopy.push(
                  <PictureOfTheDay 
                  imgLink={picture.url} 
                  date={picture.date}
                  explanation={picture.explanation} 
                  title={picture.title}
                  isLiked={isLiked}
                  />
                )
            })
            setPictures(picturesCopy.reverse())
          })
        }
      })
  },[])
  console.log(pictures)
  return (
      <Grid container style={{display:"flex", justifyContent:"center"}}>
        {pictures}
      </Grid>
  )
}

export default PictureDisplay