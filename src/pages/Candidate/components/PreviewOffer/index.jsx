import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Input, Form } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
// import logo from './components/images/brand-logo.png';
import CustomModal from '@/components/CustomModal';
import SendEmail from '@/pages/FormTeamMember/components/BackgroundCheck/components/SendEmail';
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
// import SendEmail from '../BackgroundCheck/components/SendEmail';
import ModalContent from './components/ModalContent';
import styles from './index.less';

// const INPUT_WIDTH = [50, 100, 18, 120, 100, 50, 100, 18, 120, 100]; // Width for each input field

const ROLE = {
  HRMANAGER: 'HR-MANAGER',
  HR: 'HR',
};

const PreviewOffer = (props) => {
  const { dispatch, currentUser = {}, tempData = {}, data = {}, candidate } = props;

  // const {
  //   // email: mailProp,
  //   hrSignature: hrSignatureProp,
  //   hrManagerSignature: hrManagerSignatureProp,
  // } = tempData;
  const {
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    candidateSignature: candidateSignatureProp = {},
    privateEmail: candidateEmailProp = '',
    fullName: candidateName = '',
  } = data;

  // const inputRefs = [];

  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  // eslint-disable-next-line no-unused-vars
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');

  const [uploadVisible1, setUploadVisible1] = useState(false);
  const [uploadVisible2, setUploadVisible2] = useState(false);

  const [mail, setMail] = useState(candidateEmailProp || '');
  const [mailForm] = Form.useForm();

  // const [role, setRole] = useState('');

  const [openModal, setOpenModal] = useState(false);

  // const resetForm = () => {
  //   mailForm.resetFields();
  // };

  const resetImg = () => {
    setCandidateSignature({});
  };

  const saveChanges = () => {
    // Save changes to redux store
    if (dispatch) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            email: mail,
            hrSignature,
            hrManagerSignature,
          },
        },
      });
    }
  };

  const loadImage = (response) => {
    const { data: responseData = [] } = response;
    const { url, id } = responseData[0];

    setCandidateSignature({
      url,
      id,
    });

    // save to Store
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        tempData: {
          ...tempData,
          candidateSignature: {
            id,
            url,
          },
        },
      },
    });

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        data: {
          ...data,
          // hrSignature: id,
          candidateSignature: {
            ...data.candidateSignature,
            id,
            url,
          },
        },
      },
    });
  };

  const handleSentForApproval = () => {
    if (!dispatch) {
      return;
    }

    const { id } = hrSignature;
    const { candidate } = data;
    // call API
    dispatch({
      type: 'candidateInfo/sentForApprovalEffect',
      payload: { hrSignature: id, candidate },
    });
  };

  const handleSendFinalOffer = () => {
    if (!dispatch) {
      return;
    }
    const { id } = hrManagerSignature;
    const { candidate } = data;
    // call API
    dispatch({
      type: 'candidateInfo/approveFinalOfferEffect',
      payload: { hrManagerSignature: id, candidate, options: 1 },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
      }
    });
  };

  const handleCandidateSubmit = () => {
    if (!dispatch) {
      return;
    }
    const { id } = candidateSignature;
    dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        candidateSignature: id,
        candidate,
      },
    });
  };

  const handleFinalSubmit = () => {
    console.log('Final submit');
    if (!dispatch) {
      return;
    }
    handleCandidateSubmit();
    dispatch({
      type: 'candidateProfile/submitCandidateFinalOffer',
      payload: {
        candidate,
        candidateFinalSignature: candidateSignature.id,
        options: 1,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
      }
    });
    // submitCandidateFinalOffer
  };

  const disableFinalSubmit = () => {
    return candidateSignature === null && !candidateSignature.url;
  };

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

  useEffect(() => {}, [hrSignatureProp, hrManagerSignatureProp]);

  useEffect(() => {
    setCandidateSignature(candidateSignatureProp);
  }, [candidateSignatureProp]);

  useEffect(() => {
    const { url = '', id = '' } = candidateSignature;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        tempData: {
          ...tempData,
          candidateSignature: {
            ...tempData.candidateSignature,
            id,
            url,
          },
        },
      },
    });
  }, [candidateSignature]);

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.left}>
        <FileContent url="http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff" />
      </div>

      <div className={styles.right}>
        {/* HR signature */}
        <div className={styles.signature}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <EditOutlined />
                </div>
              </div>
            </div>
            <h2>{formatMessage({ id: 'component.previewOffer.hrSignature' })}</h2>
          </header>

          {/* <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p> */}
          {hrSignature.user ? (
            <p>
              Undersigned - {hrSignature.user.employee.generalInfo.firstName}{' '}
              {hrSignature.user.employee.generalInfo.lastName}
            </p>
          ) : (
            <p>Undersigned - </p>
          )}

          <div className={styles.upload}>
            {!hrSignature.url ? (
              // Default image
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            ) : (
              <img className={styles.signatureImg} src={hrSignature.url} alt="" />
            )}

            {/* <button
              type="submit"
              onClick={() => {
                setUploadVisible1(true);
              }}
            >
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button>

            <CancelIcon resetImg={() => resetImg('hr')} /> */}
          </div>

          {/* <div className={styles.submitContainer}>
            <Button
              type="primary"
              onClick={handleHrSignatureSubmit}
              className={`${hrSignature.url ? styles.active : styles.disable}`}
            >
              {formatMessage({ id: 'component.previewOffer.submit' })}
            </Button>

            <span className={styles.submitMessage}>
              {hrSignature.url ? formatMessage({ id: 'component.previewOffer.submitted' }) : ''}
            </span>
          </div> */}
        </div>

        {/* HR Manager signature */}
        {hrManagerSignature.url && ( // If there is a signature of HR Manager
          <div className={styles.signature}>
            <header>
              <div className={styles.icon}>
                <div className={styles.bigGlow}>
                  <div className={styles.smallGlow}>
                    <EditOutlined />
                  </div>
                </div>
              </div>
              <h2>{formatMessage({ id: 'component.previewOffer.managerSignature' })}</h2>
            </header>

            {/* <p>{formatMessage({ id: 'component.previewOffer.managerUndersigned' })}</p> */}
            {hrManagerSignature.user ? (
              <p>
                Undersigned - {hrManagerSignature.user.employee.generalInfo.firstName}{' '}
                {hrManagerSignature.user.employee.generalInfo.lastName}
              </p>
            ) : (
              <p>Undersigned -</p>
            )}

            <div className={styles.upload}>
              {!hrManagerSignature.url ? (
                // Default image
                <img className={styles.signatureImg} src={whiteImg} alt="" />
              ) : (
                <img className={styles.signatureImg} src={hrManagerSignature.url} alt="" />
              )}
            </div>

            {/* <div className={styles.submitContainer}>
              <Button
                type="primary"
                disabled={!hrManagerSignature.url}
                onClick={handleHrManagerSignatureSubmit}
                className={`${hrManagerSignature.url ? styles.active : styles.disable}`}
              >
                {formatMessage({ id: 'component.previewOffer.submit' })}
              </Button>

              <span className={styles.submitMessage}>
                {hrManagerSignature.url
                  ? formatMessage({ id: 'component.previewOffer.submitted' })
                  : ''}
              </span>
            </div> */}
          </div>
        )}

        {/* Candidate Signature */}
        <div className={styles.signature}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <EditOutlined />
                </div>
              </div>
            </div>
            <h2>{formatMessage({ id: 'component.previewOffer.candidateSignature' })}</h2>
          </header>

          {/* <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p> */}
          <p>Undersigned - {candidateName}</p>

          <div className={styles.upload}>
            {candidateSignature !== null && candidateSignature.url ? (
              // Default image
              <img className={styles.signatureImg} src={candidateSignature.url} alt="" />
            ) : (
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            )}

            <button
              type="submit"
              onClick={() => {
                setUploadVisible1(true);
              }}
            >
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button>

            <CancelIcon resetImg={() => resetImg()} />
          </div>

          {/* <div className={styles.submitContainer} /> */}
          <Button
            type="primary"
            disabled={!candidateSignature.url && !hrManagerSignature.url}
            className={
              candidateSignature.url && hrManagerSignature.url
                ? `${styles.proceed}`
                : `${styles.proceed} ${styles.disabled}`
            }
            onClick={() => handleFinalSubmit()}
          >
            Submit & Proceed
          </Button>
        </div>

        {/* Send final offer */}
        {/* <div style={{ marginBottom: '16px' }}>
            <SendEmail
              title="Send final offer to the candidate"
              formatMessage={formatMessage}
              handleSendEmail={handleSendFinalOffer}
              isSentEmail={false}
              privateEmail={candidateEmailProp}
            />
          </div> */}

        <ModalUpload
          visible={uploadVisible1}
          getResponse={(response) => {
            console.log(response);
            loadImage(response);
          }}
          handleCancel={() => {
            setUploadVisible1(false);
          }}
        />

        <CustomModal
          open={openModal}
          closeModal={closeModal}
          content={
            <ModalContent
              closeModal={closeModal}
              tempData={tempData}
              candidateEmail={mail}
              // privateEmail={privateEmail}
            />
          }
        />
      </div>
    </div>
  );
};

// export default PreviewOffer;
export default connect(
  ({
    info: { previewOffer = {} } = {},
    loading,
    user: { currentUser = {} } = {},
    // candidateInfo: { rookieId = '', tempData = {}, data = {} } = {},
    candidateProfile: { tempData = {}, data = {}, candidate = '' } = {},
  }) => ({
    previewOffer,
    loading: loading.effects['upload/uploadFile'],
    currentUser,
    tempData,
    data,
    candidate,
    // rookieId,
  }),
)(PreviewOffer);
