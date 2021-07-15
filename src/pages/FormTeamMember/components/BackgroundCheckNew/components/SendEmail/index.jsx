import React, { useEffect, useState } from 'react';
import { Typography, Space, Radio, Button, message } from 'antd';
import CustomModal from '@/components/CustomModal';
import ModalEmail from './components/ModalEmail';
import send from './Assets/group-11.svg';
import sent from './Assets/sent.svg';
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
  checkValidation,
  loading4,
  openModalEmail,
  closeModalEmail = () => {},
  processStatus = '',
}) => {
  const [isEnable, setIsEnable] = useState('');
  const [isInputEnable, setIsInputEnable] = useState(true);
  const [check, setCheck] = useState(false);
  const [initialGenerateLink] = useState('abc.xyz.com');
  const handleEmailClick = () => {
    setIsEnable(true);
  };

  const handleLinkClick = () => {
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  const handleGenerate = () => {
    message.success('Generated link sucessfully');
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
        closeModal={closeModalEmail}
        docmail={1}
        content={
          <ModalEmail
            isSentEmail={isSentEmail}
            checkValidation={checkValidation}
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
            initialGenerateLink={initialGenerateLink}
            handleGenerate={handleGenerate}
            handleMarkAsDone={handleMarkAsDone}
          />
        }
      />
    </>
  );
};

export default index;
