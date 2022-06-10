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
    decription: <p>Discuss your decision with your Skip-level manager</p>,
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

export default class ViewRight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (render) => {
    return (
      <div className={styles.rowInfo}>
        <Row justify="space-between" gutter={[24, 24]}>
          <Col span={4}>
            <div className={styles.icon}>
              <img src={render.icon} alt="iconCheck" />
            </div>
          </Col>
          <Col span={20}>
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
        </div>
      </div>
    );
  }
}

// export default InfoRight;
