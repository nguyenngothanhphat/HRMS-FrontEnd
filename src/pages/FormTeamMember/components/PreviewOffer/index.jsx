import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Input, Form } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import NumericInput from '@/components/NumericInput';
// import UploadImage from '@/components/UploadImage';
import { getUserProfile } from '@/services/usersManagement';
import logo from './components/images/brand-logo.png';
import whiteImg from './components/images/whiteImg.png';

import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
import SendEmail from '../BackgroundCheck/components/SendEmail';
// import SendEmail from '../EligibilityDocs/components/SendEmail';

import styles from './index.less';

const INPUT_WIDTH = [50, 100, 18, 120, 100, 50, 100, 18, 120, 100]; // Width for each input field

const ROLE = {
  HRMANAGER: 'HR-MANAGER',
  HR: 'HR',
};

const PreviewOffer = (props) => {
  const { dispatch, currentUser = {}, tempData = {}, data = {}, rookieId = '' } = props;

  const {
    email: mailProp,
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
  } = tempData;

  // const inputRefs = [];

  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');

  const [uploadVisible1, setUploadVisible1] = useState(false);
  const [uploadVisible2, setUploadVisible2] = useState(false);

  const [mail, setMail] = useState(mailProp || '');
  const [mailForm] = Form.useForm();

  const [role, setRole] = useState('');

  const resetForm = () => {
    mailForm.resetFields();
  };

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

  const handleSubmit = () => {
    // Check if mail address is valid
    const mailError = mailForm.getFieldError('email');
    if (mailError.length > 0 || mail.length === 0) {
      return;
    }

    // setFile(null);
    setHrSignature({});
    setHrManagerSignature({});
    setMail('');
    resetForm();
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

      // call API
      // dispatch({
      //   type: 'candidateInfo/sentForApprovalEffect',
      //   payload: { hrSignature: id, candidate: rookieId },
      // });
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

      // call API
      // dispatch({
      //   type: 'candidateInfo/approveFinalOfferEffect',
      //   payload: { hrManagerSignature: id, candidate: rookieId },
      // });
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
      payload: { hrManagerSignature: id, candidate },
    });
  };

  const getUserRole = () => {
    console.log(props);
    const { roles } = currentUser;
    const userRole = roles.find(
      (roleItem) => roleItem._id === ROLE.HRMANAGER || roleItem._id === ROLE.HR,
    );
    if (!userRole) {
      return;
    }
    console.log(userRole);
    const { _id } = userRole;
    setRole(_id);
  };

  const handleSendEmail = () => {
    console.log('Send email');
  };

  useEffect(() => {
    getUserRole();
  }, []);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

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

          <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p>

          <div className={styles.upload}>
            {!hrSignature.url ? (
              // Default image
              <img className={styles.signatureImg} src={whiteImg} alt="" />
            ) : (
              <img className={styles.signatureImg} src={hrSignature.url} alt="" />
            )}

            <button
              type="submit"
              onClick={() => {
                setUploadVisible1(true);
              }}
            >
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button>

            <CancelIcon resetImg={() => resetImg('hr')} />
          </div>

          <div className={styles.submitContainer}>
            <Button
              type="primary"
              onClick={handleSubmit}
              className={`${hrSignature.url ? styles.active : styles.disable}`}
            >
              {formatMessage({ id: 'component.previewOffer.submit' })}
            </Button>

            <span className={styles.submitMessage}>
              {hrSignature.url ? formatMessage({ id: 'component.previewOffer.submitted' }) : ''}
            </span>
          </div>
        </div>

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
                Send for approval
              </Button>
            </Form>
          </div>
        </div>

        {/* HR Manager signature */}
        {/* {role === ROLE.HRMANAGER && ( */}
        {/* {true && ( */}
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

              <p>{formatMessage({ id: 'component.previewOffer.managerUndersigned' })}</p>

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
                  disabled={hrManagerSignature.url !== null}
                  onClick={handleSubmit}
                  className={`${hrManagerSignature.url ? styles.active : styles.disable}`}
                >
                  {formatMessage({ id: 'component.previewOffer.submit' })}
                </Button>

                <span className={styles.submitMessage}>
                  {hrManagerSignature.url
                    ? formatMessage({ id: 'component.previewOffer.submitted' })
                    : ''}
                </span>
              </div>
            </div>

            <SendEmail
              title="Send final offer to the candidate"
              formatMessage={formatMessage}
              handleSendEmail={handleSendFinalOffer}
              // handleChangeEmail={this.handleChangeEmail}
              // handleSendFormAgain={this.handleSendFormAgain}
              isSentEmail={false}
            />
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

        {/* Render Send Mail */}
        {/* {file && file2 && <SendEmail />} */}
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
