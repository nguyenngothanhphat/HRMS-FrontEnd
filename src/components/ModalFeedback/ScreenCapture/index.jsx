/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import { Button } from 'antd';
import html2canvas from 'html2canvas';
import styles from './index.less';

export default class ScreenCapture extends Component {
  static defaultProps = {
    onStartCapture: () => null,
    onEndCapture: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
      startX: 0,
      startY: 0,
      isMouseDown: false,
      windowWidth: 0,
      windowHeight: 0,
      borderWidth: 0,
      imgUrl: null,
    };
  }

  handleWindowResize = () => {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.setState({
      windowWidth,
      windowHeight,
    });
  };

  componentDidMount = () => {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleWindowResize);
  };

  handleMouseMove = (e) => {
    const { isMouseDown, windowWidth, windowHeight, startX, startY, borderWidth } = this.state;

    const endX = e.clientX;
    const endY = e.clientY;
    const isStartTop = endY >= startY;
    const isStartBottom = endY <= startY;
    const isStartLeft = endX >= startX;
    const isStartRight = endX <= startX;
    const isStartTopLeft = isStartTop && isStartLeft;
    const isStartTopRight = isStartTop && isStartRight;
    const isStartBottomLeft = isStartBottom && isStartLeft;
    const isStartBottomRight = isStartBottom && isStartRight;
    let newBorderWidth = borderWidth;

    if (isMouseDown) {
      if (isStartTopLeft) {
        newBorderWidth = `${startY}px ${windowWidth - endX}px ${windowHeight - endY}px ${startX}px`;
      }

      if (isStartTopRight) {
        newBorderWidth = `${startY}px ${windowWidth - startX}px ${windowHeight - endY}px ${endX}px`;
      }

      if (isStartBottomLeft) {
        newBorderWidth = `${endY}px ${windowWidth - endX}px ${windowHeight - startY}px ${startX}px`;
      }

      if (isStartBottomRight) {
        newBorderWidth = `${endY}px ${windowWidth - startX}px ${windowHeight - startY}px ${endX}px`;
      }
    }

    this.setState({
      borderWidth: newBorderWidth,
    });
  };

  handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;

    this.setState((prevState) => ({
      startX,
      startY,
      isMouseDown: true,
      borderWidth: `${prevState.windowWidth}px ${prevState.windowHeight}px`,
    }));
  };

  handleMouseUp = () => {
    this.handleClickTakeScreenShot();
    this.setState({
      isMouseDown: false,
      // borderWidth: 0,
    });
  };

  handleClickTakeScreenShot = async () => {
    let base64URL = '';
    const body = document.querySelector('body');
    window.scrollTo(0, 0);
    html2canvas(body, {
      // allowTaint: true,
      // useCORS: true,
      // logging: false,
      height: window.innerHeight,
      width: window.innerWidth,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    }).then((canvas) => {
      base64URL = canvas.toDataURL();
      this.setState({
        imgUrl: base64URL,
      });
    });
  };

  handleNext = () => {
    const { onEndCapture = () => {} } = this.props;
    const { imgUrl } = this.state;

    onEndCapture(imgUrl);
  };

  render() {
    const { borderWidth, isMouseDown, imgUrl } = this.state;

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onMouseDown={imgUrl ? null : this.handleMouseDown}
        onMouseUp={imgUrl ? null : this.handleMouseUp}
      >
        <div
          className={`${styles.overlay} ${isMouseDown && `${styles.highlighting}`}`}
          style={{ borderWidth }}
        />
        <Button
          disabled={imgUrl === null}
          className={`${styles.initialBtn} ${imgUrl === null ? styles.disabledBtn : ''}`}
          onClick={this.handleNext}
          style={isMouseDown ? { display: 'none' } : {}}
        >
          Next
        </Button>
      </div>
    );
  }
}
