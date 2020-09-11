import React from 'react';
import { Typography, Row, Col, Carousel } from 'antd';
import styles from './index.less';

const StepsComponent = ({ Steps = {} }) => {
  return (
    <div className={styles.StepsComponent}>
      <Carousel autoplay className={styles.carouselWrapper}>
        <div className={styles.content}>
          <Typography.Title level={5}>{Steps.title}</Typography.Title>
          <Row className={styles.Padding}>
            <Col span={6}>
              <div className={styles.Circle}>{Steps.keyPage[0].key}</div>
            </Col>
            <Col span={16}>
              <Typography.Text>{Steps.keyPage[0].data}</Typography.Text>
            </Col>
          </Row>
          <Row>
            <div className={styles.smallCircle} />
          </Row>
        </div>
      </Carousel>
    </div>
  );
};

export default StepsComponent;
