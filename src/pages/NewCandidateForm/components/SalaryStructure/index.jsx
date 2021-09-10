import { Col, Form, notification, Row, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';
import SalaryNote from './components/SalaryNote';
import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import styles from './index.less';

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
    const { candidate = '', dispatch, processStatus } = this.props;

    if (processStatus === 'DRAFT') {
      if (dispatch && candidate) {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            candidate,
            currentStep: 2,
          },
        });
      }
    }
  }

  // componentDidMount() {
  //   window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  // }

  // _renderTable = () => {
  //   return (
  //     <div className={styles.tableWrapper}>
  //       <p>{formatMessage({ id: 'component.salaryStructure.tableWrapper' })}</p>
  //     </div>
  //   );
  // };

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
      type: 'newCandidateForm/updateByHR',
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
      salaryTitle = '',
      loadingFetchCandidate = false,
      statusSalary,
      title: { name: jobTitle = '' } = {},
    } = this.props;

    if (loadingFetchCandidate) return <Skeleton />;
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader jobTitle={jobTitle} />
                {/* <hr /> */}
                <SalaryStructureTemplate salaryTitle={salaryTitle} />
              </div>
            </Form>
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>{statusSalary ? <SalaryAcceptance /> : <NoteComponent />}</Row>
            <Row>
              <MessageBox />
            </Row>

            <Row>{this._renderSalaryNote()}</Row>
            {/* <Row>{processStatus === 'DRAFT' ? '' : <SalaryAcceptance />}</Row> */}
          </div>
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
