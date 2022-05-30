import { Button, Col, Modal, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import BackIcon from '@/assets/projectManagement/back.svg';
import ModalImage from '@/assets/projectManagement/modalImage1.png';
import CommonModal from '@/components/CommonModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import ResourceTableCard from './components/ResourceTableCard';
import ReviewResourceTable from './components/ReviewResourceTable';
import styles from './index.less';

const AssignResourcesModal = (props) => {
  const {
    visible = false,
    onClose = () => {},
    width = 850,
    data: {
      comments = '',
      resourceType: { department = '', _id: titleId = '', name: resourceTypeName = '' } = {},
      noOfResources = 0,
      billingStatus = '',
    } = {},
    refreshResourceType = () => {},
    permissions = {},
  } = props;

  const {
    dispatch,
    projectDetails: { projectDetail = {}, resourceList = [], resourceListTotal = 0 } = {},
    loadingFetchResourceList = false,
    loadingAssign = false,
    employee = '',
  } = props;

  const {
    id: projectNumberId = '',
    projectName = '',
    engagementType = '',
    startDate = '',
    tentativeEndDate = '',
    newEndDate = '',
  } = projectDetail;

  const employeeId = employee ? employee._id : '';

  const endDate = newEndDate || tentativeEndDate;

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedResources, setSelectedResources] = useState([]);
  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;

  // functions
  const onBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const removeResource = (id) => {
    const temp = JSON.parse(JSON.stringify(selectedResources));
    const result = temp.filter((x) => x._id !== id);
    setSelectedResources(result);
  };

  const fetchResourceList = (name = '', page = 1, limit = 5, filter) => {
    dispatch({
      type: 'projectDetails/fetchResourceListEffect',
      payload: {
        page,
        limit,
        name,
        // department: [department],
        title: [titleId],
        ...filter,
        employeeId,
        adminMode,
        countryMode,
      },
    });
  };

  const assignResources = () => {
    const payload = selectedResources.map((x) => {
      return {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        project: projectNumberId,
        status: billingStatus,
        // utilization: '',
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
        employee: x._id,
      };
    });
    return dispatch({
      type: 'projectDetails/assignResourcesEffect',
      payload,
    });
  };

  // render ui
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
    setStep(1);
    setSelectedResources([]);
    onClose();
  };

  const renderStep1 = () => {
    return (
      <div className={styles.container}>
        <Row gutter={[0, 24]} className={styles.abovePart}>
          <Col xs={24} md={7}>
            <Row gutter={[24, 10]}>
              <Col span={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Project Name:</span>
                  <span className={styles.value}>{projectName}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Engagement Type:</span>
                  <span className={styles.value}>{engagementType}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={7}>
            <Row gutter={[24, 10]}>
              <Col span={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Start Date:</span>
                  <span className={styles.value}>
                    {startDate ? moment(startDate).locale('en').format('MM/DD/YYYY') : ''}
                  </span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.item}>
                  <span className={styles.label}>End Date:</span>
                  <span className={styles.value}>
                    {endDate ? moment(endDate).locale('en').format('MM/DD/YYYY') : ''}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={10}>
            <div className={styles.item2}>
              <span className={styles.label}>Notes/Comments:</span>
              <span className={styles.value}>{comments}</span>
            </div>
          </Col>
        </Row>

        <Row gutter={[0, 24]} className={styles.belowPart}>
          <ResourceTableCard
            fetchData={fetchResourceList}
            data={resourceList}
            loading={loadingFetchResourceList}
            total={resourceListTotal}
            selectedResources={selectedResources}
            setSelectedResources={setSelectedResources}
            resourceTypeName={resourceTypeName}
            noOfResources={noOfResources}
          />
        </Row>
      </div>
    );
  };
  const renderStep2 = () => {
    return (
      <div className={styles.container}>
        <Row gutter={[0, 24]} className={styles.abovePart}>
          <ReviewResourceTable
            fetchData={fetchResourceList}
            data={resourceList}
            selectedResources={selectedResources}
            removeResource={removeResource}
            billingStatus={billingStatus}
            startDate={startDate}
            endDate={endDate}
          />
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

  const onPrimaryButtonClick = async () => {
    if (step === 1) {
      setStep(2);
    }
    if (step === 2) {
      const res = await assignResources();
      if (res.statusCode === 200) {
        onClose();
        setSuccessModalVisible(true);
      }
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
              <Button
                className={styles.btnSubmit}
                type="primary"
                onClick={onPrimaryButtonClick}
                disabled={selectedResources.length === 0}
                loading={loadingAssign}
              >
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
      <CommonModal
        firstText="Yes"
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          refreshResourceType();
        }}
        buttonText="Close"
        width={400}
        hasCancelButton={false}
        hasHeader={false}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={ModalImage} alt="" />
            <span style={{ fontWeight: 'bold' }}>Resources assigned!</span>
            <br />
            <span style={{ textAlign: 'center' }}>
              The resources have been successfully assigned to the project
            </span>
          </div>
        }
      />
    </>
  );
};

export default connect(
  ({
    projectDetails,
    loading,
    user: { currentUser: { employee = {} } = {} },
    permissions = {},
  }) => ({
    employee,
    permissions,
    projectDetails,
    loadingFetchResourceList: loading.effects['projectDetails/fetchResourceListEffect'],
    loadingAssign: loading.effects['projectDetails/assignResourcesEffect'],
  }),
)(AssignResourcesModal);
