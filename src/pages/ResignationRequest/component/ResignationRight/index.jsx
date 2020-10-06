// import React, { Component } from 'react';
import { Row, Col } from 'antd';
import React, { Component } from 'react';
import icon from '@/assets/offboarding-schedule.svg';
import righticon1 from '@/assets/offboarding-1.svg';
import righticon2 from '@/assets/offboarding-2.svg';
import righticon3 from '@/assets/offboarding-3.svg';
import styles from './index.less';

const array = [
  {
    icon: righticon1,
    decription: (
      <p>
        Make sure your report is done with his current project to have this discussion continued. If
        not, please
        <span style={{ color: 'blue' }}> schedule a meeting </span>
        with project manager now.
      </p>
    ),
  },
  {
    icon: righticon2,
    decription: (
      <p>
        This page is just a meeting away
        <span style={{ color: 'blue' }}> schedule a meeting </span>
        with HR to review this request.
      </p>
    ),
  },
  {
    icon: righticon3,
    decription: '0 Reportees under Aditya. He is currently not leading any team',
  },
];

export class Resignationright extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  rederItem = (reder) => {
    return (
      <Row>
        <Col span={4}>
          <img src={reder.icon} alt="iconCheck" />
        </Col>
        <Col span={19}>
          <div>{reder.decription} </div>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.boxRight}>
          <img alt="icontop" className={styles.icon} src={icon} />
          <div className={styles.text_Title}> Did you know?</div>
          <div className={styles.text_Body}>
            Your Manager, Sandeep, usually conducts 1-on-1s and you can speak anything to him. 8/10
            employees have changed their mind!
          </div>
          <div className={styles.text_Schedule}>Schedule 1-on-1 Now!</div>
          <div className={styles.twoRight}>
            <p className={styles.text_twoRight}> Few thing to consider</p>
            <div>{array.map((reder) => this.rederItem(reder))}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Resignationright;
