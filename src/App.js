import React, { useState } from 'react'
import samplePDF from './sample.pdf'
import Pdf from './Pdf'

function App() {
  
  const [pdf,setPdf]= useState(samplePDF);
  const handleFileChange =(pdf)=>{
    setPdf(pdf);
  }
  return <Pdf pdf = {pdf} handleFileChange = {handleFileChange} ></Pdf>
}

export default App
