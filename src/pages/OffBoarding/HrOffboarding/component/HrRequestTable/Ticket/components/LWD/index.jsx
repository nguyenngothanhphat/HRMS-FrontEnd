import React, { Component, Fragment } from 'react';
import { Row, Col, DatePicker, Input, Button } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
// import editIcon from '@/assets/edit-off-boarding.svg';
import styles from './index.less';

const dateFormat = 'MM.DD.YY';
const { TextArea } = Input;

@connect(({ offboarding: { myRequest = {} } = {}, loading }) => ({
  myRequest,
  loading: loading.effects['offboarding/requestChangeLWD'],
}))
class RequestChangeLWD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastDate: '',
      isEdit: false,
    };
  }

  componentDidMount() {
    const { myRequest: { lastWorkingDate = '' } = {} } = this.props;
    this.setState({ lastDate: lastWorkingDate });
  }

  handleRequestChangeLWD = (action) => {
    const {
      dispatch,
      myRequest: { _id: id = '', requestLastDate = '', lastWorkingDate = '' } = {},
    } = this.props;
    const payload = { id, action };
    const date = action === 'ACCEPTED' ? requestLastDate : lastWorkingDate;
    dispatch({
      type: 'offboarding/handleRequestChangeLWD',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleSubmit(date);
      }
    });
  };

  handleSubmit = (lastWorkingDate) => {
    const { dispatch, myRequest: { _id: id = '' } = {} } = this.props;
    dispatch({
      type: 'offboarding/reviewRequest',
      payload: {
        id,
        action: 'ACCEPTED',
        lastWorkingDate,
      },
    });
  };

  changeDate = (_, lastDate) => {
    this.setState({
      lastDate,
    });
  };

  openEdit = () => {
    this.setState({ isEdit: true });
  };

  closeEdit = () => {
    const { myRequest: { lastWorkingDate = '' } = {} } = this.props;
    this.setState({ isEdit: false, lastDate: lastWorkingDate });
  };

  checkDisableButtonSubmit = () => {
    const { myRequest: { statusLastDate = '', approvalStep = 1 } = {} } = this.props;
    const { isEdit } = this.state;
    let check = false;
    if (approvalStep === 1 && statusLastDate === 'REQUESTED' && !isEdit) {
      check = true;
    } else if (approvalStep === 2) {
      check = !isEdit;
    }
    return check;
  };

  render() {
    const {
      myRequest: { requestLastDate = '', commentRequestLastDate = '', statusLastDate = '' } = {},
    } = this.props;
    const { lastDate = '', isEdit } = this.state;
    const dateValue = lastDate ? moment(lastDate).locale('en').format('MM.DD.YY') : null;
    const checkDisable = statusLastDate !== 'REQUESTED';
    const disableButtonSubmit = this.checkDisableButtonSubmit();
    return (
      <div className={styles.viewChangeLastWorkingDay}>
        <div className={styles.viewTop}>
          <p className={styles.viewChangeLastWorkingDay__title}>Resignation request details</p>
          {!isEdit ? (
            <div className={styles.textEdit} onClick={this.openEdit}>
              Edit
            </div>
          ) : (
            <div className={styles.textClose} onClick={this.closeEdit}>
              Close
            </div>
          )}
        </div>

        <p className={styles.viewChangeLastWorkingDay__label}>
          Last working day (generated by system)
        </p>
        <Row className={styles.viewChangeLastWorkingDay__viewDateApproved} gutter={[50, 0]}>
          <Col span={8}>
            <DatePicker
              value={dateValue ? moment(dateValue) : null}
              format={dateFormat}
              className={styles.viewChangeLastWorkingDay__viewDateApproved__datePicker}
              onChange={this.changeDate}
              disabled={!isEdit}
            />
          </Col>
          <Col span={16} className={styles.viewChangeLastWorkingDay__viewDateApproved__description}>
            <span className={styles.viewChangeLastWorkingDay__viewDateApproved__description__text1}>
              A last working date (LWD) is generated as per a 90 days notice period according to our{' '}
            </span>
            <span className={styles.viewChangeLastWorkingDay__viewDateApproved__description__text2}>
              Standard Resignation Policy
            </span>
          </Col>
        </Row>
        {requestLastDate && (
          <>
            <div className={styles.viewChangeLastWorkingDay__textMessage}>
              <span className={styles.viewChangeLastWorkingDay__textMessage__bold}>
                Extend and shorten LWD is sent to HR Manager
              </span>
              <span className={styles.viewChangeLastWorkingDay__textMessage__date}>
                {requestLastDate && moment(requestLastDate).format('YYYY/MM/DD')}
              </span>
            </div>
            <div className={styles.viewComment}>
              <div className={styles.viewTop}>
                <div className={styles.viewTop__name}>
                  Reporting manager’s comments extend or shorten LWD
                </div>
              </div>
              <TextArea
                className={styles.boxComment}
                onChange={this.handleChange}
                value={commentRequestLastDate}
                disabled
              />
            </div>
          </>
        )}
        <div className={styles.containerButton}>
          <div
            className={styles.contentViewButton}
            style={!requestLastDate ? { justifyContent: 'flex-end' } : {}}
          >
            {requestLastDate && (
              <>
                <Button
                  type="link"
                  disabled={checkDisable}
                  className={styles.btnApprove}
                  onClick={() => this.handleRequestChangeLWD('ACCEPTED')}
                >
                  Approve
                </Button>
                <Button
                  type="link"
                  disabled={checkDisable}
                  className={styles.btnReject}
                  onClick={() => this.handleRequestChangeLWD('REJECT')}
                >
                  Reject
                </Button>
              </>
            )}
            <Button
              className={styles.btnSubmit}
              onClick={() => this.handleSubmit(lastDate)}
              disabled={disableButtonSubmit}
              // disabled={this.checkDisableButtonSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestChangeLWD;
