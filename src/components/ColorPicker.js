import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { black, white, colors } from './../color';
import { useUpdates } from '../effects/useSanity';

export const ColorPicker = ({ color: initialColor = black, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(initialColor);
  const ref = useRef();

  // const colorOptions = colors.map(color => {
  //   const foreground = color === black ? white : black;
  //   const style = {
  //     backgroundColor: color,
  //     lineHeight: 3
  //   };
  //   return (
  //     <option key={color} value={color} style={style}>
  //       <div></div>
  //     </option>
  //   );
  // });

  const selectColor = (colr) => {
    setColor(colr);
    setIsOpen(false);
  };

  const colorOptions = colors.map(colr => {
    return (
      <li key={colr}>
        <button
          onClick={() => selectColor(colr)}
          className="colorPicker-button"
          style={{ backgroundColor: colr}}>
        </button>
      </li>
    );
  });

  // const changed = () => {
  //   setColor(ref.current.value);
  // }

  useUpdates(()=>{
    onChange(color);
  }, [color]);

  const selectStyle = {
    height: '100%',
    width: 64,
    fontSize: 24,
    backgroundColor: color
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="colorPicker">
        <button onClick={toggleMenu} className="colorPicker-button" style={{ backgroundColor: color }}></button>
        {/* <select ref={ref} value={_color} onChange={changed} style={selectStyle}>
          {colorOptions}
        </select> */}
        
        <div className={classnames('colorPicker-popup', 'centered', { open: isOpen })}>
          <ul className="colorPicker-menu reset">
            {colorOptions}
          </ul>
        </div>
      </div>
      <div
        onClick={toggleMenu}
        className={classnames('fsoverlay', { hidden: !isOpen })}
      >
      </div>
    </>
  );
};