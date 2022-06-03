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
import { mapType } from '@/utils/newCandidateForm';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import ViewCommentModalContent from './components/ViewCommentModalContent';
import TechnicalCertification from './components/TechnicalCertification';
import PreviousEmployment from './components/PreviousEmployment';

const BackgroundRecheck = (props) => {
  const {
    newCandidateForm: {
      tempData = {},
      tempData: {
        documentTypeA = [],
        documentTypeB = [],
        documentTypeC = [],
        documentTypeD = [],
        documentTypeE = [],
        ticketID = '',
        candidate,
        processStatus = '',
        documentLayout = [],
      },
      currentStep = '',
    } = {},
    // loadingUpdateByHR = false,
    dispatch,
  } = props;

  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [viewCommentModalVisible, setViewCommentModalVisible] = useState(false);
  const [selectingFile, setSelectingFile] = useState(null);
  const [action, setAction] = useState('');

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
    const checkDocumentUploadedTypeE = (arr) => {
      if (arr.length === 0) return true;
      let check = false;
      arr.forEach((x) => {
        const { data: dataArr = [] } = x;
        check = checkDocumentUploaded(dataArr);
      });
      return check;
    };

    return (
      checkDocumentUploaded(documentTypeA) &&
      checkDocumentUploaded(documentTypeB) &&
      checkDocumentUploaded(documentTypeC) &&
      checkDocumentUploaded(documentTypeD) &&
      checkDocumentUploadedTypeE(documentTypeE)
    );
  };

  useEffect(() => {
    goToTop();
  }, []);

  useLayoutEffect(() => {
    if (
      documentTypeA.length > 0 ||
      documentTypeB.length > 0 ||
      documentTypeC.length > 0 ||
      documentTypeD.length > 0 ||
      documentTypeE.length > 0
    ) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          documentTypeA,
          documentTypeB,
          documentTypeC,
          documentTypeD,
          documentTypeE,
        },
      });
      const check = validateFiles();
      setValidated(check);
    }
  }, [
    JSON.stringify(documentTypeA),
    JSON.stringify(documentTypeB),
    JSON.stringify(documentTypeC),
    JSON.stringify(documentTypeD),
    JSON.stringify(documentTypeE),
  ]);

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
    const dataA = documentTypeA.filter((x) => x.value || x.required);
    const dataB = documentTypeB.filter((x) => x.value || x.required);
    const dataC = documentTypeC.filter((x) => x.value || x.required);

    const items = [
      {
        component: dataA.length > 0 && (
          <CollapseField
            items={dataA || []}
            layout={documentLayout.find((x) => x.type === 'A')}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: dataB.length > 0 && (
          <CollapseField
            items={dataB || []}
            layout={documentLayout.find((x) => x.type === 'B')}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: dataC.length > 0 && (
          <CollapseField
            items={dataC || []}
            layout={documentLayout.find((x) => x.type === 'C')}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: documentTypeD.length > 0 && (
          <TechnicalCertification
            items={documentTypeD || []}
            layout={documentLayout.find((x) => x.type === 'D')}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: documentTypeE.length > 0 && (
          <PreviousEmployment
            items={documentTypeE}
            layout={documentLayout.find((x) => x.type === 'E')}
            onVerifyDocument={onVerifyDocumentTypeE}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
    ];
    return items.map((x) => x.component && <Col span={24}>{x.component}</Col>);
  };

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
  };

  const onClickNext = async () => {
    const nextStep =
      processStatus === NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION
        ? ONBOARDING_STEPS.REFERENCES
        : currentStep;
    const nextStatus =
      processStatus === NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION
        ? NEW_PROCESS_STATUS.REFERENCE_VERIFICATION
        : processStatus;

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
        history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.REFERENCES}`);
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
                  Next
                </Button>
              </Space>
              <RenderAddQuestion page={Page.Eligibility_documents} />
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  const onSaveRedux = (result, type) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        [mapType[type]]: result,
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
    let items = [...tempData[mapType[selectingFile?.type]]];

    const func = (arr1) => {
      return arr1.map((x) => {
        if (x.key === selectingFile?.item?.key) {
          return {
            ...x,
            ...payload,
          };
        }
        return x;
      });
    };

    if (selectingFile?.type !== 'E') {
      items = func(items);
    } else {
      items = items.map((x, i) => {
        if (i === selectingFile?.index) {
          return {
            ...x,
            data: func(x.data),
          };
        }
        return x;
      });
    }
    onSaveRedux(items, selectingFile?.type);
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
          <p className={styles.backgroundRecheck__title}>Document Verification</p>
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
