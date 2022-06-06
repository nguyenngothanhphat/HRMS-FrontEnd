import { Button, Input } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
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
        <div className={styles.header}>
          <span className={styles.title}>Reason for putting On-hold</span>
          <div className={styles.rightPart}>
            <span className={styles.time}>{date}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.textArea}>
            <TextArea
              className={styles.box}
              allowClear
              placeholder="The reason I have decided to end out this request on-hold is because …"
              value={q}
              disabled={loadingReview}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className={styles.buttonArea}>
          <span className={styles.description}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </span>
          <div className={styles.buttons}>
            <Button type="link" className={styles.putOnHoldBtn} onClick={hideForm}>
              Cancel
            </Button>
            <Button type="primary" onClick={this.handleSubmitReason} loading={loadingReview}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReasonPutOnHold;
