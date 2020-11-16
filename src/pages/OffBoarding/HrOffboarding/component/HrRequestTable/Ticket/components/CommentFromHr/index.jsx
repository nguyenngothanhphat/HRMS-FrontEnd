import React, { PureComponent } from 'react';
import { Row, Col, Input, Space, Checkbox } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;

class CommentsFromHR extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const date = moment().format('DD.MM.YY | h:mm A');

    return (
      <div className={styles.reasonPutOnHold}>
        <Row gutter={[0, 20]} justify="space-between">
          <Col className={styles.reasonPutOnHold__title}>Closing comments from 1-on-1</Col>
          <Col>
            <Row>
              <div className={styles.reasonPutOnHold__dateTime}>
                <span>
                  <span className={styles.subText}>Lasted updated by Sandeep Metta </span>| {date}
                </span>
              </div>
            </Row>
          </Col>
        </Row>
        <div className={styles.reasonPutOnHold__textArea}>
          <TextArea
            allowClear
            placeholder="The reason I have decided to end out this request on-hold is because …"
          />
          <div className={styles.reasonPutOnHold__action}>
            <Space>
              <Checkbox>
                <span style={{ color: '#2C6DF9' }}>Can be rehired</span>
              </Checkbox>
              <span className={styles.reasonPutOnHold__action__text}>
                (This will remain private to yourself and the approving manager)
              </span>
            </Space>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentsFromHR;
