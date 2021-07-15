// import React, { Component } from 'react';
import { Row, Col, Divider, Button } from 'antd';
import React, { PureComponent } from 'react';
// import icon from '@/assets/offboarding-schedule.svg';
import icon1 from '@/assets/offboadingIcon1.svg';
import icon2 from '@/assets/offboadingIcon2.svg';
import icon3 from '@/assets/offboadingIcon3.svg';
import styles from './index.less';

const array = [
  {
    icon: icon1,
    decription: (
      <p>
        Discuss your decision with a
        <span style={{ color: '#2C6DF9', fontWeight: '500', borderBottom: '1px solid #2C6DF9' }}>
          {' '}
          supervisor{' '}
        </span>{' '}
        and not your reporting manager
      </p>
    ),
  },
  {
    icon: icon2,
    decription: (
      <p>
        Make sure you are done with your current project to have this discussion continued. If not,
        please{' '}
        <span style={{ color: '#2C6DF9', fontWeight: '500', borderBottom: '1px solid #2C6DF9' }}>
          {' '}
          schedule a meeting{' '}
        </span>
        with project manager now.
      </p>
    ),
  },
  {
    icon: icon3,
    decription: (
      <p>
        We have prepared an
        <span style={{ color: '#2C6DF9', fontWeight: '500', borderBottom: '1px solid #2C6DF9' }}>
          {' '}
          exit checklist,{' '}
        </span>{' '}
        which you might want to see before applying for a relationship termination
      </p>
    ),
  },
];

export default class ViewRightManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (render) => {
    return (
      <div className={styles.rowInfo}>
        <Row justify="space-between">
          <Col span={4}>
            <div className={styles.icon}>
              <img src={render.icon} alt="iconCheck" />
            </div>
          </Col>
          <Col span={19}>
            <div className={styles.description}>{render.decription} </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.ViewRight}>
        <div className={styles.twoRight}>
          <div className={styles.headerTitle}>Few thing to consider</div>
          <Divider className={styles.divider} />
          <div className={styles.twoRight__bottom}>
            {array.map((render) => this.renderItem(render))}
          </div>
          <div className={styles.bottom}>
            <div className={styles.btnBottom} />
            <Button className={styles.btnBottom__btn}>Speak to manager</Button>
          </div>
          {/* <img alt="icontop" className={styles.icon} src={icon} />
          <div className={styles.text_Title}> Did you know?</div>
          <div className={styles.text_Body}>
            <p>
              Your Manager, Sandeep, usually conducts 1-on-1s and you can speak anything to him.
              8/10 employees have changed their mind!
            </p>
          </div>
          <div className={styles.text_Schedule}>Schedule 1-on-1 Now!</div> */}
        </div>
      </div>
    );
  }
}

// export default InfoRight;
