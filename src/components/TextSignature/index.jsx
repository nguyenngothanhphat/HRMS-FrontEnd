import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TextSignature = (props) => {
  const {
    className,
    name,
    getImage,
    x,
    y,
    height = 68,
    font = '30px Arial',
    defaultImg = '',
  } = props;
  const ref = useRef();
  const generateBase64Img = (img) => {
    getImage(img);
  };
  useEffect(() => {
    const canvas = ref.current;
    const canvasTxt = canvas.getContext('2d');
    canvasTxt.canvas.width = canvasTxt.measureText(name).width + x;
    canvasTxt.canvas.height = height;
    canvasTxt.font = font;
    canvasTxt.fillText(name, x, y);
    generateBase64Img(canvasTxt.canvas.toDataURL());
  }, [name, x, y, height, defaultImg, font]);

  return (
    <div className={className}>
      <canvas ref={ref} />
    </div>
  );
};
TextSignature.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  getImage: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  font: PropTypes.string.isRequired,
  defaultImg: PropTypes.string,
};
TextSignature.defaultProps = {
  className: '',
  name: '',
  defaultImg: '',
};
export default TextSignature;
