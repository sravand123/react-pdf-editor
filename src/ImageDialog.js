import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {  makeStyles, Switch } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import * as  Jimp from 'jimp/browser/lib/jimp';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));
export default function ImageDialog(props) {

    const [files, setFiles] = useState([]);
    const classes = useStyles();

    const [open, setOpen] = React.useState(props.dialogMode);
    const [image, setImage] = React.useState(null);
    const [preview, setPreview] = React.useState(null);
    const [transparent, setTransparent] = useState(false);
    const [color, setColor] = useState(null);

    useEffect(() => {
        setOpen(props.dialogMode);
    }, [props])
    const handleClose = () => {
        setOpen(false);
        props.setSelectedImage(null);
        props.setDialogMode(false);

    };

    const handleFileChange = (e) => {
       
        if (e.target.files.length > 0){
            let file = e.target.files[0];
            if(file.type=="image/jpeg"){
                Jimp.read(URL.createObjectURL(file)).then(function (image) {
    
                    image.quality(60)                 // set JPEG quality
                        .getBuffer(Jimp.MIME_PNG, function (err, src) {
                            let pngFile  = new File([src],file.name);
                            setFiles([...files, { normal: URL.createObjectURL(pngFile), tansparent: null }]);
                          
                        });
                });
            }
            else
            setFiles([...files, { normal: URL.createObjectURL(e.target.files[0]), tansparent: null }]);
        }
    }
    const handleTransparentChange = () => {
        if (image != null)
           { setTransparent(!transparent);
            setPreview(files[image].normal);
            setColor(null);
        }
        

    }
    const handleConvert = (img, red, green, blue, alpha) => {
        Jimp.read(files[img].normal).then(function (image) {

            image.quality(60)                 // set JPEG quality
                .greyscale()                 // set greyscale
                .contrast(1)
                .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {


                    let r = image.bitmap.data[idx + 0]
                    let g = image.bitmap.data[idx + 1]
                    let b = image.bitmap.data[idx + 2]
                    let a = image.bitmap.data[idx + 3]
                    if (r == 0 && g == 0 && b == 0) {
                        image.bitmap.data[idx + 0] = red;
                        image.bitmap.data[idx + 1] = green;
                        image.bitmap.data[idx + 2] = blue;
                    }
                    if (r == 255 && g == 255 && b == 255) {

                        image.bitmap.data[idx + 3] = alpha;
                    }


                }).getBuffer(Jimp.MIME_PNG, function (err, src) {
                    let file  = new File([src],'preview.png');
                    
                    setPreview(URL.createObjectURL(file));
                });
        });

    }
    const jpgToPng = (file)=>{
        if(file.type=="image/jpeg"){
            Jimp.read(URL.createObjectURL(file)).then(function (image) {

                image.quality(100)                 // set JPEG quality
                    .greyscale()                 // set greyscale
                    .contrast(1)
                    .getBuffer(Jimp.MIME_PNG, function (err, src) {
                        let File  = new File([src],file.name);
                        (URL.createObjectURL(File));
                      
                    });
            });
        }
    }
    const onSelect = () => {
        props.onImageSelect(preview);
        props.setSelectedImage(preview);
        setOpen(false);

    }
    const handleColorChange = (e) => {
        let alpha = 255;
        if (transparent == true) alpha = 0;
        if (image != null) {
            setColor(e.target.id);

            if (e.target.id == "black")
                (handleConvert(image, 0, 0, 0, alpha));
            if (e.target.id == "red")
                (handleConvert(image, 255, 0, 0, alpha));
            if (e.target.id == "green")
                (handleConvert(image, 0, 150, 0, alpha));
            if (e.target.id == "blue")
                (handleConvert(image, 0, 0, 255, alpha));
        }
    }
    const imageStyleActive = {
        width: '200px', height: '100px', border: '10px solid #0d47a1', borderRadius: '10px'
    };
    const imageStyle = {
        width: '200px', height: '100px'
    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
             {files.length==0?(<DialogTitle id="form-dialog-title"> Please Upload your signature 
</DialogTitle>):(<DialogTitle id="form-dialog-title"> Choose your Signature 
</DialogTitle>)}   
                <DialogContent>
                  
                    <div className={classes.root}>
                        <GridList className={classes.gridList} cols={2.5}>
                            {files.map((el, id) => {
                                return (
                                    <GridListTile onClick={(e) => { setImage(id); setTransparent(false); setColor(null); setPreview(files[id].normal); }} style={(image == id ? imageStyleActive : imageStyle)} id={id} key={id}>
                                        <img src={el.normal} width={200} height={100}></img>
                                    </GridListTile>)

                            })}


                        </GridList>
                    </div>
                    {(files.length!=0 && preview!=null) ?(
                    <div>

                        <div>
                            <span><DialogContentText>Transparent</DialogContentText></span>
                            <Switch
                                checked={transparent}
                                onChange={handleTransparentChange}
                                color="primary"
                                name="transparent"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </div>
                        <div id="black" onClick={handleColorChange} style={{ display: 'inline-block', margin: '10px', backgroundColor: 'black', width: '30px', height: '30px', borderRadius: '30px', border: '5px solid ' + ((color == 'black') ? ('#33b5e5') : ('white')) }}>
    
                        </div>
                        <div id="red" onClick={handleColorChange} style={{ display: 'inline-block', margin: '10px', backgroundColor: '#ff4444', width: '30px', height: '30px', borderRadius: '30px', border: '5px solid ' + ((color == 'red') ? ('#33b5e5') : ('white')) }}>
    
                        </div>
                        <div id="blue" onClick={handleColorChange} style={{ display: 'inline-block', margin: '10px', backgroundColor: '#0d47a1', width: '30px', height: '30px', borderRadius: '30px', border: '5px solid ' + ((color == 'blue') ? ('#33b5e5') : ('white')) }}>
    
                        </div>
                        <div id="green" onClick={handleColorChange} style={{ display: 'inline-block', margin: '10px', backgroundColor: '#00C851', width: '30px', height: '30px', borderRadius: '30px', border: '5px solid ' + ((color == 'green') ? ('#33b5e5') : ('white')) }}>
    
                        </div>
                        {preview == null ? (<div></div>) : (<img src={preview} width={200} height={100}></img>)}
                    </div>):( <div></div> )}

                </DialogContent>
                <DialogActions>

                    <input onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" />

                    <label htmlFor="icon-button-file">
                        <Button color="primary" variant="contained" component="span">Upload</Button>
                    </label>
                   {(files.length==0 || preview==null)?(<div></div>):(<Button color="primary" variant="contained" onClick={onSelect}>Select</Button>
)}

                </DialogActions>
            </Dialog>
        </div>
    );
}
