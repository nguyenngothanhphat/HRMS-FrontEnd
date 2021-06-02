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
      isChanging: false,
    };
  }

  componentDidMount() {
    const {
      myRequest: {
        lastWorkingDate = '',
        requestLastDate = '',
        commentRequestLastDate: q = '',
        statusLastDate = '',
      } = {},
    } = this.props;
    this.setState({
      q,
      lastDate: statusLastDate === 'REQUESTED' ? requestLastDate : lastWorkingDate,
    });
  }

  handleRequestChangeLWD = (action) => {
    const { dispatch, myRequest: { _id: offBoardingId = '', lastWorkingDate = '' } = {} } =
      this.props;
    const { lastDate } = this.state;
    const payload = {
      offBoardingId,
      action,
      lastWorkingDate: action === 'ACCEPTED' ? lastDate : lastWorkingDate,
    };
    // const date = action === 'ACCEPTED' ? requestLastDate : lastWorkingDate;
    dispatch({
      type: 'offboarding/handleRequestChangeLWD',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        // this.handleSubmit(date);
        dispatch({
          type: 'offboarding/fetchRequestById',
          payload: {
            id: offBoardingId,
          },
        });
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
      isChanging: true,
    });
  };

  openEdit = (nodeStep) => {
    if (nodeStep === 3 || nodeStep === 4) {
      this.setState({ isEdit: true });
    }
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

  getDatePickerValue = () => {
    const { myRequest: { lastWorkingDate = null, requestDate = '' } = {} } = this.props;
    const { lastDate = '', isChanging } = this.state;
    if (isChanging) {
      return moment(lastDate);
    }
    if (!lastWorkingDate) {
      return moment(requestDate).add('90', 'days');
    }
    return lastWorkingDate;
  };

  render() {
    const { myRequest: { requestLastDate = '', statusLastDate = '', nodeStep = 0 } = {}, loading } =
      this.props;
    const { visible, keyModal, isEdit, q } = this.state;
    const checkDisable = statusLastDate !== 'REQUESTED' && !isEdit;
    // const disableButtonSubmit = this.checkDisableButtonSubmit();

    const dateValue = this.getDatePickerValue();

    return (
      <>
        <div className={styles.viewChangeLastWorkingDay}>
          <div className={styles.viewChangeLastWorkingDay__title}>
            <span className={styles.textTitle}>
              Last working day
              {statusLastDate === 'REQUESTED' ? (
                <>{moment(dateValue).isValid() ? '(Manager requested)' : '(HR Manager approved)'}</>
              ) : null}
            </span>
            {!isEdit ? (
              <div
                className={styles.editBtn}
                onClick={() => this.openEdit(nodeStep)}
                style={nodeStep > 4 || nodeStep < 3 ? { opacity: 0.5 } : null}
              >
                <span>Edit</span>
              </div>
            ) : (
              <div className={styles.editBtn} style={{ color: 'red' }} onClick={this.closeEdit}>
                <span>Cancel</span>
              </div>
            )}
          </div>
          <div className={styles.contentContainer}>
            <span
              className={styles.viewChangeLastWorkingDay__label}
              style={{ marginBottom: '10px' }}
            >
              Last working day
            </span>
            <Row className={styles.viewChangeLastWorkingDay__viewDateApproved} gutter={[50, 0]}>
              <Col span={8}>
                <DatePicker
                  value={moment(dateValue).isValid() ? moment(dateValue) : null}
                  format={dateFormat}
                  onChange={this.changeDate}
                  className={styles.viewChangeLastWorkingDay__viewDateApproved__datePicker}
                  disabled={!isEdit}
                  allowClear={false}
                />
              </Col>
              <Col
                span={16}
                className={styles.viewChangeLastWorkingDay__viewDateApproved__description}
              >
                {/* <div className={styles.notice}>
                  <span className={styles.content}>
                    The LWD is generated as per a 90 days period according to our{' '}
                    <span className={styles.link}>Standard Offboarding Policy</span>
                  </span>
                </div> */}
              </Col>
            </Row>

            {requestLastDate && (
              <>
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
              </>
            )}
          </div>

          {(nodeStep < 4 || isEdit) && (
            <div className={styles.bottomPart}>
              <div
                className={styles.contentViewButton}
                style={!requestLastDate ? { justifyContent: 'flex-end' } : {}}
              >
                {requestLastDate ? (
                  <>
                    {statusLastDate === 'REQUESTED' && (
                      <Button
                        type="link"
                        disabled={checkDisable}
                        className={styles.btnReject}
                        onClick={() => this.handleRequestChangeLWD('REJECT')}
                      >
                        Reject
                      </Button>
                    )}
                    <Button
                      disabled={checkDisable}
                      className={styles.btnSubmit}
                      onClick={() => this.handleRequestChangeLWD('ACCEPTED')}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={nodeStep > 4 || nodeStep < 3}
                    className={styles.btnSubmit}
                    onClick={() => this.handleRequestChangeLWD('ACCEPTED')}
                  >
                    Approve
                  </Button>
                )}
                {/* <Button
                onClick={() => this.handleSubmit(lastDate)}
                disabled={disableButtonSubmit}
                className={styles.btnSubmit}
              >
                Submit
              </Button> */}
              </div>
            </div>
          )}
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
