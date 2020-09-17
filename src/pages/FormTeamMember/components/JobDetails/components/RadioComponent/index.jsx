import React, { PureComponent } from 'react';
import { Radio, Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ info: { jobDetail } = {} }) => ({
  jobDetail,
}))
class RadioComponent extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('jobDetail' in props) {
      return { jobDetail: props.jobDetail || {} };
    }
    return null;
  }

  render() {
    const { Tab, handleRadio } = this.props;
    const { jobDetail = {} } = this.state;
    const { position, classification } = jobDetail;
    return (
      <div className={styles.RadioComponent}>
        <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>
        <Radio.Group
          className={styles.Padding}
          defaultValue={position}
          onChange={(e) => handleRadio(e)}
          name={Tab.positionTab.name}
        >
          <Row gutter={[24, 0]}>
            {Tab.positionTab.arr.map((data) => (
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Radio className={styles.paddingRightRadio} value={data.value}>
                  <Typography.Text>{data.position}</Typography.Text>
                </Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>

        <Typography.Title level={5} className={styles.paddingBotTitle}>
          {Tab.classificationTab.title}
        </Typography.Title>
        <Radio.Group
          className={styles.paddingRadio}
          defaultValue={classification}
          onChange={(e) => handleRadio(e)}
          name={Tab.classificationTab.name}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              {Tab.classificationTab.arr.map((data) => (
                <Radio className={styles.Radio} value={data.value}>
                  <Typography.Text>{data.classification}</Typography.Text>
                </Radio>
              ))}
            </Col>
          </Row>
        </Radio.Group>
      </div>
    );
  }
}

export default RadioComponent;
