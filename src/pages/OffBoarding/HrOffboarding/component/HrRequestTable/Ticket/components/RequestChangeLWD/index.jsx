import React, { Component, Fragment } from 'react';
import { Row, Col, DatePicker, Button, Input } from 'antd';
import ModalRequestChangeLWD from '@/components/ModalRequestChangeLWD';
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
      visible: false,
      keyModal: '',
      q: '',
      isEdit: false,
      lastDate: '',
    };
  }

  componentDidMount() {
    const { myRequest: { lastWorkingDate = '', commentRequestLastDate: q = '' } = {} } = this.props;
    this.setState({
      q,
      lastDate: lastWorkingDate,
    });
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
    const { myRequest: { requestLastDate = '', statusLastDate = '' } = {}, loading } = this.props;
    const { visible, keyModal, isEdit, q, lastDate = '' } = this.state;
    const checkDisable = statusLastDate !== 'REQUESTED';
    const disableButtonSubmit = this.checkDisableButtonSubmit();

    const dateValue = lastDate ? moment(lastDate).locale('en').format(dateFormat) : null;

    return (
      <>
        <div className={styles.viewChangeLastWorkingDay}>
          <div className={styles.viewChangeLastWorkingDay__title}>
            <span className={styles.textTitle}>Resignation request details</span>
            {!isEdit ? (
              <div className={styles.editBtn} onClick={this.openEdit}>
                <span>Edit</span>
              </div>
            ) : (
              <div className={styles.editBtn} style={{ color: 'red' }} onClick={this.closeEdit}>
                <span>Cancel</span>
              </div>
            )}
          </div>
          <div className={styles.contentContainer}>
            <span className={styles.viewChangeLastWorkingDay__label}>
              Last working day (generated by system)
            </span>
            <Row className={styles.viewChangeLastWorkingDay__viewDateApproved} gutter={[50, 0]}>
              <Col span={8}>
                <DatePicker
                  value={dateValue ? moment(dateValue) : null}
                  format={dateFormat}
                  onChange={this.changeDate}
                  className={styles.viewChangeLastWorkingDay__viewDateApproved__datePicker}
                  disabled={!isEdit}
                />
              </Col>
              <Col
                span={16}
                className={styles.viewChangeLastWorkingDay__viewDateApproved__description}
              >
                <div className={styles.notice}>
                  <span className={styles.content}>
                    The LWD is generated as per a 90 days period according to our{' '}
                    <span className={styles.link}>Standard Offboarding Policy</span>
                  </span>
                </div>
              </Col>
            </Row>
            <div className={styles.comments}>
              <div className={styles.viewChangeLastWorkingDay__label}>
                <span>Reporting manager’s comments extend or shorten LWD</span>
              </div>

              <div className={styles.textArea}>
                <TextArea
                  className={styles.boxComment}
                  value={q}
                  // onChange={this.handleChange}
                  disabled
                />
              </div>
            </div>
            {requestLastDate && (
              <div className={styles.viewChangeLastWorkingDay__textMessage}>
                <span
                  className={styles.viewChangeLastWorkingDay__label}
                  style={{ fontWeight: 'bold' }}
                >
                  Extend and shorten LWD is sent to HR Manager
                </span>
                <span className={styles.viewChangeLastWorkingDay__textMessage__date}>
                  {requestLastDate && moment(requestLastDate).format('MM.DD.YY')}
                </span>
              </div>
            )}
          </div>

          <div className={styles.bottomPart}>
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
                onClick={() => this.handleSubmit(lastDate)}
                disabled={disableButtonSubmit}
                className={styles.btnSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        <ModalRequestChangeLWD
          loading={loading}
          visible={visible}
          key={keyModal}
          handleCancel={this.handleModal}
          handleSubmit={this.submitRequest}
        />
      </>
    );
  }
}

export default RequestChangeLWD;
