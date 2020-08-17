import React, { useState, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { useSetup, useUpdates, useTeardown } from '../effects/useSanity';
import { black } from '../color';
import { ColorPicker } from './ColorPicker';
import './netstration-canvas.css';

const getPos = (ev, canvas) => {
  const { touches } = ev;
  const source = touches ? touches[0] : ev;
  return {
    x: source.pageX - canvas.offsetLeft,
    y: source.pageY - canvas.offsetTop
  };
};

const canvasToBlobAsync = async (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
};

const sendLabelOptions = [
  'SEND',
  'SHIP IT',
  'I\'M DONE',
  'PERFECT!',
  'SHARE',
  'GOOD ENOUGH',
  'MEH.',
  'FINISHED',
  'NEXT'
];


/** renders an html canvas and drawing controls */
/** emits an image buffer for capturing a bitmap */
export const NestrationCanvas = ({ onSubmit, disabled }) => {
  const [canvas, setCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(undefined);
  const [sendLabel, setSendLabel] = useState(null);
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState(black);

  const canvasRef = useCallback(c => {
    setCanvas(c);
  }, []);

  const onMouseDown = useCallback((e) => {
    var event = e || window.event;
    event.preventDefault();
    event.stopPropagation();

    setIsDrawing(true);
    const pos = getPos(e, canvas);
    // draw a dot
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x+0.5, pos.y+0.5);
    ctx.closePath();
    ctx.stroke();
    setLastPos(pos);
  }, [canvas]);

  const onMouseMove = useCallback((e) => {
    if (!isDrawing) return;
    const pos = getPos(e, canvas);
    if (lastPos) {
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.stroke();
    }
    setLastPos(pos);
  }, [canvas, isDrawing, lastPos]);

  const onMouseUp = useCallback((e) => {
    setIsDrawing(false);
    setLastPos(undefined);
  }, []);

  useSetup(()=>{
    setSendLabel(sendLabelOptions[Math.floor(Math.random()*sendLabelOptions.length)]);
  });

  useUpdates(() => {
    if (!canvas) return;
    const width = canvas.clientWidth;
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = '#F2F2F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
  }, [canvas]);

  useUpdates(()=>{
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [canvas, color, lineWidth]);

  useUpdates(() => {
    if (!canvas) return;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onMouseDown);
    }
  }, [canvas, onMouseDown]);

  useUpdates(() => {
    if (!canvas) return;
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onMouseMove);
    }
  }, [canvas, onMouseMove]);

  useUpdates(() => {
    if (!canvas) return;
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('touchend', onMouseUp);

    return () => {
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('touchend', onMouseUp);
    }
  }, [canvas, onMouseUp]);

  
  const lineWidthIconStyle = {
    width: lineWidth,
    height: lineWidth,
    border: '1px solid black',
    borderRadius: '50%',
    backgroundColor: color
  };

  const toggleLineWidth = () => {
    let width = lineWidth * 2.5;
    if (width > 48) width = 2;
    setLineWidth(width);
  };

  const changeColor = (color) => {
    setColor(color);
  };

  const submit = () => {
    canvasToBlobAsync(canvas)
      .then(onSubmit)
      .catch(err => {
        console.log('[Canvas] Failed to render canvas to image', err);
      });
  };

  const classNames = classnames('canvas-container', { disabled });

  return (
    <div className={classNames}>
      <canvas ref={canvasRef} width={300} height={300} className="canvas-image"></canvas>
      <div className="canvas-controls">
        <div className="canvas-control">
          <label>Pen Size</label>
          <button onClick={toggleLineWidth} className="square">
            <div style={lineWidthIconStyle}></div>
          </button>
        </div>
        <div className="canvas-control">
          <label>Color</label>
          <ColorPicker onChange={changeColor} />
        </div>
        <div className="canvas-control">
          <label>Finished?</label>
          <button
            onClick={submit}
            disabled={disabled}
            className="sendButton"
          >
            {sendLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
