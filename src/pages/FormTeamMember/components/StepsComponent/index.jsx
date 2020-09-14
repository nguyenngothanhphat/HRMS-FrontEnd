import React, { Component } from 'react';
import { Carousel, Typography, Row, Col } from 'antd';
import styles from './index.less';

class StepsComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('did mount');
  }

  render() {
    const { steps: { keyPage = [], title = '' } = {} } = this.props;
    console.log(keyPage);
    return (
      <div className={styles.StepsComponent}>
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
              {/* <Row>
                <div className={styles.smallCircle} />
              </Row> */}
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default StepsComponent;
