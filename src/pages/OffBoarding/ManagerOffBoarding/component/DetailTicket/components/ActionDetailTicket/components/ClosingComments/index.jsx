import React, { PureComponent } from 'react';
import { Button, Row, Col, Space, Input } from 'antd';
import editIcon from '@/assets/edit-off-boarding.svg';
import thumbsUpIcon from '@/assets/thumbs-up.svg';
import { formatMessage } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

class ClosingComments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSumbit: false,
    };
  }

  handleSubmitComments = () => {
    const { handleDisplayNotifications } = this.props;
    this.setState({
      isSumbit: true,
    });
    setTimeout(() => {
      handleDisplayNotifications();
    }, 1000);
  };

  render() {
    const { isSumbit } = this.state;
    return (
      <>
        <div className={styles.closingComments}>
          <Row gutter={[0, 20]} justify="space-between">
            <Col className={styles.closingComments__title}>
              {formatMessage({ id: 'pages.offBoarding.closingComments' })}
            </Col>
            <Col>
              <Row>
                {isSumbit ? (
                  <div className={styles.closingComments__edit}>
                    <img src={editIcon} alt="edit-icon" />
                    <span>Edit</span>
                  </div>
                ) : (
                  ''
                )}
                <div className={styles.closingComments__dateTime}>
                  <span>
                    22.05.20 &nbsp; | &nbsp; <span>12PM</span>
                  </span>
                </div>
              </Row>
            </Col>
          </Row>

          {isSumbit ? (
            <div className={styles.closingComments__content}>
              <div className={styles.closingComments__content__text}>
                The reason I have decided to end my journey with Lollypop here is because The reason
                I have decided to end my journey with Lollypop here is because
              </div>
              <div className={styles.closingComments__content__note}>
                <Space>
                  <img src={thumbsUpIcon} alt="thumbs-up-icon" />
                  <span>
                    Your comment for the 1-on-1 with Venkat has been recorded. Venkat and the HR
                    manager will be able to view this comment.
                  </span>
                </Space>
              </div>
            </div>
          ) : (
            <div className={styles.closingComments__textArea}>
              <TextArea
                allowClear
                placeholder="The reason I have decided to end my journey with Lollypop here is because…"
              />
              <Button className={styles.btn__submit} onClick={this.handleSubmitComments}>
                Submit
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ClosingComments;
