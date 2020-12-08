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
    return (
      <div>
        <div className={styles.reasonPutOnHold}>
          <Row gutter={[0, 20]} justify="space-between">
            <Col className={styles.reasonPutOnHold__title}>Closing comments from 1-on-1</Col>
            <Col>
              <Row>
                <div className={styles.reasonPutOnHold__dateTime}>
                  <span>
                    <span className={styles.subText}>Lasted updated by</span> |{' '}
                    {moment().format('DD.MM.YY | h:mm A')}
                  </span>
                </div>
              </Row>
            </Col>
          </Row>
          <div className={styles.reasonPutOnHold__textArea}>
            <TextArea allowClear disabled className={styles.resize} />
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
      </div>
    );
  }
}

export default CommentsFromHR;
