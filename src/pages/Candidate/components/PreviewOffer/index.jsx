import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Col, Form, Row, Select, Popover, Radio, Space, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
// import logo from './components/images/brand-logo.png';
import CustomModal from '@/components/CustomModal';
// import SendEmail from '@/pages/FormTeamMember/components/BackgroundCheck/components/SendEmail';
import { getCurrentTenant } from '@/utils/authority';
import { isEmpty } from 'lodash';
import { PROCESS_STATUS } from '@/utils/onboarding';
import moment from 'moment';
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
// import SendEmail from '../BackgroundCheck/components/SendEmail';
import ModalContent from './components/ModalContent';

import styles from './index.less';
import TextSignature from '../../../../components/TextSignature';
import ModalDrawSignature from '../../../../components/ModalDrawSignature';

const { Option } = Select;
const compare = (dateTimeA, dateTimeB) => {
  const momentA = moment(dateTimeA, 'DD/MM/YYYY');
  const momentB = moment(dateTimeB, 'DD/MM/YYYY');
  if (momentA > momentB) return 1;
  if (momentA < momentB) return -1;
  return 0;
};

const PreviewOffer = (props) => {
  const { dispatch, tempData = {}, data = {}, candidate, loading1 } = props;

  const {
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    candidateSignature: candidateSignatureProp = {},
    privateEmail: candidateEmailProp = '',
    firstName: candidateFirstName = '',
    middleName: candidateMiddleName = '',
    lastName: candidateLastName = '',
    offerLetter: offerLetterProp = {},
    staticOfferLetter: staticOfferLetterProp = {},
    expiryDate: expiryDateProp = '',
    assignTo: assignToProp = {},
    assigneeManager: assigneeManagerProp = {},
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
  // eslint-disable-next-line no-unused-vars
  const [offerLetter, setOfferLetter] = useState(
    offerLetterProp && !isEmpty(offerLetterProp)
      ? offerLetterProp.attachment?.url || offerLetterProp.url || ''
      : staticOfferLetterProp.attachment?.url || staticOfferLetterProp.url || '',
  );

  // const [uploadVisible1, setUploadVisible1] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [uploadVisible2, setUploadVisible2] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [mail, setMail] = useState(candidateEmailProp || '');
  // eslint-disable-next-line no-unused-vars
  const [mailForm] = Form.useForm();

  // const [role, setRole] = useState('');

  const [openModalCus, setOpenModalCus] = useState(false);

  const [nameSignature, setNameSignature] = useState('');
  const [optionSignature, setOptionSignature] = useState('upload');
  const [openModal, setOpenModal] = useState('');
  const [valueDigitalSignature, setValueDigitalSignature] = useState(0);
  const [arrImgBase64, setArrImgBase64] = useState([]);
  const [openDigital, setOpenDigital] = useState(false);
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
    setOpenModalCus(false);
  };

  const isExpired = compare(moment(), moment(expiryDateProp)) === 1;
  const emails = () => {
    const assignToMail = assignToProp?.generalInfo?.workEmail || '';
    const assigneeManagerMail = assigneeManagerProp?.generalInfo?.workEmail || '';

    return [...new Set([assignToMail, assigneeManagerMail])];
  };

  // signature candidate
  const dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    // eslint-disable-next-line compat/compat
    return new Blob([new Uint8Array(array)], { type: 'image/png' });
  };
  const resetDefaultState = () => {
    setValueDigitalSignature(0);
    setNameSignature('');
    setArrImgBase64([]);
    setOptionSignature('upload');
    setOpenDigital(false);
  };

  const saveDrawSignature = async (imageBase64) => {
    const formData = new FormData();
    if (!imageBase64) {
      setOpenModal('');
      return;
    }
    const file = dataURItoBlob(imageBase64);
    formData.append('blob', file, 'signatureCandidate.png');
    const responsive = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    loadImage(responsive);
    setOpenModal('');
  };

  const getImg = (e) => {
    const arr = arrImgBase64;
    arr.push(e);
    setArrImgBase64(arr);
  };
  const changeName = (e) => {
    setOpenDigital(true);
    setArrImgBase64([]);
    setNameSignature(e.target.value);
  };

  const handleFinalSubmit = async () => {
    if (!dispatch) {
      return;
    }
    if (optionSignature === 'digital') {
      if (arrImgBase64.length > 0) {
        const formData = new FormData();
        if (!arrImgBase64[valueDigitalSignature]) {
          setOpenModal('');
          return;
        }
        const file = dataURItoBlob(arrImgBase64[valueDigitalSignature]);
        formData.append('blob', file, 'signatureCandidate.jpeg');
        const responsive = await dispatch({
          type: 'upload/uploadFile',
          payload: formData,
        });
        const { data: imageData = [] } = responsive;
        const { id = '' } = imageData[0];

        dispatch({
          type: 'candidateProfile/updateByCandidateEffect',
          payload: {
            candidateSignature: id,
            candidate,
            tenantId: getCurrentTenant(),
          },
        });
        dispatch({
          type: 'candidateProfile/submitCandidateFinalOffer',
          payload: {
            candidate,
            candidateFinalSignature: id,
            options: 1,
            tenantId: getCurrentTenant(),
          },
        }).then(({ statusCode }) => {
          if (statusCode === 200) {
            setOpenModalCus(true);
          }
        });
        resetDefaultState();
      }
    } else {
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
          setOpenModalCus(true);
        }
      });
    }
    // submitCandidateFinalOffer
  };
  const renderSignature = () => {
    if (optionSignature === 'digital' && !disableCandidateSubmit())
      return (
        <>
          <div>
            <p>Digital Signature</p>
          </div>
          <Row>
            <Col span={24}>
              <Popover
                content={
                  <Radio.Group
                    onChange={(e) => {
                      setValueDigitalSignature(e.target.value);
                    }}
                    value={valueDigitalSignature}
                  >
                    <Space direction="vertical">
                      {['Airin', 'GermanyScript', 'SH Imogen Agnes', 'AudreyAndReynold'].map(
                        (item, index) => (
                          <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextSignature
                              name={nameSignature}
                              getImage={getImg}
                              x={10}
                              y={75}
                              height={100}
                              font={item === 'Airin' ? `48px ${item}` : `60px ${item}`}
                            />
                          </Radio>
                          // </Col>
                        ),
                      )}
                    </Space>
                  </Radio.Group>
                }
                placement="left"
                trigger="hover"
                visible={nameSignature && openDigital}
              >
                <Input placeholder="Enter your name" onChange={changeName} value={nameSignature} />
              </Popover>
            </Col>
          </Row>
        </>
      );
    return (
      <div className={styles.upload}>
        {candidateSignature !== null && candidateSignature.url ? (
          // Default image
          <img className={styles.signatureImg} src={candidateSignature.url} alt="" />
        ) : (
          <img className={styles.signatureImg} src={whiteImg} alt="" />
        )}

        {!disableCandidateSubmit() && (
          <>
            <button type="submit" onClick={() => setOpenModal(optionSignature)}>
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button>

            <CancelIcon resetImg={() => resetImg()} />
          </>
        )}
      </div>
    );
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
            Undersigned - {candidateFirstName} {candidateLastName} {candidateMiddleName}
          </p>

          {!disableCandidateSubmit() && (
            <>
              <p>Choose your options for Signature</p>
              <Row>
                <Col span={24}>
                  <Select
                    value={optionSignature}
                    style={{ width: '100%', marginBottom: '5px' }}
                    onChange={(e) => {
                      setOptionSignature(e);
                    }}
                  >
                    <Option value="upload">Upload</Option>
                    <Option value="draw">Draw</Option>
                    <Option value="digital">Digital Signature</Option>
                  </Select>
                </Col>
              </Row>
            </>
          )}

          {renderSignature()}

          {isExpired && (
            <div className={styles.expiredMessage}>
              <span className={styles.subtitle}>This offer is expired. Please contact HR.</span>
              <div className={styles.emails}>
                {emails().map((em) => (
                  <>
                    <a href={`mailto:${em}`}>{em}</a>
                  </>
                ))}
              </div>
            </div>
          )}

          {/* <div className={styles.submitContainer} /> */}
          <Button
            type="primary"
            disabled={
              !(
                (!isExpired &&
                  candidateSignature.url &&
                  hrManagerSignature.url &&
                  !disableCandidateSubmit()) ||
                optionSignature === 'digital'
              )
            }
            className={
              (candidateSignature.url && hrManagerSignature.url && !disableCandidateSubmit()) ||
              optionSignature === 'digital'
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
          visible={openModal === 'upload'}
          getResponse={(response) => {
            loadImage(response);
            const { statusCode = 1 } = response;
            if (statusCode === 200) {
              setOpenModal('');
            }
          }}
          handleCancel={() => setOpenModal('')}
        />
        <ModalDrawSignature
          visible={openModal === 'draw'}
          title="Draw your signature"
          onOk={saveDrawSignature}
          onCancel={() => setOpenModal('')}
        />

        <CustomModal
          open={openModalCus}
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
