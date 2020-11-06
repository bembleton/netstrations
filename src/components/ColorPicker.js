import React, { useState } from 'react';
import classnames from 'classnames';
import { black, colors } from './../color';
import { useUpdates } from '../effects/useSanity';

export const ColorPicker = ({ color: initialColor = black, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(initialColor);

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

  useUpdates(()=>{
    onChange(color);
  }, [color]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="colorPicker">
        <button onClick={toggleMenu} className="colorPicker-button" style={{ backgroundColor: color }} />
        <div className={classnames('colorPicker-popup', 'centered', { open: isOpen })}>
          <ul className="colorPicker-menu reset">
            {colorOptions}
          </ul>
        </div>
      </div>
      <div onClick={toggleMenu} className={classnames('fsoverlay', { hidden: !isOpen })} />
    </>
  );
};