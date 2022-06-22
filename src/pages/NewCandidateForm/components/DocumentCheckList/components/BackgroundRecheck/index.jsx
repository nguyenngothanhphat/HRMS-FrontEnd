import { Button, Col, Row, Space } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect, history } from 'umi';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
import { goToTop } from '@/utils/utils';
import { Page } from '../../../../utils';
import MessageBox from '../../../MessageBox';
import NoteComponent from '../../../NewNoteComponent';
import styles from './index.less';
import CollapseField from './components/CollapseFields';
import CommonModal from '@/components/CommonModal';
import VerifyDocumentModalContent from './components/VerifyDocumentModalContent';
import { DOCUMENTS_CHECKLIST_TYPE, mapType } from '@/utils/newCandidateForm';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import ViewCommentModalContent from './components/ViewCommentModalContent';
import TechnicalCertification from './components/TechnicalCertification';
import PreviousEmployment from './components/PreviousEmployment';
import CollapseFieldsTypeH from './components/CollapseFieldsTypeH';

const BackgroundRecheck = (props) => {
  const {
    newCandidateForm: {
      tempData = {},
      tempData: { ticketID = '', candidate, processStatus = '', documentChecklist = [] },
      currentStep = '',
    } = {},
    // loadingUpdateByHR = false,
    dispatch,
  } = props;

  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [viewCommentModalVisible, setViewCommentModalVisible] = useState(false);
  const [selectingFile, setSelectingFile] = useState(null);
  const [action, setAction] = useState('');

  const documentTypeS = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.S,
  ).documents;
  const documentTypeE = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.E,
  ).documents;
  const documentTypeH = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.H,
  ).documents;

  const [validated, setValidated] = useState(false);

  const validateFiles = () => {
    // for type A, B, C, D
    const checkDocumentUploaded = (arr = []) => {
      if (arr.length === 0) return true;
      return arr
        .filter((x) => x.required || x.value)
        .every(
          (x) =>
            x.status === DOCUMENT_TYPES.VERIFIED ||
            x.status === DOCUMENT_TYPES.NOT_AVAILABLE_ACCEPTED,
        );
    };
    // for type E
    // const checkDocumentUploadedTypeE = (arr) => {
    //   if (arr.length === 0) return true;
    //   let check = false;
    //   arr.forEach((x) => {
    //     const { data: dataArr = [] } = x;
    //     check = checkDocumentUploaded(dataArr);
    //   });
    //   return check;
    // };

    return checkDocumentUploaded(documentTypeS) && checkDocumentUploaded(documentTypeE);
  };

  useEffect(() => {
    goToTop();
  }, []);

  useLayoutEffect(() => {
    if (documentTypeS.length > 0 || documentTypeE.length > 0 || documentTypeH.length > 0) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          documentChecklist,
        },
      });
      const check = validateFiles();
      setValidated(check);
    }
  }, [JSON.stringify(documentChecklist)]);

  const onVerifyDocument = (typeProp, itemProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
    });
    setVerifyModalVisible(true);
  };

  const onVerifyDocumentTypeE = (typeProp, itemProp, indexProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
      index: indexProp,
    });
    setVerifyModalVisible(true);
  };

  const onViewCommentClick = (typeProp, itemProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
    });
    setViewCommentModalVisible(true);
  };

  const _renderItems = () => {
    const dataS = documentTypeS.filter((x) => x.value || x.required);
    const dataE = documentTypeE.filter((x) => x.value || x.required);

    const items = [
      {
        component: dataS.length > 0 && (
          <CollapseField
            items={dataS || []}
            layout={documentChecklist.find((x) => x.type === DOCUMENTS_CHECKLIST_TYPE.S)}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: dataE.length > 0 && (
          <CollapseField
            items={dataE || []}
            layout={documentChecklist.find((x) => x.type === DOCUMENTS_CHECKLIST_TYPE.E)}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: documentTypeH.length > 0 && <CollapseFieldsTypeH items={documentTypeH} />,
      },
    ];
    return items.map((x) => x.component && <Col span={24}>{x.component}</Col>);
  };

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_LETTER}`);
  };

  const onClickNext = async () => {
    const nextStep = currentStep;
    const nextStatus = processStatus;

    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        currentStep: nextStep,
        processStatus: nextStatus,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: nextStep,
          },
        });
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            processStatus: nextStatus,
          },
        });
      }
    });
  };

  const _renderBottomBar = () => {
    return (
      <Col span={24}>
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col className={styles.bottomBar__button} span={24}>
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
                  className={[
                    styles.bottomBar__button__primary,
                    !validated ? styles.bottomBar__button__disabled : '',
                  ]}
                  disabled={!validated}
                  // loading={loadingUpdateByHR}
                >
                  Complete
                </Button>
              </Space>
              <RenderAddQuestion page={Page.Eligibility_documents} />
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  const onSaveRedux = (result) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklist: result,
      },
    });
  };

  const onCloseModal = () => {
    setVerifyModalVisible(false);
    setViewCommentModalVisible(false);
    setSelectingFile(null);
    setAction('');
  };

  const assignPayloadToData = (payload) => {
    let items = documentChecklist;

    const func = (arr) => {
      return arr.map((x) => {
        if (x.key === selectingFile?.item?.key) {
          return {
            ...x,
            ...payload,
          };
        }
        return x;
      });
    };

    items = items.map((x) => {
      if (x.type === selectingFile?.type) {
        return {
          ...x,
          documents: func(x.documents),
        };
      }
      return x;
    });

    onSaveRedux(items);
  };

  const onVerified = () => {
    assignPayloadToData({ status: DOCUMENT_TYPES.VERIFIED, resubmitComment: '' });
    onCloseModal();
  };

  const onResubmit = (values) => {
    assignPayloadToData({
      resubmitComment: values.resubmitComment,
      status: DOCUMENT_TYPES.RESUBMIT_PENDING,
    });
    onCloseModal();
  };

  const onRejectNotAvailable = (values) => {
    assignPayloadToData({
      hrNotAvailableComment: values.hrNotAvailableComment,
      status: DOCUMENT_TYPES.NOT_AVAILABLE_REJECTED,
    });
    onCloseModal();
  };

  const onAcceptNotAvailable = () => {
    assignPayloadToData({
      status: DOCUMENT_TYPES.NOT_AVAILABLE_ACCEPTED,
    });
    onCloseModal();
  };

  return (
    <div className={styles.backgroundRecheck}>
      <Row gutter={[24, 24]}>
        <Col span={24} xl={16}>
          <p className={styles.backgroundRecheck__title}>Pre-Joinging Documents</p>
          <p className={styles.backgroundRecheck__subTitle}>
            All documents supporting candidate&apos;s employment eligibility will be displayed here
          </p>
          <Row gutter={[24, 24]} className={styles.backgroundRecheck__left}>
            {_renderItems()}
            {_renderBottomBar()}
          </Row>
        </Col>
        <Col span={24} xl={8}>
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

      {/* verify and resubmit modal  */}
      <CommonModal
        visible={verifyModalVisible}
        onClose={onCloseModal}
        content={
          <VerifyDocumentModalContent
            onClose={onCloseModal}
            action={action}
            setAction={setAction}
            item={selectingFile?.item}
            onResubmit={action ? onResubmit : () => {}}
          />
        }
        onSecondButtonClick={action ? () => setAction('') : () => setAction('resubmit')}
        hasCancelButton={false}
        hasSecondButton
        firstText={action ? 'Submit' : 'Verified'}
        secondText={action ? 'Cancel' : 'Resubmit'}
        title={`${selectingFile?.item?.alias} ${action ? 'for Resubmission' : ''}`}
        width={600}
        onFinish={action ? () => {} : onVerified}
      />

      {/* view candidate comment modal  */}
      <CommonModal
        visible={viewCommentModalVisible}
        title="View Comment"
        width={500}
        onClose={onCloseModal}
        content={
          <ViewCommentModalContent
            onClose={onCloseModal}
            selectedFile={selectingFile?.item}
            action={action}
            setAction={setAction}
            item={selectingFile?.item}
            onFinish={action ? onRejectNotAvailable : () => {}}
          />
        }
        onSecondButtonClick={action ? () => setAction('') : () => setAction('notAvailableReject')}
        hasCancelButton={false}
        hasSecondButton
        firstText={action ? 'Add' : 'Approve'}
        secondText={action ? 'Cancel' : 'Reject'}
        onFinish={action ? () => {} : onAcceptNotAvailable}
      />
    </div>
  );
};
export default connect(({ newCandidateForm, loading }) => ({
  newCandidateForm,
  loadingGetById: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
}))(BackgroundRecheck);
