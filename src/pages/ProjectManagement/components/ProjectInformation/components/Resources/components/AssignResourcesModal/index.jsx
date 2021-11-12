import { Button, Modal, Row, Col } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import BackIcon from '@/assets/projectManagement/back.svg';
import ResourceTableCard from './components/ResourceTableCard';
import ReviewResourceTable from './components/ReviewResourceTable';
import ActionModal from '@/pages/ProjectManagement/components/ProjectInformation/components/ActionModal';
import ModalImage from '@/assets/projectManagement/modalImage1.png';

import styles from './index.less';

const AssignResourcesModal = (props) => {
  const { visible = false, onClose = () => {}, width = 850 } = props;
  const [sucessModalVisible, setSuccessModalVisible] = useState(false);

  const [step, setStep] = useState(1);

  const onBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <img src={BackIcon} alt="" onClick={onBack} />
        <p className={styles.header__text}>
          {step === 1 ? 'Assign resources' : 'Review resources'}
        </p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const renderStep1 = () => {
    return (
      <div className={styles.container}>
        <Row gutter={[0, 24]} className={styles.abovePart}>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Project Name:</span>
              <span className={styles.value}>ABC Website</span>
            </div>
          </Col>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Engagement Type:</span>
              <span className={styles.value}>T&M</span>
            </div>
          </Col>
          <Col xs={24} md={10}>
            <div className={styles.item}>
              <span className={styles.label}>Description:</span>
              <span className={styles.value}>
                1 Senior UX designer, UI Designer must know animation, UX Designer with 2+ years
                exp.
              </span>
            </div>
          </Col>
        </Row>

        <Row gutter={[0, 24]} className={styles.belowPart}>
          <ResourceTableCard />
        </Row>
      </div>
    );
  };
  const renderStep2 = () => {
    return (
      <div className={styles.container}>
        <Row gutter={[0, 24]} className={styles.abovePart}>
          <ReviewResourceTable />
        </Row>
      </div>
    );
  };
  const renderModalContent = () => {
    if (step === 2) {
      return renderStep2();
    }
    return renderStep1();
  };

  // buttons
  const renderPrimaryButtonText = () => {
    if (step === 1) {
      return 'Next';
    }
    return 'Assign';
  };

  const renderSecondaryButtonText = () => {
    if (step === 1) {
      return 'Maybe Later';
    }
    return 'Back';
  };

  const onPrimaryButtonClick = () => {
    if (step === 1) {
      setStep(2);
    }
    if (step === 2) {
      onClose();
      setSuccessModalVisible(true);
    }
  };

  const onSecondaryButtonClick = () => {
    if (step === 1) {
      handleCancel();
    }
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <>
      <Modal
        className={`${styles.AssignResourcesModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={width}
        footer={
          <>
            <div className={styles.rightContent}>
              {step === 1 && (
                <>
                  <span className={styles.descText}>Need more resources? </span>
                  <span className={styles.raiseRequest}>Raise Request</span>
                </>
              )}
            </div>
            <div className={styles.mainButtons}>
              <Button className={styles.btnCancel} onClick={onSecondaryButtonClick}>
                {renderSecondaryButtonText()}
              </Button>
              <Button className={styles.btnSubmit} type="primary" onClick={onPrimaryButtonClick}>
                {renderPrimaryButtonText()}
              </Button>
            </div>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
      <ActionModal
        visible={sucessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        buttonText="Close"
        width={400}
      >
        <img src={ModalImage} alt="" />
        <span style={{ fontWeight: 'bold' }}>Resources assigned!</span>
        <br />
        <span style={{ textAlign: 'center' }}>
          The resources have been successfully assigned to the project
        </span>
      </ActionModal>
    </>
  );
};

export default connect(({ loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
}))(AssignResourcesModal);
