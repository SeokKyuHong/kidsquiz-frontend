import './css/Canvas.css';
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { v1 as uuid } from 'uuid'
import { emitModify, emitAdd, emitAddP, modifyObj, addObj, addPObj, emitDelete, deleteObj,emitClear,clearObj
  ,emitAddImage, addimageObj } from './socket'
import axios from 'axios'
import ScrollContainer from 'react-indiana-drag-scroll'

//석규
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Quiz from './Quiz'

let imagearrayData =[]

function Canvas() {
  const [canvas, setCanvas] = useState('');
  const [widthvalue,setWidthvalue] = useState(1);
  const [colorvalue,setColorvalue] = useState('#000000');
  // const [imageURL,setimageURL] = useState('');
  const [show,setShow] = useState(false);
  const [showimage, setShowimage] = useState(false);
  const [tempimageURL, settempimageURL] = useState('');

  const drawmode = () => {
    if (canvas.isDrawingMode === true){
      canvas.isDrawingMode = false
      setShow(false)
    }
    else {
      canvas.isDrawingMode = true
      setShow(true)
    }
  }

const bringimageinhtml = (event) => {
  let url = event.currentTarget.src;
  addImage(url)
}



   const bringimage = async() =>{

    const config = {
      method: 'get',
      url: '/api/material',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`

      },
  };
  await axios(config)
                
  .then(response => {
      let arrayData = response.data.Puzzle
      imagearrayData = arrayData.map((a,i) => {
        return a.image
      });
      // settempimageURL(response.data);
  }).catch(error => {
      console.error(error);
  })

   }  


   function imageshowlist(){

    if (showimage === false) {
      setShowimage(true)

    }
    else {
      setShowimage(false)
    }
   }


  // var pencil;
  // pencil = new fabric.PencilBrush(canvas);
  // canvas.freeDrawingBrush = pencil;

  const erasemode = () => {
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = parseInt(widthvalue)
  }

  const pencilmode = () => {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = parseInt(widthvalue);
  }


  const changeWidth = (e) =>{
    setWidthvalue(e.target.value);
    canvas.freeDrawingBrush.width = parseInt(widthvalue);

  }


  const changeColor = (e) =>{
    setColorvalue(e.target.value);
    canvas.freeDrawingBrush.color = colorvalue;
    canvas.renderAll()

  }

  const initCanvas = () =>
     new fabric.Canvas('canv', {
       isDrawingMode: false,
       height: 1920,
       width: 1080,
     })


  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    bringimage()
  })

  useEffect(
    () => {
      if (canvas) {
        canvas.on('object:modified', function (options) {
          if (options.target) {
            const modifiedObj = {
              obj: options.target,
              id: options.target.id,
            }
            emitModify(modifiedObj)

          }
        })

        canvas.on('object:moving', function (options) {
          if (options.target) {
            const modifiedObj = {
              obj: options.target,
              id: options.target.id,
            }
            emitModify(modifiedObj)
          }
        })

        canvas.on('path:created', function (options){
          if (options.path) {
            options.path.set({id: uuid()})
  
            const addedPath = {
              path: options.path,
              id: options.path.id,
            }
            emitAddP(addedPath)

          }
        })


        modifyObj(canvas)
        addObj(canvas)
        deleteObj(canvas)
        clearObj(canvas)
        addPObj(canvas)
        addimageObj(canvas)
      }
    },
    [canvas]
  )


  const addImage = (imageURL)=> {
    let object
    fabric.Image.fromURL(imageURL, function(Image){
      Image.scale(0.4);
      object = Image
      object.set({id: uuid()})
      canvas.add(object);
      emitAddImage({url: imageURL, id: object.id})
      canvas.renderAll()
    })
  }

  // const addImage = ()=> {
  //   let object
  //   fabric.Image.fromURL(imageURL, function(Image){
  //     Image.scale(0.4);
  //     object = Image
  //     object.set({id: uuid()})
  //     canvas.add(object);
  //     emitAddImage({url: imageURL, id: object.id})
  //     canvas.renderAll()
  //   })
  // }

  const addShape = (e) => {
    let type = e.target.name;
    let object

    if (type === 'rectangle') {
      object = new fabric.Rect({
        fill : colorvalue,
        height: 75,
        width: 150,
      });

    } else if (type === 'triangle') {
      object = new fabric.Triangle({
        fill : colorvalue,
        width: 100,
        height: 100,
      })

    } else if (type === 'circle') {
      object = new fabric.Circle({
        fill : colorvalue,
        radius: 50,
      })
    }
    object.set({id: uuid()})
    canvas.add(object)
    canvas.renderAll()
    emitAdd({obj: object, id: object.id})

  };
  const deleteObject = () => {
    let object;
    object = canvas.getActiveObject()
    canvas.remove(canvas.getActiveObject());
    emitDelete({obj: object, id: object.id})
  }
  const clearCanvas = () => {
    canvas.clear();
    emitClear(1);
  }

  const addTangram = () => {
    
    let object

    object = new fabric.Triangle({
      width : 300,
      height : 150,
      fill : 'red',
      angle : 90,
      left : 300,
      top :200,
    })

    object.set({id: uuid()})
    canvas.add(object)
    emitAdd({obj: object, id: object.id})

    object = new fabric.Triangle({
      width : 300,
      height : 150,
      fill : 'green',
      left : 150,
      top : 350,
    })
    object.set({id: uuid()})
    canvas.add(object)

    emitAdd({obj: object, id: object.id})

    object = new fabric.Triangle({
      width : 150,
      height : 75,
      fill : 'yellow',
      left : 375,
      top : 500,
      angle : -90,
    })
    object.set({id: uuid()})
    canvas.add(object)

    emitAdd({obj: object, id: object.id})

    object = new fabric.Triangle({
      width : 150,
      height : 75,
      fill : 'orange',
      left : 375,
      top : 350,
      angle : 180,
    })
    object.set({id: uuid()})
    canvas.add(object)
  
    emitAdd({obj: object, id: object.id})

    object = new fabric.Triangle({
      width : 212,
      height : 106,
      fill : 'orange',
      left : 375,
      top : 123,
      angle : 45,
    })
    object.set({id: uuid()})
    canvas.add(object)
    emitAdd({obj: object, id: object.id})

    object = new fabric.Rect({
      width : 106,
      height : 106,
      fill : 'purple',
      left : 375,
      top : 275,
      angle : 45,
    })
    object.set({id: uuid()})
    canvas.add(object)
    emitAdd({obj: object, id: object.id})

    object = new fabric.Rect({
      width : 150,
      height : 75,
      fill : 'blue',
      skewX : 45,
      left : 150,
      top : 200,
      angle : 0,
    })
    object.set({id: uuid()})
    canvas.add(object)
    emitAdd({obj: object, id: object.id})
  }

  return (
    <div className='App'>
      <div>
      <ButtonGroup 
        variant="contained" 
        aria-label="outlined primary button group"
        size='small'>
        <Button 
          key="Square"
          type='button' 
          className="navBtn"
          name='circle' 
          onClick={addShape}> 원 🟢 </Button>

        <Button 
          key = "Triangle"
          type='button' 
          className="navBtn"
          name='triangle' 
          onClick={addShape}> 삼각형 🔺</Button>

        <Button 
          key="Rectangle"
          type='button' 
          className="navBtn"
          name='rectangle' 
          onClick={addShape}>사각형 🟦 </Button>
        <Button 
          key="delete"
          type='button' 
          className="navBtn"
          name='delete' 
          onClick={deleteObject}> 지우기 </Button>
        <Button 
          key="clear"
          type='button' 
          className="navBtn"
          name='clear' 
          onClick={clearCanvas}>새 도화지 </Button>
        <Button 
          key="addTangram"
          type='button' 
          className="navBtn"
          name='addTangram' 
          onClick={addTangram}>칠교</Button>
        <Button 
          key="on/off(draw)"
          type='button' 
          className="navBtn"
          name='on/off(draw)' 
          onClick={drawmode}> 그리기/도형</Button>
        <Button 
          key="erase"
          type='button' 
          className="navBtn"
          name='imageadd' 
          onClick={erasemode}> 지우개</Button>     

        <Button 
          key="pencil"
          type='button' 
          className="navBtn"
          name='imageadd' 
          onClick={pencilmode}> 연필</Button>

        <Button 
          key="imageee"
          type='button' 
          className="navBtn"
          name='imageaddeee' 
          onClick={imageshowlist}> 이미지</Button>  

        <input 
          key="color"
          type='color' 
          className='color' 
          onChange={changeColor}
          defaultValue="#000000" 
          id="drawing-color"></input>

      
      </ButtonGroup>

      {/* <span className='info'>{widthvalue}</span> */}
      {show && <input type="range" onChange={changeWidth} defaultValue ={widthvalue} min="1" max="150"></input>}

      {/* <input type='url' style={{alignItems: 'center', margin : 'auto', display : 'flex', justifyContent : 'center'}} 
        onChange={(e)=>{setimageURL(e.target.value); console.log(e.target.value);}}></input>
        <button onClick={addImage}>버튼</button> */}

      </div>

      {showimage && <div>
        <ScrollContainer className="scroll-container" activationDistance = "10">
            <ul className="list">
        {
        imagearrayData.map((a) => {
          return <li className="item">
          <a className="link" >
              <img className="image" src={a} onClick = {bringimageinhtml}></img>
          </a>
      </li>
        })}
        </ul>
        </ScrollContainer>
      </div>}
      

      <Quiz></Quiz>
      <div>
        <canvas id="canv" />
      </div>
    </div>
  );
}

export default Canvas;