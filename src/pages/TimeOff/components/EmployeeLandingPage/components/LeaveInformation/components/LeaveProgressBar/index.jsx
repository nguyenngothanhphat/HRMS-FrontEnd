import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import styles from './index.less';

export default class LeaveProgressBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
    };
  }

  componentDidMount = () => {
    const { stepNumber = 0, limitNumber = 0 } = this.props;
    const remaining = (stepNumber / limitNumber) * 100;
    setTimeout(() => {
      for (let i = 0; i < remaining; i += 1) {
        setTimeout(() => {
          this.setState({
            percent: i,
          });
        }, 0);
      }
    }, 1000);
  };

  renderCircle = (stepNumber, limitNumber, color) => {
    return (
      <span className={styles.smallCircle}>
        <span style={{ color, fontWeight: 'bold' }}>{stepNumber}</span>/
        {`0${limitNumber}`.slice(-2)}
      </span>
    );
  };

  renderProgressBar = () => {
    const { color = '', stepNumber = 0, limitNumber = 0 } = this.props;
    const { percent } = this.state;
    return (
      <div className={styles.renderProgressBar}>
        <Progress
          type="circle"
          percent={percent}
          width={50}
          strokeColor={color}
          trailColor="#d6dce0"
          format={() => this.renderCircle(stepNumber, limitNumber, color)}
        />
      </div>
    );
  };

  render() {
    const { title = '', shortType = '', stepNumber = 0 } = this.props;
    return (
      <div className={styles.LeaveProgressBar}>
        <div className={styles.LeaveProgressBar__above}>
          <span className={styles.title}>
            {title}
            <span className={styles.title__shorten}> {shortType !== '' && `(${shortType})`}</span>
          </span>
          <span className={styles.progress}>
            <span className={styles.stepNumber}>Remaining: {`0${stepNumber}`.slice(-2)}</span>
            {/* <span className={styles.limitNumber}>/{`0${limitNumber}`.slice(-2)}</span> */}
          </span>
        </div>
        <div className={styles.LeaveProgressBar__below}>{this.renderProgressBar()}</div>
      </div>
    );
  }
}
