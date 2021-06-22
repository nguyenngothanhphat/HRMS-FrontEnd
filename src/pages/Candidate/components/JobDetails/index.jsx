import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button, notification } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import Header from './components/Header';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import FieldsComponent from './components/FieldsComponent';

import styles from './index.less';
// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(({ candidateProfile: { data, jobDetails, checkMandatory, localStep } = {} }) => ({
  jobDetails,
  checkMandatory,
  data,
  localStep,
}))
class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('jobDetails' in props) {
      return {
        jobDetails: props.jobDetails,
        localStep: props.localStep,
      };
    }
    return null;
  }

  componentDidMount() {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    const {
      data: { dateOfJoining = '', noticePeriod = '' },
      dispatch,
      checkMandatory,
    } = this.props;

    if (dateOfJoining && noticePeriod) {
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledJobDetail: true,
          },
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, checkMandatory, data } = this.props;

    const { dateOfJoining = '', noticePeriod = '' } = data;
    let valid = false;
    if (dateOfJoining && noticePeriod) {
      valid = true;
    } else {
      valid = false;
    }

    if (prevProps.checkMandatory.filledJobDetail !== valid) {
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledJobDetail: valid,
          },
        },
      });
    }
  }

  _handleSelect = (value, name) => {
    const { dispatch, data } = this.props;
    const { jobDetails = {} } = this.state;
    jobDetails[name] = value;
    const { dateOfJoining, noticePeriod } = data;

    let newNoticePeriod = noticePeriod;
    let newDateOfJoining = dateOfJoining;

    if (name === 'candidatesNoticePeriod') {
      newNoticePeriod = value;
    }
    if (name === 'prefferedDateOfJoining') {
      newDateOfJoining = value;
      notification.success({
        message: 'New Joining Date has been saved and the HR has been notified.',
      });
    }

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        // jobDetails,
        data: {
          ...data,
          dateOfJoining: newDateOfJoining,
          noticePeriod: newNoticePeriod,
        },
      },
    });
  };

  onClickNext = () => {
    const { jobDetails } = this.state;
    const { candidatesNoticePeriod, prefferedDateOfJoining } = jobDetails;
    const {
      dispatch,
      data: { _id, dateOfJoining = '', noticePeriod = '' },
      data,
      localStep,
    } = this.props;

    // const convert = (str) => {
    //   const date = new Date(str);
    //   const mnth = `0 ${date.getMonth() + 1}`.slice(-2);
    //   const day = `0 ${date.getDate() + 1}`.slice(-2);
    //   return [mnth, day, date.getFullYear()].join('/');
    // };

    const converted = prefferedDateOfJoining?._d?.toLocaleDateString() || dateOfJoining;

    dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        noticePeriod: candidatesNoticePeriod || noticePeriod,
        dateOfJoining: converted,
        candidate: _id,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
        data: {
          ...data,
          noticePeriod: candidatesNoticePeriod || noticePeriod,
          dateOfJoining: converted,
        },
      },
    });
  };

  onClickPrev = () => {
    const { localStep } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledJobDetail } = checkMandatory;
    return filledJobDetail ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    const { checkMandatory } = this.props;
    const { filledJobDetail } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              <Button
                type="secondary"
                onClick={this.onClickPrev}
                className={styles.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  filledJobDetail ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={filledJobDetail}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const Tab = {
      positionTab: {
        title: formatMessage({ id: 'component.jobDetail.positionTab' }),
        name: 'position',
      },
      classificationTab: {
        title: formatMessage({ id: 'component.jobDetail.classificationTab' }),
        name: 'employeeType',
      },
    };
    const HRField = [
      {
        title: 'workLocation',
        name: `${formatMessage({ id: 'component.jobDetail.workLocation' })}*`,
        id: 1,
      },
      {
        title: 'department',
        name: `${formatMessage({ id: 'component.jobDetail.department' })}*`,
        id: 2,
      },
      {
        title: 'title',
        name: 'Job Title*',
        id: 3,
      },
      {
        title: 'reportingManager',
        name: `${formatMessage({ id: 'component.jobDetail.reportingManager' })}*`,
        id: 4,
      },
    ];
    const candidateField = [
      {
        title: `candidatesNoticePeriod`,
        name: formatMessage({ id: 'component.jobDetail.candidateNoticePeriod' }),
        id: 1,
      },
      {
        title: 'prefferedDateOfJoining',
        name: formatMessage({ id: 'component.jobDetail.prefferedDateOfJoining' }),
        id: 2,
      },
    ];

    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    const { data = {} } = this.props;
    return (
      <div>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className={styles.JobDetailsComponent}>
              <Header />
              <FieldsComponent
                Tab={Tab}
                data={data}
                HRField={HRField}
                candidateField={candidateField}
                _handleSelect={this._handleSelect}
              />
              {this._renderBottomBar()}
            </div>
          </Col>
          <Col className={styles.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className={styles.rightWrapper}>
              <Row>
                <NoteComponent note={Note} />
              </Row>
              <Row className={styles.stepRow}>
                <StepsComponent />
              </Row>
            </div>
          </Col>
        </Row>
        {/* )} */}
      </div>
    );
  }
}

export default JobDetails;
