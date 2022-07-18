// import React, { Component } from 'react';
import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
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

export default class Sidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (render) => {
    return (
      <Row>
        <Col span={4}>
          <img src={render.icon} alt="iconCheck" />
        </Col>
        <Col span={19}>
          <div className={styles.description}>{render.decription} </div>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <div className={styles.Sidebar}>
        <div className={styles.boxRight}>
          <img alt="icontop" className={styles.icon} src={icon} />
          <div className={styles.text_Title}> Did you know?</div>
          <div className={styles.text_Body}>
            <p>
              Your Manager, Sandeep, usually conducts 1-on-1s and you can speak anything to him.
              8/10 employees have changed their mind!
            </p>
          </div>
          <div className={styles.text_Schedule}>Schedule 1-on-1 Now!</div>
          <div className={styles.twoRight}>
            <p className={styles.text_twoRight}>Few thing to consider</p>
            <div>{array.map((render) => this.renderItem(render))}</div>
          </div>
        </div>
      </div>
    );
  }
}

// export default InfoRight;
