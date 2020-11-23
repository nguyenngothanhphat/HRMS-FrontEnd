import React, { PureComponent, Fragment } from 'react';
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
    const { list1On1 = [] } = this.props;
    const data = [list1On1];
    console.log(data);
    return (
      <div>
        {list1On1.length !== 0 &&
          list1On1.map((item) => (
            <Fragment key={item}>
              <div className={styles.reasonPutOnHold}>
                <Row gutter={[0, 20]} justify="space-between">
                  <Col className={styles.reasonPutOnHold__title}>Closing comments from 1-on-1</Col>
                  <Col>
                    <Row>
                      <div className={styles.reasonPutOnHold__dateTime}>
                        <span>
                          <span className={styles.subText}>
                            {item.createdBy && item.createdBy.generalInfo.firstName}
                          </span>{' '}
                          | {moment(item.updatedAt).format('DD.MM.YY | h:mm A')}
                        </span>
                      </div>
                    </Row>
                  </Col>
                </Row>
                <div className={styles.reasonPutOnHold__textArea}>
                  <TextArea allowClear value={item.content} disabled />
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
            </Fragment>
          ))}
      </div>
    );
  }
}

export default CommentsFromHR;
