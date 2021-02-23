import React, { useState } from 'react'
import Canvas from './Canvas'
import Test from './Test'
import samplePDF from './sravan_cv.pdf'
import Pdf from './Pdf'
import ImageDialog from './ImageDialog';

function App() {
  
  const [pdf,setPdf]= useState(samplePDF);
  const handleFileChange =(pdf)=>{
    setPdf(pdf);
  }
  return <Pdf pdf = {pdf} handleFileChange = {handleFileChange} ></Pdf>
 //return <ImageDialog></ImageDialog>
}

export default App
