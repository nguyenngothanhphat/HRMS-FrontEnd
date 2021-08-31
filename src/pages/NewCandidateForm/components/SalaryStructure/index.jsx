import React, { PureComponent } from 'react';
import { Row, Col, Typography, Form, Input, Button, notification, Skeleton } from 'antd';
import {
  connect,
  // formatMessage
} from 'umi';

import { getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import NoteComponent from '../NoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';
import MessageBox from '../MessageBox';
import styles from './index.less';

// const DRAFT = 'DRAFT';
// const SENT_PROVISIONAL_OFFER = 'SENT-PROVISIONAL-OFFER';
// const ACCEPT_PROVISIONAL_OFFER = 'ACCEPT-PROVISIONAL-OFFER';
// const RENEGOTIATE_PROVISIONAL_OFFER = 'RENEGOTIATE-PROVISIONAL-OFFER';
// const DISCARDED_PROVISIONAL_OFFER = 'DISCARDED-PROVISIONAL-OFFER';
const { TextArea } = Input;
@connect(
  ({
    loading,
    newCandidateForm: {
      data: { processStatus = '', candidate = '', _id: candidateId = '' },
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
    const disableCheck = processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT;

    return (
      <div className={styles.salaryNote}>
        <span className={styles.title}>Salary Structure Note</span>
        <TextArea
          defaultValue={salaryNoteTemp}
          onChange={this.onSalaryNoteChange}
          disabled={disableCheck}
          placeholder="Notes"
          autoSize={{ minRows: 3, maxRows: 7 }}
          style={{ marginBottom: '7px' }}
        />
        <Button disabled={disableCheck} onClick={this.saveSalaryNote}>
          Save note
        </Button>
      </div>
    );
  };

  render() {
    const { processStatus, salaryTitle = '', loadingFetchCandidate = false } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          The Salary structure will be sent as a <span>provisional offer</span>. The candidate must
          accept the and acknowledge the salary structure as a part of final negotiation. <br />
          <br />
          <span className="bold-text">
            Post acceptance of salary structure, the final offer letter will be sent.
          </span>
        </Typography.Text>
      ),
    };

    if (loadingFetchCandidate) return <Skeleton />;
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader />
                {/* <hr /> */}
                <SalaryStructureTemplate salaryTitle={salaryTitle} />
              </div>
            </Form>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              {processStatus !== 'DRAFT' ? <SalaryAcceptance /> : <NoteComponent note={Note} />}
            </Row>
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
