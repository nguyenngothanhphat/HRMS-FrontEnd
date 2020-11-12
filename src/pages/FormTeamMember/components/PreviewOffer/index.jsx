import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Input, Form } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
// import logo from './components/images/brand-logo.png';
import CustomModal from '@/components/CustomModal';
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
import SendEmail from './components/SendEmail';
import ModalContent from './components/ModalContent';
import styles from './index.less';

// const INPUT_WIDTH = [50, 100, 18, 120, 100, 50, 100, 18, 120, 100]; // Width for each input field

const ROLE = {
  HRMANAGER: 'HR-MANAGER',
  HR: 'HR',
  HRGLOBAL: 'HR-GLOBAL',
};

const PreviewOffer = (props) => {
  const { dispatch, currentUser = {}, tempData = {}, data = {} } = props;

  const {
    // email: mailProp,
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    // offerLetter:  offerLetterProp,
  } = tempData;
  const {
    candidateSignature: candidateSignatureProp = {},
    // offerLetter: { attachment: { url: offerLetterProp = '' } = {} } = {},
    offerLetter: offerLetterProp,
    privateEmail: candidateEmailProp = '',
    fullName: candidateName = '',
    processStatus,
  } = data;

  // const inputRefs = [];

  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');

  const [hrSignatureSubmit, setHrSignatureSubmit] = useState(false);
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  const [hrManagerSignatureSubmit, setHrManagerSignatureSubmit] = useState(
    hrManagerSignatureProp || '',
  );
  // eslint-disable-next-line no-unused-vars
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');

  const [uploadVisible1, setUploadVisible1] = useState(false);
  const [uploadVisible2, setUploadVisible2] = useState(false);

  const [mail, setMail] = useState(candidateEmailProp || '');
  const [mailForm] = Form.useForm();

  const [role, setRole] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  const getOfferLetterProp = () => {
    if (offerLetterProp && offerLetterProp.attachment && offerLetterProp.attachment.url) {
      return offerLetterProp.attachment.url;
    }
    return '';
  };

  // eslint-disable-next-line no-unused-vars
  const [offerLetter, setOfferLetter] = useState(
    offerLetterProp && offerLetterProp.attachment && offerLetterProp.attachment.url
      ? offerLetterProp.attachment.url
      : '',
  );

  // useEffect(() => {
  //   console.log(offerLetterProp);
  //   console.log(offerLetter);
  // }, [offerLetter]);

  // const resetForm = () => {
  //   mailForm.resetFields();
  // };

  const resetImg = (type) => {
    if (type === 'hr') {
      // setFile('');
      setHrSignature({});
    }
    if (type === 'hrManager') {
      setHrManagerSignature({});
      // setFile2('');
    }
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

  const loadImage = (type, response) => {
    const { data: responseData = [] } = response;
    const { url, id } = responseData[0];

    if (type === 'hr') {
      setHrSignature({
        url,
        id,
      });

      // save to Store
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            hrSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'candidateInfo/save',
        payload: {
          data: {
            ...data,
            // hrSignature: id,
            hrSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
    }
    if (type === 'hrManager') {
      // setFile2(url);
      setHrManagerSignature({ url, id });
      // save to Store
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            hrManagerSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'candidateInfo/save',
        payload: {
          data: {
            ...data,
            hrManagerSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
    }
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
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal2(true);
      }
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

  const getUserRole = () => {
    const { roles } = currentUser;
    const userRole = roles.find(
      (roleItem) =>
        roleItem._id === ROLE.HRMANAGER ||
        roleItem._id === ROLE.HR ||
        roleItem._id === ROLE.HRGLOBAL,
    );
    if (!userRole) {
      return;
    }
    const { _id } = userRole;
    setRole(_id);
  };

  const handleHrSignatureSubmit = () => {
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate: _id,
        hrSignature: hrSignatureProp.id,
        currentStep: 7,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setHrSignatureSubmit(true);
      }
    });
  };

  const handleHrManagerSignatureSubmit = () => {
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }

    dispatch({
      type: 'candidateInfo/addManagerSignatureEffect',
      payload: {
        candidate: _id,
        hrManagerSignature: hrManagerSignatureProp.id,
        // currentStep: 6,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setHrManagerSignatureSubmit(true);
      }
    });
  };

  useEffect(() => {
    getUserRole();
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate: _id,
        currentStep: 7,
      },
    });
  }, []);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

  useEffect(() => {}, [hrSignatureProp, hrManagerSignatureProp]);

  useEffect(() => {
    setCandidateSignature(candidateSignatureProp);
  }, [candidateSignatureProp]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const closeModal2 = () => {
    setOpenModal2(false);
  };

  useEffect(() => {
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        offerLetter,
      },
    });
  }, [offerLetter]);

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
              Undersigned - {hrSignature.user.employee?.generalInfo.firstName}{' '}
              {hrSignature.user.employee?.generalInfo.lastName}
            </p>
          ) : (
            <p>Undersigned</p>
          )}

          <div className={styles.upload}>
            {!hrSignature.url ? (
              // Default image
              <>
                <img className={styles.signatureImg} src={whiteImg} alt="" />
                <button
                  type="submit"
                  onClick={() => {
                    setUploadVisible1(true);
                  }}
                >
                  {formatMessage({ id: 'component.previewOffer.upload' })}
                </button>
              </>
            ) : (
              <>
                <img className={styles.signatureImg} src={hrSignature.url} alt="" />
                <button
                  type="submit"
                  onClick={() => {
                    setUploadVisible1(true);
                  }}
                >
                  {formatMessage({ id: 'component.previewOffer.uploadNew' })}
                </button>
                <CancelIcon resetImg={() => resetImg('hr')} />
              </>
            )}
          </div>

          <div className={styles.submitContainer}>
            <Button
              type="primary"
              onClick={handleHrSignatureSubmit}
              className={`${hrSignature.url ? styles.active : styles.disable}`}
            >
              {formatMessage({ id: 'component.previewOffer.submit' })}
            </Button>

            <span className={styles.submitMessage}>
              {hrSignatureSubmit ? formatMessage({ id: 'component.previewOffer.submitted' }) : ''}
            </span>
          </div>
        </div>

        {role === ROLE.HR && processStatus !== 'PENDING-APPROVAL-FINAL-OFFER' && (
          <div className={styles.send}>
            <header>
              <div className={styles.icon}>
                <div className={styles.bigGlow}>
                  <div className={styles.smallGlow}>
                    <SendOutlined />
                  </div>
                </div>
              </div>
              <h2>{formatMessage({ id: 'component.previewOffer.send' })}</h2>
            </header>

            <p>
              {formatMessage({ id: 'component.previewOffer.note1' })}
              <span>{formatMessage({ id: 'component.previewOffer.note2' })}</span>
              {formatMessage({ id: 'component.previewOffer.note3' })}
            </p>

            <p>{formatMessage({ id: 'component.previewOffer.also' })}</p>

            <div className={styles.mail}>
              <span> {formatMessage({ id: 'component.previewOffer.hrMail' })}</span>

              <Form form={mailForm} name="myForm" value={mail}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: formatMessage({ id: 'component.previewOffer.invalidMailErr' }),
                    },
                    {
                      required: true,
                      message: formatMessage({ id: 'component.previewOffer.emptyMailErr' }),
                    },
                  ]}
                >
                  <Input
                    required={false}
                    value={mail}
                    placeholder="address@terraminds.com"
                    onChange={(e) => setMail(e.target.value)}
                  />
                </Form.Item>

                <Button type="primary" onClick={() => handleSentForApproval()}>
                  {formatMessage({ id: 'component.previewOffer.sendForApproval' })}
                </Button>
              </Form>
            </div>
          </div>
        )}
        {/* HR Manager signature */}
        {role === ROLE.HRMANAGER && (
          <>
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
                  Undersigned - {hrManagerSignature.user.employee?.generalInfo.firstName}{' '}
                  {hrManagerSignature.user.employee?.generalInfo.lastName}
                </p>
              ) : (
                <p>Undersigned</p>
              )}

              <div className={styles.upload}>
                {!hrManagerSignature.url ? (
                  // Default image
                  <img className={styles.signatureImg} src={whiteImg} alt="" />
                ) : (
                  <img className={styles.signatureImg} src={hrManagerSignature.url} alt="" />
                )}

                <button
                  type="submit"
                  onClick={() => {
                    setUploadVisible2(true);
                  }}
                >
                  {formatMessage({ id: 'component.previewOffer.uploadNew' })}
                </button>

                <CancelIcon resetImg={() => resetImg('hrManager')} />
              </div>

              <div className={styles.submitContainer}>
                <Button
                  type="primary"
                  disabled={!hrManagerSignature.url}
                  onClick={handleHrManagerSignatureSubmit}
                  className={`${hrManagerSignature.url ? styles.active : styles.disable}`}
                >
                  {formatMessage({ id: 'component.previewOffer.submit' })}
                </Button>

                <span className={styles.submitMessage}>
                  {hrManagerSignatureSubmit
                    ? formatMessage({ id: 'component.previewOffer.submitted' })
                    : ''}
                </span>
              </div>
            </div>

            {/* Candidate Signature */}
            {candidateSignature.url && (
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
                <p>Undersigned- {candidateName}</p>

                <div className={styles.upload}>
                  {candidateSignature !== null && candidateSignature.url ? (
                    // Default image
                    <img className={styles.signatureImg} src={candidateSignature.url} alt="" />
                  ) : (
                    <img className={styles.signatureImg} src={whiteImg} alt="" />
                  )}
                </div>

                <div className={styles.submitContainer} />
              </div>
            )}

            {/* Send final offer */}
            <div style={{ marginBottom: '16px' }}>
              <SendEmail
                title="Send final offer to the candidate"
                formatMessage={formatMessage}
                handleSendEmail={handleSendFinalOffer}
                isSentEmail={false}
                privateEmail={candidateEmailProp}
              />
            </div>
          </>
        )}

        <ModalUpload
          visible={uploadVisible1}
          getResponse={(response) => {
            loadImage('hr', response);
          }}
          handleCancel={() => {
            setUploadVisible1(false);
          }}
        />

        <ModalUpload
          visible={uploadVisible2}
          getResponse={(response) => {
            loadImage('hrManager', response);
          }}
          handleCancel={() => {
            setUploadVisible2(false);
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
              type="hrManager"
              // privateEmail={privateEmail}
            />
          }
        />

        <CustomModal
          open={openModal2}
          closeModal={closeModal2}
          content={
            <ModalContent
              closeModal={closeModal2}
              tempData={tempData}
              candidateEmail={mail}
              type="hr"
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
    candidateInfo: { rookieId = '', tempData = {}, data = {} } = {},
  }) => ({
    previewOffer,
    loading: loading.effects['upload/uploadFile'],
    currentUser,
    tempData,
    data,
    rookieId,
  }),
)(PreviewOffer);
