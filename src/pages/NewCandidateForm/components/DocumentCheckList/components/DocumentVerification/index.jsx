/* eslint-disable no-param-reassign */
import { Button, Col, Row, Skeleton, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { Page } from '../../../../utils';
import MessageBox from '../../../MessageBox';
import NoteComponent from '../../../NewNoteComponent';
import CollapseFields from './components/CollapseFields';
import Title from './components/Title';
import styles from './styles.less';
import { DOCUMENTS_CHECKLIST_TYPE } from '@/utils/newCandidateForm';
import CollapseFieldsTypeH from './components/CollapseFieldsTypeH';

const DocumentVerification = (props) => {
  const {
    newCandidateForm: {
      rookieId = '',
      checkMandatory: { filledDocumentVerification = false } = {},
      tempData: {
        _id,
        processStatus = '',
        ticketID = '',
        documentChecklist = [],
        candidate = '',
      } = {} || {},
    },
    dispatch,
    loadingFetchCandidate,
  } = props;

  const { DRAFT, DOCUMENT_CHECKLIST_VERIFICATION, OFFER_ACCEPTED } = NEW_PROCESS_STATUS;

  const [listDocsTypeH, setListDocsTypeH] = useState([]);
  const [isSendCheckList, setIsSendCheckList] = useState(false);

  const validateFields = () => {
    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledDocumentVerification: true,
      },
    });
  };

  // // bottom bar
  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_LETTER}`);
  };

  const onClickNext = () => {
    setIsSendCheckList(true);
    dispatch({
      type: 'newCandidateForm/sendCheckListEffect',
      payload: {
        processStatus: DOCUMENT_CHECKLIST_VERIFICATION,
        currentStep: 8,
        documentChecklist,
        rookieId,
        candidate,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchDocumentsCheckList',
    });
  }, []);

  const _renderBottomBar = () => {
    return (
      <Col span={24}>
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col span={24}>
              <div className={styles.bottomBar__button}>
                <Space size={24}>
                  <Button
                    type="secondary"
                    onClick={onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={onClickNext}
                    className={`${styles.bottomBar__button__primary} ${
                      isSendCheckList ? styles.bottomBar__button__disabled : ''
                    }`}
                    disabled={isSendCheckList}
                  >
                    {isSendCheckList ? 'Sent' : 'Send'}
                  </Button>
                </Space>
                <RenderAddQuestion page={Page.Eligibility_documents} />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  const firstInit = () => {
    validateFields();
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
    if (_id) {
      firstInit();
    }
  }, [_id]);

  if (loadingFetchCandidate) return <Skeleton />;

  // S - Scan & Upload
  // E - Electronically Sign
  // H - Hard Copy

  useEffect(() => {
    setListDocsTypeH(documentChecklist.find((x) => x.type === DOCUMENTS_CHECKLIST_TYPE.H));
  }, [documentChecklist]);

  const getItemByType = (types) => {
    return documentChecklist.find((x) => x.type === types);
  };

  return (
    <Row gutter={[24, 24]} className={styles.DocumentVerification}>
      <Col sm={24} xl={16}>
        <div className={styles.leftWrapper}>
          <Row className={styles.eliContainer} gutter={[24, 24]}>
            <Title />

            {documentChecklist
              .filter((x) =>
                [DOCUMENTS_CHECKLIST_TYPE.S, DOCUMENTS_CHECKLIST_TYPE.E].includes(x.type),
              )
              .map((x) => {
                return <CollapseFields layout={x} items={getItemByType(x.type)} />;
              })}

            {/* <CollapseFieldsTypeE items={listDocsTypeE} /> */}
            <CollapseFieldsTypeH items={listDocsTypeH} />

            {_renderBottomBar()}
          </Row>
        </div>
      </Col>
      <Col xs={24} xl={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <NoteComponent />
          </Col>
          <Col span={24}>
            <MessageBox />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default connect(
  ({
    newCandidateForm,
    loading,
    currentStep = '',
    user: { companiesOfUser = [] },
    conversation: { conversationList = [] } = {},
  }) => ({
    currentStep,
    newCandidateForm,
    companiesOfUser,
    conversationList,
    loading4: loading.effects['newCandidateForm/submitPhase1Effect'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(DocumentVerification);
