import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, makeStyles, Switch } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import img1 from './blueSig.png'
import img2 from './mySig.jpeg'
import img3 from './signature.png'
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
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
export default function ImageDialog() {

    const [files, setFiles] = useState([]);
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [preview,setPreview] = React.useState(null);
    const [transparent, setTransparent] = useState(false);
    const [color, setColor] = useState(null);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleFileChange = (e) => {
        if (e.target.files.length > 0)
            setFiles([...files, { normal: URL.createObjectURL(e.target.files[0]), tansparent: null }]);
    }
    const handleTransparentChange = () => {
        if(image!=null)
        setTransparent(!transparent);
        setColor(null);
        setPreview(null);

    }
    const handleConvert = (img,red,green,blue,alpha) => {
        Jimp.read(files[img].normal).then(function (image) {

            image.quality(100)                 // set JPEG quality
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


                }).getBase64(Jimp.MIME_PNG, function (err, src) {
                    //setFiles([...files, (src)]);
                     setPreview(src);
                });
        });

    }
    const handleColorChange= (e)=>{
        let alpha = 255;
        if(transparent==true)alpha = 0;
        if( image!=null){
            setColor(e.target.id);
           
            if(e.target.id=="black")
            (handleConvert(image,0,0,0,alpha));
            if(e.target.id=="red")
            (handleConvert(image,255,0,0,alpha));
            if(e.target.id=="green")
            (handleConvert(image,0,150,0,alpha));
            if(e.target.id=="blue")
            (handleConvert(image,0,0,255,alpha));
        }
    }
    const imageStyleActive = {
        width: '200px', height: '100px',border:'10px solid #0d47a1',borderRadius:'10px'
    };
    const imageStyle={
        width: '200px', height: '100px'
    }
    return (
        <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open form dialog
      </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Singatures</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose your signature image to sign on the document
          </DialogContentText>
                    <div className={classes.root}>
                        <GridList className={classes.gridList} cols={2.5}>
                            {files.map((el, id) => {
                                return (
                                    <GridListTile onClick={(e) => { setImage(id);setTransparent(false);setColor(null);setPreview(null) }} style={(image==id? imageStyleActive:imageStyle )} id={id} key={id}>
                                        <img src={el.normal} width={200} height={100}></img>
                                    </GridListTile>)

                            })}


                        </GridList>
                    </div>
                    <div>
                        <Switch
                            checked={transparent}
                            onChange={handleTransparentChange}
                            color="primary"
                            name="transparent"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </div>
                    <div id="black" onClick={handleColorChange} style={{ display: 'inline-block',margin:'10px' , backgroundColor: 'black', width: '30px', height: '30px', borderRadius: '30px', border:'5px solid '+((color=='black')? ('#33b5e5'):('white')) }}>

                    </div>
                    <div id="red"  onClick={handleColorChange} style={{ display: 'inline-block',margin:'10px' , backgroundColor: '#ff4444', width: '30px', height: '30px', borderRadius: '30px', border:'5px solid '+((color=='red')? ('#33b5e5'):('white')) }}>

                    </div>
                    <div id="blue" onClick={handleColorChange} style={{ display: 'inline-block', margin:'10px' ,backgroundColor: '#0d47a1', width: '30px', height: '30px', borderRadius: '30px', border:'5px solid '+((color=='blue')? ('#33b5e5'):('white')) }}>

                    </div>
                    <div id="green" onClick={handleColorChange} style={{ display: 'inline-block', margin:'10px' , backgroundColor: '#00C851', width: '30px', height: '30px', borderRadius: '30px', border:'5px solid '+((color=='green')? ('#33b5e5'):('white')) }}>

                    </div>
                    {preview==null ? (<div></div>):( <img src={preview} width={200} height={100}></img>)} 
                   
                </DialogContent>
                <DialogActions>

                    <input onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" />

                    <label htmlFor="icon-button-file">
                       <Button color ="primary" variant="contained" component="span">Upload</Button>
                    </label>
                    <Button color="primary" variant="contained">Select</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}
