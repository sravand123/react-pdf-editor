import React, { useRef, useState } from 'react';
import './Test.css';
import Canvas from './Canvas';
import { PDFDocument, StandardFonts, rgb, scale } from 'pdf-lib'
import Signature from './signature.png';

export default function Test(props) {
  const [numPages, setNumPages] = useState(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [pdf,setpdf] = useState(props.pdf);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const  divRef = useRef(null);
  const move = (e) => {
   /* async function modify(){
      const pngImageBytes = await fetch(Signature).then(res=>{
      
        return res.arrayBuffer();
      });

    const expdfBytes = await fetch(props.pdf).then((res)=>{
        return res.arrayBuffer();
      })
      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.load(expdfBytes);
  
  
      // Embed the JPG image bytes and PNG image bytes
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
  
  
  
      // Get the width/height of the PNG image scaled down to 50% of its original size
      const pngDims = pngImage.scale(0.2)
  
      const page = await pdfDoc.getPage(0)
    
      console.log(e.nativeEvent.offsetY);
  
      // Draw the PNG image near the lower right corner of the JPG image
      page.drawImage(pngImage, {
        x: (e.nativeEvent.offsetX)/(0.8),
        y: (page.getHeight()*0.8-e.nativeEvent.offsetY)/(0.8),
        width: pngDims.width,
        height: pngDims.height,
      })
  
      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      setpdf(pdfBytes);
    } 
    modify();*/
  }
  
  return (
    <React.Fragment  >
      <div style={{ height: '10vh' }}>

      </div>
      <div className="hello2" style={{ maxHeight: '90vh', overflow: 'scroll', maxWidth: '80%' , backgroundColor:'lightgray',textAlign:'center'}}>
        <Canvas   onClick={move} pdf={pdf}> 

      </Canvas>
       
      </div>
      {/* <p>{x},{y}</p> */}
    </React.Fragment>

  );
}