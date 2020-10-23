import React, { PureComponent } from 'react';
import { Row, Col, Input, Space } from 'antd';
import warningNoteIcon from '@/assets/warning-icon.svg';
import { formatMessage } from 'umi';
// import ModalNotice from '../ModalNotice';
import styles from './index.less';

const { TextArea } = Input;

class CommentsFromHR extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.reasonPutOnHold}>
        <Row gutter={[0, 20]} justify="space-between">
          <Col className={styles.reasonPutOnHold__title}>
            {formatMessage({ id: 'pages.offBoarding.reasonPutOnHold' })}
          </Col>
          <Col>
            <Row>
              <div className={styles.reasonPutOnHold__dateTime}>
                <span>
                  22.05.20 &nbsp; | &nbsp; <span>12PM</span>
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
              <img src={warningNoteIcon} alt="warning-note-icon" />
              <span className={styles.reasonPutOnHold__action__text}>
                By default notifications will be sent to HR, the requestee and recursively loop to
                your department head.
              </span>
            </Space>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentsFromHR;
