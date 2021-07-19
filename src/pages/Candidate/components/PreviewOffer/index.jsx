import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
// import logo from './components/images/brand-logo.png';
import CustomModal from '@/components/CustomModal';
// import SendEmail from '@/pages/FormTeamMember/components/BackgroundCheck/components/SendEmail';
import { getCurrentTenant } from '@/utils/authority';
import { isEmpty } from 'lodash';
import { PROCESS_STATUS } from '@/utils/onboarding';
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
// import SendEmail from '../BackgroundCheck/components/SendEmail';
import ModalContent from './components/ModalContent';

import styles from './index.less';

const PreviewOffer = (props) => {
  const { dispatch, tempData = {}, data = {}, candidate, loading1 } = props;

  const {
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    candidateSignature: candidateSignatureProp = {},
    privateEmail: candidateEmailProp = '',
    firstName: candidateFirstName = '',
    middleName: candidateMiddleName = '',
    lastName: candidateLastame = '',
    offerLetter: offerLetterProp = {},
    staticOfferLetter: staticOfferLetterProp = {},
  } = data;

  // const inputRefs = [];

  // eslint-disable-next-line no-unused-vars
  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');
  // eslint-disable-next-line no-unused-vars
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  // eslint-disable-next-line no-unused-vars
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');
  // const [offerLetter, setOfferLetter] = useState(
  //   offerLetterProp && offerLetterProp.attachment && offerLetterProp.attachment.url
  //     ? offerLetterProp.attachment.url
  //     : '',
  // );
  const [offerLetter, setOfferLetter] = useState(
    offerLetterProp && !isEmpty(offerLetterProp)
      ? offerLetterProp.attachment?.url || offerLetterProp.url || ''
      : staticOfferLetterProp.attachment?.url || staticOfferLetterProp.url || '',
  );

  const [uploadVisible1, setUploadVisible1] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [uploadVisible2, setUploadVisible2] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [mail, setMail] = useState(candidateEmailProp || '');
  // eslint-disable-next-line no-unused-vars
  const [mailForm] = Form.useForm();

  // const [role, setRole] = useState('');

  const [openModal, setOpenModal] = useState(false);

  // const resetForm = () => {
  //   mailForm.resetFields();
  // };

  const disableCandidateSubmit = () => {
    const { ACCEPTED_FINAL_OFFERS } = PROCESS_STATUS;
    const { processStatus = '' } = data;
    return processStatus === ACCEPTED_FINAL_OFFERS;
  };

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
        tenantId: getCurrentTenant(),
      },
    });
  };

  const handleFinalSubmit = () => {
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
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
      }
    });
    // submitCandidateFinalOffer
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }, []);

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
        <FileContent url={offerLetter} />
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
          </div>
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
          <p>
            Undersigned - {candidateFirstName} {candidateLastame} {candidateMiddleName}
          </p>

          <div className={styles.upload}>
            {candidateSignature !== null && candidateSignature.url ? (
              // Default image
              <img className={styles.signatureImg} src={candidateSignature.url} alt="" />
            ) : (
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            )}

            {!disableCandidateSubmit() && (
              <>
                <button
                  type="submit"
                  onClick={() => {
                    setUploadVisible1(true);
                  }}
                >
                  {formatMessage({ id: 'component.previewOffer.uploadNew' })}
                </button>

                <CancelIcon resetImg={() => resetImg()} />
              </>
            )}
          </div>

          {/* <div className={styles.submitContainer} /> */}
          <Button
            type="primary"
            disabled={
              !(candidateSignature.url && hrManagerSignature.url && !disableCandidateSubmit())
            }
            className={
              candidateSignature.url && hrManagerSignature.url && !disableCandidateSubmit()
                ? `${styles.proceed}`
                : `${styles.proceed} ${styles.disabled}`
            }
            loading={loading1}
            onClick={() => handleFinalSubmit()}
          >
            Submit & Proceed
          </Button>
        </div>

        {/* Send final offer */}
        <ModalUpload
          visible={uploadVisible1}
          getResponse={(response) => {
            loadImage(response);
            const { statusCode } = response;
            if (statusCode === 200) {
              setUploadVisible1(false);
            }
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
    loading1: loading.effects['candidateProfile/submitCandidateFinalOffer'],
  }),
)(PreviewOffer);
