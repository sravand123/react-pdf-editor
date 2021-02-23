import React, { useRef, useEffect, useState } from 'react'
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Rnd } from "react-rnd";
import { PDFDocument, StandardFonts, rgb, scale } from 'pdf-lib'
import './Canvas.css';
import Slider from '@material-ui/core/Slider';
import { TextField } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import sign from './signature.png';
const Canvas = props => {

  const { draw, ...rest } = props
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(props.pdf);
  const [value, setValue] = useState(10);
  const [x, setx] = useState(10);
  const [y, sety] = useState(10);
  const RndRef = useRef(null);
  const btnRef = useRef(null);
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [Imagewidth, setImageWidth] = useState(100);
  const [Imageheight, setImageHeight] = useState(80);


  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(pdf);

    loadingTask.promise.then(function (pdf) {


      pdf.getPage(1).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });
        var canvas = canvasRef.current;
        //  console.log(canvas.getBoundingClientRect());
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setWidth(viewport.width);
        setHeight(viewport.height);
        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);

      });

    });
  }, [pdf]);
  const embed = () => {
    var v = RndRef.current;
    var g = canvasRef.current;
    let y = (v.getBoundingClientRect().bottom - g.getBoundingClientRect().top);
    let x = (v.getBoundingClientRect().left - g.getBoundingClientRect().left);
    let existingPdfBytes;
    async function modifyPdf() {
      if (pdf == props.pdf) {
        existingPdfBytes = await fetch(pdf).then(res => res.arrayBuffer())
      }
      else {
        existingPdfBytes = pdf;
      }

      const pdfDoc = await PDFDocument.load(existingPdfBytes)

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      let { width, height } = firstPage.getSize();
      x = x / (1) + 5;
      y = (height * 1 - y) / (1) + 7;
      console.log(x, y);
      firstPage.drawText(v.value, {
        x: x,
        y: y,
        size: 20,
        lineHeight: 1
      })
      v.value = '';

      const pdfBytes = await pdfDoc.save();
      setPdf(pdfBytes);
    }
    modifyPdf();

  }



  return (
    <React.Fragment>

      <div style={{ position: 'relative' }}>
        <canvas className="hello1" ref={canvasRef} />
        <Rnd
          style={{ border: '1px  black', borderStyle: 'dashed' }}
          position={{ x: x, y: y }}
          onDragStop={(e, d) => {
            setx(d.x);
            sety(d.y);
          }}
          bounds=".hello1"
          onResizeStop={(e, direction, ref, delta, position) => {
            setx(position.x);
            sety(position.y);
            setImageWidth(Imagewidth + delta.width);

            setImageHeight(Imageheight + delta.height);
          }}
        >
          <div style={{ width: Imagewidth, height: Imageheight, border: '1px  black', borderStyle: 'dashed' }} >
            <img ref={imgRef} width={Imagewidth} height={Imageheight} draggable="false" src={sign}></img>

          </div>

        </Rnd>





      </div>


      {/* <Rnd
         
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position
            });
          }}
        >
          Rnd
      </Rnd> */}



    </React.Fragment>
  )
}

export default Canvas