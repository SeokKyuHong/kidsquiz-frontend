import React from 'react'
import Button from '@mui/material/Button';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const ImageBundle = ({ showimage, setShowimage, setShowimagePuzzle}) => {
    function imageshowlist(){

        if (showimage === false) {
          setShowimage(true)
          setShowimagePuzzle(false)
        }
        else {
          setShowimage(false)
        }
       }
  return (
    <Button 
        key="image"
        type='button' 
        className="navBtn"
        name='imageaddeee' 
        onClick={imageshowlist}><ImageSearchIcon/></Button>
  )
}

export default ImageBundle