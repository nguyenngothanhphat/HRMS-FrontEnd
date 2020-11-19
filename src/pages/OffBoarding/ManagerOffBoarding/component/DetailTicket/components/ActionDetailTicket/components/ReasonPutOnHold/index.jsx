import React, { Component } from 'react';
import { Row, Col, Input, Button, Space } from 'antd';
import warningNoteIcon from '@/assets/warning-icon.svg';
import { formatMessage } from 'umi';
import moment from 'moment';
import ModalNotice from '../ModalNotice';
import styles from './index.less';

const { TextArea } = Input;

class ReasonPutOnHold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      q: '',
    };
  }

  handleSubmitReason = (e) => {
    e.stopPropagation();
    this.openModal();
  };

  handleChange = (e) => {
    this.setState({
      q: e.target.value,
    });
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, q } = this.state;
    const { openNotification = () => {} } = this.props;
    const date = moment().format('DD.MM.YY | h:mm A');

    return (
      <div className={styles.reasonPutOnHold}>
        <Row gutter={[0, 20]} justify="space-between">
          <Col className={styles.reasonPutOnHold__title}>
            {formatMessage({ id: 'pages.offBoarding.reasonPutOnHold' })}
          </Col>
          <Col>
            <Row>
              <div className={styles.reasonPutOnHold__dateTime}>{date}</div>
            </Row>
          </Col>
        </Row>
        <div className={styles.reasonPutOnHold__textArea}>
          <TextArea
            allowClear
            placeholder="The reason I have decided to end out this request on-hold is because …"
            value={q}
            onChange={this.handleChange}
          />
          <div className={styles.reasonPutOnHold__action}>
            <Space>
              <img src={warningNoteIcon} alt="warning-note-icon" />
              <span className={styles.reasonPutOnHold__action__text}>
                By default notifications will be sent to HR, the requestee and recursively loop to
                your department head.
              </span>
            </Space>

            <div className={styles.reasonPutOnHold__action__btn}>
              <Button className={styles.btn__cancel} onClick={openNotification}>
                Cancel
              </Button>
              <Button
                disabled={!q}
                className={styles.btn__submit}
                onClick={(e) => this.handleSubmitReason(e)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <ModalNotice
          modalContent="Your decision to put this project On hold has been recorded."
          visible={visible}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default ReasonPutOnHold;
