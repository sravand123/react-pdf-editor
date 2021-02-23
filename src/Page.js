import React, { useRef, useEffect, useState } from 'react'
import DraggableInput from './DraggableInput';
import DraggableImage from './DraggableImage';


export default function Page(props) {

    const divRef = useRef(null);
    const canvasRef = useRef(null);
    const [id, setId] = useState(0);
    const [scale, setScale] = useState(props.scale);
    const [inputList, setInputList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [imageId, setImageId] = useState(0);
    const [fontSize, setFontSize] = useState(20);
   const [selectedImage,setSelectedImage] = useState(props.selectedImage);


    useEffect(() => {
        setScale(props.scale);
        var viewport = props.page.getViewport({ scale: props.scale });
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        divRef.current.style.width = viewport.width + 'px';
        divRef.current.style.height = viewport.height + 'px';
        var renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        props.page.render(renderContext);
        let inpList = inputList;

        inpList.forEach((el, ind) => {
            inpList[ind].x = (inpList[ind].x * props.scale) / (inpList[ind].scale);
            inpList[ind].y = (inpList[ind].y * props.scale) / (inpList[ind].scale);
            inpList[ind].fontSize = Math.floor((inpList[ind].fontSize * props.scale) / (inpList[ind].scale));

            inpList[ind].scale = props.scale;
        })
        setInputList(inpList);
        props.inputListChange(props.pageNum,inpList);

        let imgList = imageList;
        imgList.forEach((el, ind) => {
            imgList[ind].x = (imgList[ind].x * props.scale) / (imgList[ind].scale);
            imgList[ind].y = (imgList[ind].y * props.scale) / (imgList[ind].scale);
            imgList[ind].width = (imgList[ind].width * props.scale) / (imgList[ind].scale);
            imgList[ind].height = (imgList[ind].height * props.scale) / (imgList[ind].scale);
            imgList[ind].scale = props.scale;
        })
        setImageList(imgList);
        props.imageListChange(props.pageNum,imgList);



    }, [props.scale]);
    useEffect(()=>{ 
        setFontSize(props.fontSize);
    },[props.fontSize])
    useEffect(()=>{ 
        setSelectedImage(props.selectedImage);
    },[props.selectedImage])
    const addInput = (e) => {
        setId(id + 1);
        let List = [...inputList, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, text: '', id: id, scale: props.scale,fontSize:20,fontStyle:'unset',fontWeight:'unset' }];
        setInputList(List);
        props.inputListChange(props.pageNum,List);

    }
   
    const inputChange = (id, txt) => {
        let inpList = inputList;

        inpList.forEach((val, ind) => {
            if (val.id == id) {
                inpList[ind].text = txt;
            }
        })
        setInputList(inpList);
        props.inputListChange(props.pageNum,inpList);

    }
    const inputDelete = (id) => {
        let inpList = inputList;
        inpList = inpList.filter((el) => (el.id != id));

        setInputList(inpList);
        props.inputListChange(props.pageNum,inpList);

    }
    const positionChange = (id, d) => {
        let inpList = inputList;

        inpList.forEach((val, ind) => {
            if (val.id == id) {
                inpList[ind].x = d.x;
                inpList[ind].y = d.y;
                inpList[ind].scale = props.scale;


            }
        })
        setInputList(inpList);
        props.inputListChange(props.pageNum,inpList);

    }
    const addImage = (e) => {
        setImageId(imageId + 1);
        let List = [...imageList, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, id: imageId, width: 100, height: 80, scale: props.scale }];
        setImageList(List);
        props.imageListChange(props.pageNum,List);

    }
    const imageDelete = (id) => {
        let imgList = imageList;
        imgList = imgList.filter((el) => (el.id != id));
        setImageList(imgList);
        props.imageListChange(props.pageNum,imgList);

        
    }
    const handleClick = (e) => {
        if (props.mode == "text")
            addInput(e);
        else if (props.mode == "sign") {
            if(selectedImage!=null){
                addImage(e);
                props.changeMode("none");
            }
           
        }


    }
    const imageDataChange = (id, data) => {
        let imgList = imageList;


        imgList.forEach((val, ind) => {
            if (val.id == id) {
                imgList[ind] = data;
                imgList[ind].scale = props.scale;
            }
        })
        setImageList(imgList);
        props.imageListChange(props.pageNum,imgList);

    }

    const handleFontChange =(id,fontSize,fontWeight,fontStyle)=>{
        let inpList = inputList;

        inpList.forEach((val, ind) => {
            if (val.id == id) {
                inpList[ind].fontSize = fontSize;
                inpList[ind].fontStyle = fontStyle;
                inpList[ind].fontWeight = fontWeight;

            }
        })
        setInputList(inpList);
    }
    return (
        <React.Fragment>
            <div ref={divRef} id="imp" style={{ position: 'relative', marginLeft: 'auto', marginRight: 'auto' ,boxShadow:'0 6px 6px rgba(0,0,0,0.2)', paddingBottom:'5px' }}>
                <canvas id="imp" onClick={handleClick} className={"page__" + props.pageNum} ref={canvasRef} />
                {
                    Array.from(
                        new Array(inputList.length),
                        (e, i) => (
                            (<DraggableInput key={inputList[i].id}
                              id={inputList[i].id} x={inputList[i].x} y={inputList[i].y} handleFontChange={handleFontChange} 
                              text={inputList[i].text} canvasRef={canvasRef} positionChange={positionChange} 
                              inputChange={inputChange} fontSize={inputList[i].fontSize} 
                              fontStyle={inputList[i].fontStyle} fontWeight={inputList[i].fontWeight}
                              inputDelete={inputDelete} pageNum={props.pageNum} />)

                        ))
                }
                {
                    Array.from(
                        new Array(imageList.length),
                        (e, i) => (
                            (<DraggableImage key={imageList[i].id} imageData={imageList[i]} imageDataChange={imageDataChange}
                               selectedImage={props.selectedImage}  imageDelete={imageDelete} pageNum={props.pageNum} />)

                        ))
                }
            </div>
        </React.Fragment>
    )
}

