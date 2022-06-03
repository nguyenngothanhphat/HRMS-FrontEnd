import { Col, Form, notification, Row, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_STEPS } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';
import SalaryNote from './components/SalaryNote';
import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

@connect(
  ({
    loading,
    newCandidateForm: {
      data: {
        processStatus = '',
        candidate = '',
        _id: candidateId = '',
        salaryStructure: { status: statusSalary },
        title = {},
      },
      tempData: { salaryTitle = '', salaryNote: salaryNoteTemp = '' } = {},
      salaryStructure = {},
      checkMandatory = {},
      currentStep = 0,
    } = {},
  }) => ({
    candidateId,
    processStatus,
    salaryStructure,
    checkMandatory,
    candidate,
    currentStep,
    salaryTitle,
    title,
    statusSalary,
    loading2: loading.effects['newCandidateForm/fetchTitleList'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
    salaryNoteTemp,
  }),
)
class SalaryStructure extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      salaryNoteState: '',
    };
  }

  componentDidMount() {
    goToTop();
    const { candidate = '', dispatch, processStatus } = this.props;
    if (processStatus === 'DRAFT') {
      if (dispatch && candidate) {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            candidate,
            currentStep: ONBOARDING_STEPS.DOCUMENT_VERIFICATION,
          },
        });
      }
    }
  }

  onSalaryNoteChange = (e) => {
    const { target: { value = '' } = {} } = e;
    this.setState({
      salaryNoteState: value,
    });
  };

  saveSalaryNote = () => {
    const { dispatch, candidateId = '' } = this.props;
    const { salaryNoteState } = this.state;

    dispatch({
      type: 'newCandidateForm/saveNoteSalary',
      payload: {
        salaryNote: salaryNoteState,
        candidate: candidateId,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: 'Save salary structure note successfully.',
        });
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            salaryNote: salaryNoteState,
          },
        });
      }
    });
  };

  _renderSalaryNote = () => {
    const { processStatus = '', salaryNoteTemp = '' } = this.props;
    const disableCheck = processStatus !== NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
    return (
      <SalaryNote
        salaryNoteTemp={salaryNoteTemp}
        onChange={this.onSalaryNoteChange}
        disabled={disableCheck}
        onSubmit={this.saveSalaryNote}
      />
    );
  };

  render() {
    const {
      loadingFetchCandidate = false,
      statusSalary,
      title: { name: jobTitle = '' } = {},
    } = this.props;

    if (loadingFetchCandidate) return <Skeleton />;
    return (
      <Row gutter={[24, 24]}>
        <Col span={24} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader jobTitle={jobTitle} />
                {/* <hr /> */}
                <SalaryStructureTemplate />
              </div>
            </Form>
          </div>
        </Col>
        <Col span={24} xl={8}>
          <Row gutter={[24, 24]}>
            <Col span={24}>{statusSalary ? <SalaryAcceptance /> : <NoteComponent />}</Col>
            <Col span={24}>
              <MessageBox />
            </Col>
            <Col span={24}>{this._renderSalaryNote()}</Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
