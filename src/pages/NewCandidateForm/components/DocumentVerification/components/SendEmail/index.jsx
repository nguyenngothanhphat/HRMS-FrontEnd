import CustomModal from '@/components/CustomModal';
import { Button, message, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import sent from './Assets/sent.svg';
import ModalEmail from './components/ModalEmail';
import style from './index.less';

const index = ({
  handleSendEmail = () => {},
  privateEmail = '',
  isSentEmail,
  generateLink = '',
  handleMarkAsDone = () => {},
  handleSendFormAgain = () => {},
  firstName = '',
  middleName = '',
  lastName = '',
  handleValueChange = () => {},
  // valueToFinalOffer,
  // changeValueToFinalOffer = () => {},
  filledDocumentVerification,
  loading4,
  openModalEmail,
  closeModalEmail = () => {},
  processStatus = '',
}) => {
  const [isEnable, setIsEnable] = useState('');
  const [isInputEnable, setIsInputEnable] = useState(true);
  const [check, setCheck] = useState(false);
  const handleEmailClick = () => {
    setIsEnable(true);
  };

  const handleLinkClick = async () => {
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  const handleGenerate = () => {
    // eslint-disable-next-line compat/compat
    navigator.clipboard.writeText(generateLink);
    message.success('Copied to clipboard');
  };

  useEffect(() => {
    if (isSentEmail || processStatus === 'SENT-PROVISIONAL-OFFER') setCheck(true);
    else setCheck(false);
  }, [isSentEmail, processStatus]);

  return (
    <>
      {check && (
        <div className={style.SendEmail}>
          <div className={style.header}>
            <Space direction="horizontal">
              <div className={style.icon}>
                <div className={style.inside}>
                  <img src={sent} alt="send-icon" className={style.send} />
                </div>
              </div>

              <Typography.Text className={style.text}>Sent</Typography.Text>
            </Space>
          </div>

          <div className={style.anotherBody}>
            <Typography.Text className={style.text}>
              We are waiting for{' '}
              <span className={style.specificText}>
                Mr / Mrs. {`${firstName} ${middleName ? `${middleName} ` : ''}${lastName}`}
              </span>{' '}
              to upload all requested documents for eligibility check.
            </Typography.Text>
            <br />
            <Button type="link" onClick={handleSendFormAgain} className={style.buttonSend}>
              <Typography.Text className={style.buttonText}>Send form again</Typography.Text>
            </Button>
          </div>
        </div>
      )}

      <CustomModal
        open={openModalEmail}
        closeModal={() => {
          closeModalEmail();
          setIsEnable('');
        }}
        docmail={1}
        content={
          <ModalEmail
            isSentEmail={isSentEmail}
            filledDocumentVerification={filledDocumentVerification}
            handleEmailClick={handleEmailClick}
            isEnable={isEnable}
            handleSendEmail={handleSendEmail}
            privateEmail={privateEmail}
            handleValueChange={handleValueChange}
            isInputEnable={isInputEnable}
            handleClick={handleClick}
            loading4={loading4}
            handleLinkClick={handleLinkClick}
            generateLink={generateLink}
            handleGenerate={handleGenerate}
            handleMarkAsDone={handleMarkAsDone}
          />
        }
      />
    </>
  );
};

export default index;
