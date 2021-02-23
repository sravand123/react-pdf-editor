import React, { useEffect, useRef, useState } from 'react';
import Page from './Page';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Button, ButtonGroup, Input, MenuItem, Select } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as  fileDownload from 'js-file-download';
import { PDFDocument, StandardFonts, rgb, scale } from 'pdf-lib'
import ImageDialog from './ImageDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'
import { GetApp, ZoomIn, ZoomOut, TextFields, InsertPhoto, Backup, TramRounded } from '@material-ui/icons';


export default function Pdf(props) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const [scale, setScale] = useState(1.5);
    const [pages, setPages] = useState([]);
    const [mode, setMode] = useState('none');
    const [name, setName] = useState('sample.pdf')

    const [pdf, setPdf] = useState(null);
    const [inputList, setInputList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [dialogMode, setDialogMode] = useState(false);
    const [modified, setModifed] = useState(false);

    useEffect(() => {
        setPages([]);
        let pdfPages = [];
        const loadingTask = pdfjsLib.getDocument(props.pdf);
        loadingTask.promise.then(function (pdf) {
            for (let i = 0; i < pdf.numPages; i++) {
                pdf.getPage(i + 1).then(page => {
                    pdfPages = [...pdfPages, page]
                    if (pdfPages.length == pdf.numPages) {
                        setPages(pdfPages);
                    }
                })
            }
        });

        setPdf(props.pdf);


    }, [props]);

    const onImageSelect = (image) => {
        setDialogMode(false);
        if (image == null) {
            setMode('none');
            setSelectedImage(image);
        }
    }
    const openImageDialog = () => {
        setDialogMode(true);
    }

    const inputListChange = (pageNum, inpList) => {
        let List = inputList;
        List[pageNum] = inpList;
        setInputList(List);
    }
    const imageListChange = (pageNum, imgList) => {
        let List = imageList;
        List[pageNum] = imgList;
        setImageList(List);
    }
    const changeMode = (mode) => {
        setMode(mode);
    }
    const sign = () => {
        async function modifyPdf() {
            let existingPdfBytes;
            if (props.pdf == pdf)
                existingPdfBytes = await fetch(pdf).then(res => res.arrayBuffer())
            else existingPdfBytes = pdf;
            const pdfDoc = await PDFDocument.load(existingPdfBytes,{ignoreEncryption:true})

            const Helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const HelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const HelveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)
            const HelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)


            const pages = pdfDoc.getPages()
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                let { width, height } = page.getSize();
                if (i < inputList.length) {
                    for (let j = 0; j < inputList[i].length; j++) {
                        let x = inputList[i][j].x;
                        let y = inputList[i][j].y;
                        let scale = inputList[i][j].scale;
                        let fontSize = inputList[i][j].fontSize;
                        let text = inputList[i][j].text;
                        let fontStyle = inputList[i][j].fontStyle;
                        let fontWeight = inputList[i][j].fontWeight;

                        let font = Helvetica;
                        if (fontWeight == 'bold' && fontStyle == 'italic') {
                            font = HelveticaBoldOblique;
                        }

                        else if (fontStyle == 'italic') font = HelveticaOblique;
                        else if (fontWeight == "bold") font = HelveticaBold;

                        x = x / (scale) + 3;
                        y = height - y / (scale) - parseInt(fontSize) / (scale) - 3 +scale;

                        page.drawText(text, {
                            x: x,
                            y: y,
                            size: parseInt(fontSize)/(scale),
                            font: font
                        })

                    }
                }
                if (selectedImage != null) {

                    const pngImageBytes = await fetch(selectedImage).then(res => {

                        return res.arrayBuffer();
                    });
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    if (i < imageList.length) {
                        for (let j = 0; j < imageList[i].length; j++) {
                            let image = imageList[i][j];
                            page.drawImage(pngImage, {
                                x: image.x / (image.scale),
                                y: height - ((image.y + image.height) / (image.scale)),
                                width: (image.width / image.scale),
                                height: (image.height / image.scale)
                            })
                        }
                    }
                }



            }


            const pdfBytes = await pdfDoc.save();
            let file = new File([pdfBytes], 'modify.pdf')
            props.handleFileChange(URL.createObjectURL(file));
            if (!modified) {
                setName("modified_" + name);
                setModifed(true);
            }

        }
        modifyPdf();
    }
    const Download = () => {
        async function modifyPdf() {
            const pdfBytes = await (await fetch(pdf)).arrayBuffer();
            fileDownload(pdfBytes, name);
        }
        modifyPdf();
    }
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            props.handleFileChange(URL.createObjectURL(e.target.files[0]));
            setName(e.target.files[0].name);
        }
    }
    return (

        <React.Fragment  >

            <div style={{ width: '100%', textAlign: 'center' }}>
                <ImageDialog setSelectedImage={setSelectedImage} setDialogMode={setDialogMode} onImageSelect={onImageSelect} dialogMode={dialogMode}></ImageDialog>

                <div style={{ height: '10vh', display: 'flex', flexDirection: 'row', backgroundColor: grey[100] }}>
                    <div style={{ fontFamily: 'sans-serif', margin: '10px', alignSelf: 'flex-start' }}>{name}
                        <input onChange={handleFileChange} accept="pdf" style={{ display: 'none' }} id="file-upload" type="file" />
                        <label htmlFor="file-upload">
                            <Button color="primary" variant="contained" style={{ marginLeft: '10px' }} component="span"><Backup></Backup></Button>
                        </label>
                    </div>
                    <div style={{ marginLeft: 'auto', marginTop: '8px' }}>

                        <ButtonGroup color="primary" variant="contained" aria-label="outlined secondary button group" >

                            <Button onClick={sign}><FontAwesomeIcon icon={faFileSignature} /></Button>
                            <Button onClick={Download}><GetApp></GetApp></Button>

                            <Button onClick={() => { setScale(scale + 0.1) }}><ZoomIn></ZoomIn></Button>
                            <Button onClick={() => { setScale(scale - 0.1) }}><ZoomOut></ZoomOut></Button>
                            <Button onClick={() => { setMode("text") }}><TextFields></TextFields></Button>
                            <Button onClick={() => { setMode("sign"); openImageDialog() }}><InsertPhoto></InsertPhoto></Button>

                        </ButtonGroup>
                    </div>

                </div>
                <div style={{ height: '90vh', maxHeight: '90vh', overflow: 'scroll', backgroundColor: grey[100] }}>



                    <div >

                        {

                            Array.from(
                                new Array(pages.length),
                                (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        page={pages[index]}
                                        scale={scale}
                                        pageNum={index}
                                        mode={mode}
                                        changeMode={changeMode}
                                        inputListChange={inputListChange}
                                        imageListChange={imageListChange}
                                        selectedImage={selectedImage}
                                    />
                                ),
                            )
                        }
                    </div>

                </div>

            </div>

        </React.Fragment>

    );
}