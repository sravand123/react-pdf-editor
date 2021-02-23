import React, { useRef, useEffect, useState } from 'react'
import { Rnd } from "react-rnd";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { DeleteOutlined } from '@material-ui/icons';

const DraggableImage = props => {

  const imgRef = useRef(null);
  const [x, setx] = useState(props.imageData.x);
  const [y, sety] = useState(props.imageData.y);
  
  const [Imagewidth, setImageWidth] = useState(props.imageData.width);
  const [Imageheight, setImageHeight] = useState(props.imageData.height);
  const [open,setOpen] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [selectedImage,setSelectedImage] = useState(props.selectedImage);


  useEffect(()=>{
    setImageWidth(props.imageData.width);
    setImageHeight(props.imageData.height);
    setx(props.imageData.x);
    sety(props.imageData.y);
    setSelectedImage(props.selectedImage);

  },[props])
  const handleClick = (event) => {
    event.preventDefault();
    setMouseX(event.clientX - 2)
    setMouseY(event.clientY - 2)

  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };


  return (
    <React.Fragment>


      <Rnd
        size={{ width: Imagewidth+2,  height: Imageheight+2}}
        style={{ border: '1px  black', borderStyle: 'dashed' }}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => {
          props.imageDataChange(props.imageData.id, { x: d.x, y: d.y, width: Imagewidth, height: Imageheight, id: props.imageData.id })
          setx(d.x);
          sety(d.y);
        }}
        bounds={".page__" + props.pageNum}
        onResizeStop={(e, direction, ref, delta, position) => {
          props.imageDataChange(props.imageData.id, { x: position.x, y: position.y, width: Imagewidth + delta.width, height: Imageheight + delta.height, id: props.imageData.id })
          setx(position.x);
          sety(position.y);
          setImageWidth(Imagewidth + delta.width);

          setImageHeight(Imageheight + delta.height);
        }}
      >
        <div onContextMenu={handleClick} style={{ width: Imagewidth, cursor: 'context-menu', height: Imageheight }} >
          <img ref={imgRef} width={Imagewidth} height={Imageheight} draggable="false" src={selectedImage}></img>
        </div>
        <Menu
          keepMounted
          open={mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            mouseY !== null && mouseX !== null
              ? { top: mouseY, left: mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => { props.imageDelete(props.imageData.id);      setOpen(!open); }} ><DeleteOutlined></DeleteOutlined></MenuItem>

        </Menu>
      </Rnd>
      {/* <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog> */}
    </React.Fragment>
  )
}

export default DraggableImage