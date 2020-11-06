import React from 'react';
import classnames from 'classnames';

export const IconButton = ({ icon: Icon, width, height, onClick, className }) => {
  return (
    <button className={classnames('iconButton', className)} onClick={onClick}>
      <div className="iconButton-container">
        <Icon height={height} width={width} />
      </div>
    </button>
  );
};
