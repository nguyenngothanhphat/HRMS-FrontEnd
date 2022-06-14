// import React, { Component } from 'react';
import { Row, Col } from 'antd';
import React, { Component } from 'react';
import iconLight from '@/assets/offboarding-schedule.svg';
import righticon1 from '@/assets/offboarding-1.svg';
import righticon2 from '@/assets/offboarding-2.svg';
import righticon3 from '@/assets/offboarding-3.svg';
import medalIcon from '@/assets/medal-off-boarding.svg';
import orgStructure from '@/assets/org-structure-off-boarding.svg';
import styles from './index.less';

const array = [
  {
    icon: righticon1,
    decription: (
      <p>
        Make sure your report is done with his current project to have this discussion continued. If
        not, please
        <span className={styles.rightContent__textLink}> schedule a meeting </span>
        with project manager now.
      </p>
    ),
  },
  {
    icon: righticon2,
    decription: (
      <p>
        This page is just a meeting away
        <span className={styles.rightContent__textLink}> schedule a meeting </span>
        with HR to review this request.
      </p>
    ),
  },
  {
    icon: righticon3,
    decription: '0 Reportees under Aditya. He is currently not leading any team',
  },
];

export default class RightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (render) => {
    return (
      <Row gutter={[10, 17]}>
        <Col span={4}>
          <img src={render.icon} alt="iconCheck" />
        </Col>
        <Col span={19}>
          <div>{render.decription} </div>
        </Col>
      </Row>
    );
  };

  render() {
    const arrayAbove = [
      {
        icon: medalIcon,
        decription: (
          <p>
            Super six years with us. <br />
            <span className={styles.rightContent__textLink}>Give feedback?</span>
          </p>
        ),
      },
      {
        icon: orgStructure,
        decription: (
          <p>
            <span className={styles.rightContent__textLink}>Check org. structure </span>
            to see what’s the action to take
          </p>
        ),
      },
    ];
    return (
      <div className={styles.rightContent}>
        <img alt="Icon-Light" className={styles.rightContent_icon} src={iconLight} />
        <div className={styles.rightContent__title}> Did you know?</div>
        <div className={styles.rightContent__body}>
          Aditya, your reportee, has been a great team player and is in time to submit timesheets
          always. He has always been successful in his projects
          <div className={styles.rightContent__above}>
            <div>{arrayAbove.map((render) => this.renderItem(render))}</div>
          </div>
        </div>
        <div className={styles.rightContent__consider}>
          <p className={styles.consider__text}>Few thing to consider</p>
          <div>{array.map((render) => this.renderItem(render))}</div>
        </div>
      </div>
    );
  }
}

// export default InfoRight;
