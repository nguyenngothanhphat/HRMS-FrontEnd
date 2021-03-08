import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class ListSpentTime extends Component {
  onChange = () => {};

  renderItem = (render) => {
    return (
      <Row gutter={[10, 17]} className={styles.item}>
        <Col span={8} style={{ textAlign: 'left' }}>
          <div>{render.period} </div>
        </Col>
        <Col span={8} style={{ textAlign: 'center' }}>
          <div>{render.date} </div>
        </Col>
        <Col span={7} style={{ textAlign: 'right' }}>
          <div>{render.amount} </div>
        </Col>
      </Row>
    );
  };

  render() {
    const array = [
      {
        period: '01/01/2020 - 31/12/2020',
        date: '31/12/2020',
        amount: '10 days',
      },
    ];

    return (
      <div className={styles.root}>
        <div className={styles.previewTitle}>Accrual schedule preview</div>
        <Row gutter={[24, 12]} className={styles.previewAccrual}>
          <Col span={8} className={styles.previewAccrual__col} style={{ textAlign: 'left' }}>
            <div>Schedule period</div>
          </Col>
          <Col span={8} className={styles.previewAccrual__col} style={{ textAlign: 'center' }}>
            <div>Accrual date </div>
          </Col>
          <Col span={8} className={styles.previewAccrual__col} style={{ textAlign: 'right' }}>
            <div>Accrual amount </div>
          </Col>
        </Row>

        <div className={styles.schedulePreview}>
          {array.map((render) => this.renderItem(render))}
        </div>
      </div>
    );
  }
}

export default ListSpentTime;
