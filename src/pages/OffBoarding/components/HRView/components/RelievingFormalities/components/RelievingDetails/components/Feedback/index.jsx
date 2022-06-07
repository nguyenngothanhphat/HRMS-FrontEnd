import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import FeedbackForm from '../ConductExit/components/FeedbackForm';
import FeedbackFormContent from '../ConductExit/components/FeedbackFormContent';
import styles from './index.less';

@connect(({ offboarding: { relievingDetails = {} } = {} }) => ({
  relievingDetails,
}))
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleViewFeedBack = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  renderFeedbackForm = () => {
    const { visible } = this.state;
    const {
      relievingDetails: { exitInterviewFeedbacks: { waitList = [] } = {} } = {},
    } = this.props;
    let itemFeedBack = {};
    if (waitList.length > 0) {
      [itemFeedBack] = waitList;
    }
    return (
      <FeedbackForm
        content={
          <FeedbackFormContent
            itemFeedBack={itemFeedBack}
            handleCancelEdit={this.handleViewFeedBack}
            disabled
          />
        }
        visible={visible}
        handleCancelEdit={this.handleViewFeedBack}
        disabled
      />
    );
  };

  render() {
    const {
      itemSchedule: {
        updatedAt = '',
        ownerComment: { employeeId = '', generalInfo: { firstName = '' } = {} } = {},
      } = {},
    } = this.props;
    const time = moment(updatedAt).format('DD.MM.YY | h:mm A');
    return (
      <>
        <div className={styles.feedback}>
          <p className={styles.feedback__title}>
            {formatMessage({ id: 'pages.relieving.feedbackFrom' })}
          </p>
          <Row gutter={[10, 15]} align="middle" justify="s">
            <Col span={8}>
              <div className={styles.template} onClick={this.handleViewFeedBack}>
                <div className={styles.template__content}>
                  <img src={templateIcon} alt="template-icon" />
                  <span>Feedback Form</span>
                </div>
              </div>
            </Col>
            <Col span={16} className={styles.feedback__text}>
              {formatMessage({ id: 'pages.relieving.conducted' })} [{employeeId}] {firstName} |
              {time}
            </Col>
          </Row>
        </div>
        {this.renderFeedbackForm()}
      </>
    );
  }
}

export default Feedback;
