import React, {useState, useEffect, useRef} from 'react';
import {Typography, Grid, Box, Paper, TextField, Button} from '@mui/material'
import {Share, ThumbUp, Close} from '@mui/icons-material';
import {useCookies} from 'react-cookie'
import { getFirestore, setDoc, doc, getDocs, collection, getDoc,} from 'firebase/firestore'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import getFirebase from '../components/firebaseConfig.js'

getFirebase()
const db = getFirestore()
const auth = getAuth()

const Comment = (props)=>{
  return(
    <Box style={{display:"flex", columnGap:"25px"}}>
      <Typography style={{fontWeight:"bold"}}>{props.commentUserName}</Typography>
      <Typography style={{width:"75px"}}>{props.commentText}</Typography>
    </Box>
  )
}
const PictureOfTheDay = (props)=>{
    const [liked, setLiked] = useState(false)
    const [cookies, setCookie] = useCookies([])
    const [isCommenting, setIsCommenting] = useState(false)
    const [commentValue, setCommentValue] = useState('')
    const [hasAccount, setHasAccount] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [comments, setComments] = useState([])
    const [popupText, setPopupText] = useState('')

    const likeButton = useRef(null)

    const {explanation, title, date, imgLink, isLiked} = props
    console.log(props)

    useEffect(()=>{
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setHasAccount(true)
          setUserEmail(user.email)
        }
        else{
          setUserEmail('none')
        }
      })
    },[])

    useEffect(async ()=>{
      if(userEmail){
        console.log(isLiked)
        console.log(date)

        if(cookies[date]==='true' && userEmail!='none'|| isLiked){
          setLiked(true)
          likeButton.current.style.color="#30cf51"
        }

        let comments = await getDocs(collection(db, "pictures", date, "comments"))

        if(comments){
          let counter=0
          let limit=0
          let commentsCopy = []

          comments.forEach(()=>{
            limit+=1
          })


          console.log(comments)
          comments.forEach(async (comment)=>{
            let commentsJSON = comment.data()

            let userData = await getDoc(doc(db, "users", commentsJSON.email))
            
            const commentUserName = userData.data().userName
            const commentText = commentsJSON['comment']
            
            commentsCopy.push(
              <Comment commentText={commentText} commentUserName={commentUserName}/>
            )
            counter+=1
            if(counter==limit||counter==7 && !window.location.search){
              setComments(commentsCopy)
            }
          })
        }
      }
    },[userEmail])

    const handleLikeClick = async ()=>{
      let update = {likes:{}}

      update['likes'][date] = !liked

      if(hasAccount){
        await setDoc(doc(db, "users", userEmail),update, {merge:true})
        .catch((error)=>{
          console.log(error)
        })
      }

      else{
        setCookie(date, `${!liked}`, {
          expires: new Date(2100, 1, 1),
          path:"/"
        })
      }

      if(!liked){
        likeButton.current.style.color="#30cf51"
      }
      
      else{
        likeButton.current.style.color="black"
      }

      console.log(!liked)
      setLiked(!liked)
    }

    const handleAddComment = async ()=>{
      if(userEmail!='none'){
        let commentData = {}
        commentData['email'] = userEmail
        commentData['comment'] = commentValue

        setIsCommenting(false)
        setCommentValue('')
        
        let commentsCopy = [...comments]

        let userData = await getDoc(doc(db, "users", userEmail))

        let userName = userData.data().userName
        commentsCopy.unshift(<Comment commentText={commentValue} commentUserName={userName}/>)
        setComments(commentsCopy)
        setDoc(doc(collection(doc(db, "pictures", date), "comments")), commentData)
      }
    }

    const checkUserAuth =()=>{
      if(userEmail!='none'){

        if(!isCommenting){
          setIsCommenting(true)
        }

        else{
          setIsCommenting(false)
        }

        }
        else{
          setPopupText(<Typography align="center">You need an account to comment. You can 
          sign up <a href={`/signup`}>here</a>.</Typography>)
        }
    }

    if(!userEmail){
      return(<Box>

      </Box>)
    }

    return (
      <Grid item xs={8} style={{marginBottom:"30px", display:"flex", justifyContent:'center'}} >

        {popupText? 
        <Box style={{position:"fixed", top:0, left:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:2, width:"100vw", height:"100vh", backgroundColor:"rgba(0,0,0,0.3)"}}>
          <Box style={{backgroundColor:"white", width:"25vw", borderRadius:"15px", padding:"15px"}}>
            
            <Box style={{display:"flex", paddingRight:"10px", width:"100%", justifyContent:"flex-end"}}>
              <Close onClick={()=>{setPopupText('')}} style={{cursor:"pointer"}}/>
            </Box>

            {popupText}
          </Box>
        </Box>
        :
        null
        }
        <Paper elevation={10} style={{borderRadius:"15px", padding:"20px",display:"flex", flexDirection:"column",marginTop:"20px"}}>
          <Typography variant="h3">{title}</Typography>
          
          <object data={imgLink} style={{maxWidth:"64vw"}}/>
          
          <Typography variant="caption">{date}</Typography>
          
          <Box>
            <ThumbUp 
            ref={likeButton}
            style={{cursor:"pointer", marginTop:"20px", marginRight:"25px"}}
            onClick={handleLikeClick}
            />
            <Share style={{cursor:"pointer"}} onClick={()=>{
              setPopupText(<Typography align="center">Here's a link to share this picture with your friends!
              <br />          
              <a href={`/individual-picture?date=${date}`}>{window.location.hostname+`/individual-picture?date=${date}`}</a></Typography>)
            }}/>
          </Box>
          <Typography style={{marginTop:"15px"}}>{explanation}</Typography>
         
          <Box style={{marginTop:"25px", display:"flex", flexDirection:"column", rowGap:"15px"}}>
            {comments}
          </Box>

         <Typography>
           <a href={`/individual-picture?date=${date}`}>View all comments</a>
         </Typography>

          <Button 
          onClick={checkUserAuth}
          >Add a Comment</Button>
          {isCommenting ? 
            <Box style={{width:"100%"}}>
              <TextField value={commentValue} 
              multiline
              style={{width:"100%"}}
              onChange={(e)=>{
                if(e.target.value.length<2000){
                  setCommentValue(e.target.value)
                }
              }}/>
              <br />
              <Button onClick={handleAddComment}>Submit</Button>
            </Box>
            :
            null
          }
        </Paper>  
      </Grid>
    )
}

export default PictureOfTheDay