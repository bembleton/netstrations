import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import { useSetup, useUpdates } from '../effects/useSanity';
import { black } from '../color';
import { ColorPicker } from './ColorPicker';
import './netstration-canvas.css';
import { useInterval } from '../effects/useInterval';

const getPos = (ev, canvas) => {
  const { touches } = ev;
  const source = touches ? touches[0] : ev;
  return {
    x: (source.pageX - canvas.offsetLeft) * (canvas.width/canvas.clientWidth),
    y: (source.pageY - canvas.offsetTop) * (canvas.height/canvas.clientHeight)
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
export const NestrationCanvas = ({ onSubmit, disabled, round_end_time}) => {
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

  const onResize = useCallback(() => {
    if (!canvas) return;
    // const width = canvas.clientWidth;
    // canvas.width = width;
    // canvas.height = width;
    const headerHeight = 60;
    const appPadding = 48;
    const sectionPadding = 24;
    const controlsHeight = 103;
    const aspectRatio = 3/4;
    
    const deviceHeight = window.innerHeight;
    const deviceWidth = window.innerWidth;
    // @media screen and (min-width: 768px) { width: 50vh }
    const appWidth = (window.innerWidth < 768 ? deviceWidth : deviceHeight/2) - appPadding;
    const maxClientHeight = deviceHeight - (headerHeight + controlsHeight + sectionPadding);
    const maxClientWidth = maxClientHeight * aspectRatio;
    const h = appWidth / aspectRatio;
    if (h > maxClientHeight) {
      canvas.style = `height: ${maxClientHeight}px; width: ${maxClientWidth}px;`;
    } else {
      canvas.style = `height: ${h}px; width: ${appWidth}px;`;
    }
  }, [canvas]);

  useSetup(()=>{
    setSendLabel(sendLabelOptions[Math.floor(Math.random()*sendLabelOptions.length)]);
  });

  useUpdates(() => {
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = '#F2F2F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
    let c = canvas;
    if (!c) {
      setCanvas(x=> { c=x; return x; });
    }
    canvasToBlobAsync(c)
      .then(onSubmit)
      .catch(err => {
        console.log('[Canvas] Failed to render canvas to image', err);
      });
  };

  const [timeLeft, setTimeLeft] = useState();
  useInterval(200, (stop) => {
    if (!round_end_time) return;
    const remainingMs = round_end_time - Date.now();
    const remainingS = Math.max(0, Math.floor(remainingMs / 1000));
    if (remainingS <= 0) {
      stop();
      submit();
    }
    setTimeLeft(remainingS);
  });

  const timeLeftLabel = round_end_time ? (timeLeft+'').padStart(2, '0') : null;
  const classNames = classnames('canvas-container', { disabled });

  return (
    <div className={classNames}>
      { timeLeftLabel &&
        <div className="timer"><span>{timeLeftLabel}</span></div>
      }
      <canvas ref={canvasRef} width={240} height={320} className="canvas-image"></canvas>
      <div className="canvas-controls">
        <div className="canvas-control">
          <label>Size</label>
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
            className="button-primary"
          >
            {sendLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
