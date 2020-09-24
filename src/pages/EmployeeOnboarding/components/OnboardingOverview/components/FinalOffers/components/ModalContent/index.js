import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import img1 from './images/modal_img_1.png';
import img2 from './images/modal_img_2.png';

import styles from './index.less';
// import './index.less';

const CONTENT_LIST = [
  {
    step: 1,
    header: 'Profile creation for Aditya Venkatesh is complete.',
    body:
      'All data collected while onboarding has been migrated to this profile in employee’s directory',
    // 'asd',
    image: img1,
    button: 'Next',
    buttonType: 'next',
  },
  {
    step: 2,
    header: 'Share the username for the Aditya’s employee profile ',
    body:
      'The company email id created while onboarding will be shared with the candidate. It will be used for login into the employee profile.',
    image: img2,
    button: 'Share via candidate’s private e-mail',
    buttonType: 'share',
  },
  {
    step: 3,
    header: 'The login details has been shared.',
    body: 'The employee profile is all set.',
    image: img1,
    button: 'Go to employee directory',
    buttonType: 'directory',
  },
];

const ModalContent = (props) => {
  const { closeModal } = props;

  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState({
    step: 1,
    header: '',
    body: '',
    image: img1,
    button: '',
    buttonType: '',
  });

  const { step, header, body, image, button, buttonType } = content;

  useEffect(() => {
    setContent(CONTENT_LIST[0]);
  }, []);

  useEffect(() => {
    setContent(CONTENT_LIST[currentStep - 1]);
  }, [currentStep]);

  const next = () => {
    if (currentStep === 3) {
      closeModal();
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleShare = () => {
    next();
  };

  const handleRedirect = () => {
    next();
  };

  const handleClick = (type) => {
    switch (type) {
      case 'next':
        next();
        return;
      case 'share':
        handleShare();
        return;
      case 'directory':
        handleRedirect();
        return;
      default:
        next();
    }
  };

  return (
    <div className={styles.modalContent}>
      <span className={styles.step}>
        <span className={styles.activeStep}>{step}</span>/3
      </span>

      <div className={styles.imgContainer}>
        <img src={image} alt="step" />
      </div>

      <div className={styles.contentContainer}>
        <h2 className={styles.header}>{header}</h2>

        <p className={styles.content}>{body}</p>

        <div className={styles.btnContainer}>
          <Button className={styles.btn} onClick={() => handleClick(buttonType)}>
            {button}
          </Button>

          {currentStep === 3 && (
            <Button className={styles.laterBtn} type="link" block onClick={() => handleClick('')}>
              Maybe later
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
