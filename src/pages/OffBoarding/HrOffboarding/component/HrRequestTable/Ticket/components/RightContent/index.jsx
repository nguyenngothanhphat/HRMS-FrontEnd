// import React, { Component } from 'react';
import { Row, Col } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

const array = [
  {
    info: 'Aditya has handled over 120 designers across 200 projects.',
  },
  {
    info: ' Aditya has won Terralogic over 50 accounts',
  },
  {
    info: ' Accounts Aditya handled brought over 25 cr revenue for the company',
  },
  {
    info:
      'Aditya handled 6 of the biggest accounts for Terralogic namely: Bajaj DRx, NJ Group, Hukoomi, Udaan & Intel',
  },
];

export default class InfoEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (render) => {
    return (
      <Row gutter={[10, 17]}>
        <Col>
          <div className={styles.textData}>{render.info} </div>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <div className={styles.rightContent}>
        <div className={styles.header}>
          <span className={styles.textTitle}>Aditya’s Career highlights within Terralogic</span>
        </div>
        <div className={styles.straightLine} />
        <div className={styles.bodyContent}>
          <div>{array.map((render) => this.renderItem(render))}</div>
          <div>
            <span className={styles.viewDetail}>View Aditya’s Career graph</span>
          </div>
        </div>
      </div>
    );
  }
}
