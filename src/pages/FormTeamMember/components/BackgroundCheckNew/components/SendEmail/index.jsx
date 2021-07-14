import React, { useState } from 'react';
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
  valueToFinalOffer,
  changeValueToFinalOffer = () => {},
  checkValidation,
  loading4,
  openModalEmail,
  closeModalEmail = () => {},
}) => {
  const [isEnable, setIsEnable] = useState('');
  const [isInputEnable, setIsInputEnable] = useState(true);
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

  return (
    <div className={style.SendEmail}>
      <div className={style.header}>
        <Space direction="horizontal">
          <div className={style.icon}>
            <div className={style.inside}>
              {isSentEmail ? (
                <img src={sent} alt="send-icon" className={style.send} />
              ) : (
                <img src={send} alt="sent-icon" className={style.send} />
              )}
            </div>
          </div>
          {isSentEmail ? (
            <Typography.Text className={style.text}>Sent</Typography.Text>
          ) : (
            <Typography.Text className={style.text}>Send Form</Typography.Text>
          )}
        </Space>
      </div>
      {isSentEmail ? (
        <div className={style.anotherBody}>
          <Typography.Text className={style.text}>
            We are waiting for{' '}
            <span className={style.specificText}>
              Mr / Mrs. {firstName + lastName + middleName}
            </span>{' '}
            to upload all requested documents for eligibility check.
          </Typography.Text>
          <br />
          <Button type="link" onClick={handleSendFormAgain} className={style.buttonSend}>
            <Typography.Text className={style.buttonText}>Send form again</Typography.Text>
          </Button>
        </div>
      ) : (
        <>
          <Radio.Group
            className={style.s}
            onChange={changeValueToFinalOffer}
            value={valueToFinalOffer}
          >
            <br />

            <Radio value={0}>
              <Typography.Text>Send Provisional Offer</Typography.Text>
            </Radio>
            <br />
            <br />
            <div className={style.line} />
            {/* {valueToFinalOffer === 0 ? (
              renderBody()
            ) : (
              <>
             
              </>
            )} */}
            {/* {valueToFinalOffer === 1 && <br />} */}

            <Radio value={1}>
              <Typography.Text>Process to release a final offer</Typography.Text>
            </Radio>
          </Radio.Group>
          {/* 
          <Radio.Group
            className={style.s}
            onChange={changeValueToFinalOffer}
            value={valueToFinalOffer}
          >
            
          </Radio.Group> */}
        </>
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
    </div>
  );
};

export default index;
