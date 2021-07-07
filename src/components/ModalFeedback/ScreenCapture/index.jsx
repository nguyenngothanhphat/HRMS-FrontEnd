/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
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
      on: false,
      startX: 0,
      startY: 0,
      crossHairsTop: 0,
      crossHairsLeft: 0,
      isMouseDown: false,
      windowWidth: 0,
      windowHeight: 0,
      borderWidth: 0,
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

  handStartCapture = () => this.setState({ on: true });

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
      crossHairsTop: e.clientY,
      crossHairsLeft: e.clientX,
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
      // on: false,
      isMouseDown: false,
      borderWidth: 0,
    });
  };

  handleClickTakeScreenShot = async () => {
    const { onEndCapture = () => {} } = this.props;
    const body = document.querySelector('body');
    window.scrollTo(0, 0);
    html2canvas(body, {
      useCORS: true,
      // width: window.screen.availWidth,
      height: window.screen.availHeight,
      windowWidth: body.offsetWidth,
      windowHeight: body.offsetHeight,
      x: 0,
      y: window.pageYOffset,
    }).then((canvas) => {
      document.documentElement.style.overflow = 'hidden';
      document.body.appendChild(canvas);
      document.documentElement.style.overflow = '';
      const canvasItem = document.getElementsByTagName('canvas')[0];
      const base64URL = canvasItem.toDataURL();

      onEndCapture(base64URL);
    });

    this.setState({
      crossHairsTop: 0,
      crossHairsLeft: 0,
    });
  };

  renderChild = () => {
    const { children } = this.props;

    const props = {
      onStartCapture: this.handStartCapture,
    };

    if (typeof children === 'function') return children(props);
    return children;
  };

  render() {
    const { on, crossHairsTop, crossHairsLeft, borderWidth, isMouseDown } = this.state;

    if (!on) return this.renderChild();

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        {this.renderChild()}
        <div
          className={`${styles.overlay} ${isMouseDown && `${styles.highlighting}`}`}
          style={{ borderWidth }}
        />
        <div
          className={styles.crosshairs}
          style={{ left: `${crossHairsLeft}px`, top: `${crossHairsTop}px` }}
        />
      </div>
    );
  }
}
