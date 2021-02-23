import React, { useRef, useEffect, useState } from 'react'
import { Rnd } from "react-rnd";
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Input,Menu } from '@material-ui/core';
import FormatBoldOutlinedIcon from '@material-ui/icons/FormatBoldOutlined';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
export default function DraggableInput(props) {

    const RndRef = useRef(null);
    const btnRef = useRef(null);
    const [x, setX] = useState(props.x);
    const [y, setY] = useState(props.y);
    const [text, setText] = useState(props.text);
    const [fontSize, setFontSize] = useState(20);
    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);
    const [bold, setBold] = useState('unset');
    const [italic, setItalic] = useState('unset');
    const handleClose = () => {
        setMouseX(null);
        setMouseY(null);
    };

    const setWidth = () => {
        let ctx = props.canvasRef.current.getContext('2d');
        var fontArgs = ctx.font.split(' ');
        var newSize = fontSize + 'px';

        ctx.font = newSize + ' ' + fontArgs[fontArgs.length - 1];
        if (italic == "italic") ctx.font = "italic " + ctx.font;
        if (bold == "bold") ctx.font = "bold " + ctx.font;

        RndRef.current.style.width = Math.max(200, (ctx.measureText(RndRef.current.value).width) + 10) + 'px';
    }
    useEffect(() => {
        if (text == '')
            RndRef.current.focus();

        setText(props.text);
        setX(props.x);
        setY(props.y);
        setBold(props.fontWeight);
        setItalic(props.fontStyle);
        setFontSize(props.fontSize);
        //  setFontSize(props.fontSize);
        setWidth();

    }, [props]);


    const handleClick = (event) => {

        event.preventDefault();
        setMouseX(event.clientX - 2)
        setMouseY(event.clientY - 2)


    };



    const focus = () => {

        var inp = RndRef.current;
        inp.style.border = "3px solid skyblue";
        inp.style.marginLeft = "0px";
        inp.style.marginTop = "0px";


    }
    const handleChange = (e) => {
        setText(e.target.value);
        props.inputChange(props.id, e.target.value)
    }
    const handleClickAway = (e) => {
        if (e.target.id == "imp") {
            var inp = RndRef.current;
            inp.style.border = "none";
            if (RndRef.current.value == '') props.inputDelete(props.id);
            inp.style.marginLeft = "3px";
            inp.style.marginTop = "3px";
        }
    }
    const handleKeyDown = (e) => {
        if (e.keyCode == 8) {
            handleChange(e);
            setWidth();
        }
    }


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Rnd id="imp"
                position={{ x: x, y: y }}
                onDragStop={(e, d) => {
                    props.positionChange(props.id, d);
                    setX(d.x);
                    setY(d.y);
                }}
                bounds={".page__" + props.pageNum}
                enableResizing="disable"
            >
                <input id="imp" spellCheck="false" autoComplete="off" onKeyDown={handleKeyDown} onContextMenu={handleClick} onChange={handleChange} value={text} onFocus={focus} type="text" ref={RndRef} style={{
                    backgroundColor: 'transparent', border: '3px  solid skyblue', borderRadius: '5px' ,
                    outline: 'none', width: '200px', height: 'auto', fontSize: fontSize + 'px', fontFamily: 'Helvetica, sans-serif', fontStyle: italic, fontWeight: bold, padding:'0px 0px 0px 0px'
                }}
                    onKeyPress={setWidth}  >

                </input>

                <Menu
                    keepMounted
                    open={mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        mouseY !== null && mouseX !== null
                            ? { top: mouseY, left: mouseX }
                            : null
                    }
                >
                    <MenuItem onClick={() => { props.inputDelete(props.id) }} ><DeleteOutlineIcon></DeleteOutlineIcon></MenuItem>
                    <MenuItem onClick={() => {
                        if (bold == 'unset') {
                            setBold('bold');
                            props.handleFontChange(props.id, fontSize, 'bold', italic);
                        }
                        else {
                            setBold('unset');
                            props.handleFontChange(props.id, fontSize, 'unset', italic);

                        }

                    }} ><FormatBoldOutlinedIcon color={bold == 'bold' ? ('action') : ('disabled')}></FormatBoldOutlinedIcon></MenuItem>
                    <MenuItem onClick={() => {
                        if (italic == 'unset') {
                            setItalic('italic');
                            props.handleFontChange(props.id, fontSize, bold, 'italic');
                            setWidth();

                        }
                        else {
                            setItalic('unset');
                            props.handleFontChange(props.id, fontSize, bold, 'unset');
                            setWidth();

                        }

                    }} ><FormatItalicIcon color={italic == 'italic' ? ('action') : ('disabled')}></FormatItalicIcon></MenuItem>
                    <MenuItem    >
                        <Input value={fontSize} onChange={(e) => {
                            setFontSize(e.target.value); props.handleFontChange(props.id, e.target.value, bold, italic);setWidth();
                        }} style={{ width: '50px' }} type='number'></Input></MenuItem>

                </Menu>
            </Rnd>
        </ClickAwayListener>

    )

}