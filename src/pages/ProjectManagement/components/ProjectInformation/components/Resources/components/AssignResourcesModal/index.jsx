import { Button, Modal, Row, Col } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import BackIcon from '@/assets/projectManagement/back.svg';
import styles from './index.less';

const AssignResourcesModal = (props) => {
  const {
    visible = false,
    title = 'Assign resources',
    onClose = () => {},
    content = '',
    width = 700,
  } = props;

  const [step, setStep] = useState(1);

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <img src={BackIcon} alt="" />
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const renderModalContent = () => {
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
        Hello
      </div>
    );
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
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
            >
              OK
            </Button>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(({ loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
}))(AssignResourcesModal);
