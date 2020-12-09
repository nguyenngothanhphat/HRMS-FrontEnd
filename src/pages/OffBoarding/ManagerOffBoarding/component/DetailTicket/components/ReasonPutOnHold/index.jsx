import React, { Component } from 'react';
import { Row, Col, Input, Button, Space } from 'antd';
import warningNoteIcon from '@/assets/warning-icon.svg';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ loading, offboarding: { myRequest: { _id: id } = {} } = {} }) => ({
  id,
  loading: loading.effects['offboarding/create1On1'],
  loadingReview: loading.effects['offboarding/reviewRequest'],
}))
class ReasonPutOnHold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
    };
  }

  handleSubmitReason = () => {
    const { q } = this.state;
    const { dispatch, id } = this.props;
    const payload = { id, reasonOnHold: q, action: 'ON-HOLD' };
    dispatch({
      type: 'offboarding/reviewRequest',
      payload,
    });
  };

  handleChange = (e) => {
    this.setState({
      q: e.target.value,
    });
  };

  render() {
    const { q } = this.state;
    const { hideForm = () => {}, loadingReview } = this.props;
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
              <Button className={styles.btn__cancel} onClick={hideForm}>
                Cancel
              </Button>
              <Button
                disabled={!q}
                className={styles.btn__submit}
                onClick={this.handleSubmitReason}
                loading={loadingReview}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReasonPutOnHold;
