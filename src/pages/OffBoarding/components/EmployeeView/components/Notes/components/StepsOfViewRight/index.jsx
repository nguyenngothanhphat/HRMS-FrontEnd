import React, { Component } from 'react';
import { Carousel, Typography, Row, Col } from 'antd';
import styles from './index.less';

class StepsOfViewRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Complete offboarding process at a glance',
      keyPage: [
        { key: 1, data: `Initiate Request` },
        { key: 2, data: `Submit request` },
        { key: 3, data: `1-1 with your manager & their approval` },
        { key: 4, data: `HR Approval` },
      ],
    };
  }

  componentDidMount() {}

  render() {
    const { title, keyPage } = this.state;
    return (
      <div className={styles.StepsOfViewRight}>
        <Carousel autoplay className={styles.carouselWrapper}>
          {keyPage.map((data) => (
            <div className={styles.content} key={data.key}>
              <Typography.Title level={5}>{title}</Typography.Title>
              <Row className={styles.Padding}>
                <Col span={6}>
                  <div className={styles.Circle}>{data.key}</div>
                </Col>
                <Col span={16}>
                  <Typography.Text>{data.data}</Typography.Text>
                </Col>
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default StepsOfViewRight;
