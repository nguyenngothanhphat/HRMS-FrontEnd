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

const AddResourcesModal = (props) => {
  const {
    visible = false,
    onClose = () => {},
    width = 850,
    refreshResourceList = () => {},
  } = props;
  const {
    dispatch,
    projectDetails: { projectDetail = {}, resourceList = [], resourceListTotal = 0 } = {},
    loadingFetchResourceList = false,
    employee = '',
    permissions = {},
  } = props;

  const {
    id: projectNumberId = '',
    projectName = '',
    engagementType = '',
    startDate = '',
    tentativeEndDate = '',
    newEndDate = '',
  } = projectDetail;
  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;
  const employeeId = employee ? employee._id : '';

  const endDate = newEndDate || tentativeEndDate;

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedResources, setSelectedResources] = useState([]);

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
        notInProject: projectNumberId,
        page,
        limit,
        name,
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
        // status: 'Billable',
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
        <p className={styles.header__text}>{step === 1 ? 'Add resources' : 'Review resources'}</p>
      </div>
    );
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedResources([]);
    onClose();
  };

  const renderStep1 = () => {
    const items = [
      {
        label: 'Project Name',
        value: projectName,
      },
      {
        label: 'Engagement Type',
        value: engagementType,
      },
      {
        label: 'Start Date',
        value: startDate ? moment(startDate).locale('en').format('MM/DD/YYYY') : '',
      },
      {
        label: 'End Date',
        value: endDate ? moment(endDate).locale('en').format('MM/DD/YYYY') : '',
      },
    ];
    return (
      <div className={styles.container}>
        <Row gutter={[0, 24]} className={styles.abovePart}>
          {items.map((x, index) => (
            <Col xs={24} md={8} lg={6}>
              <div className={styles.item} key={`${index + 1}`}>
                <span className={styles.label}>{x.label}:</span>
                <span className={styles.value}>{x.value}</span>
              </div>
            </Col>
          ))}
        </Row>

        <Row gutter={[0, 24]} className={styles.belowPart}>
          <ResourceTableCard
            fetchData={fetchResourceList}
            data={resourceList}
            loading={loadingFetchResourceList}
            total={resourceListTotal}
            selectedResources={selectedResources}
            setSelectedResources={setSelectedResources}
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
            billingStatus="Billable"
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

  const handleCloseModal = () => {
    setSuccessModalVisible(false);
    refreshResourceList();
  };

  return (
    <>
      <Modal
        className={`${styles.AddResourcesModal} ${styles.noPadding}`}
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
        onClose={handleCloseModal}
        onFinish={handleCloseModal}
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
            <span style={{ fontWeight: 'bold' }}>Resources added!</span>
            <br />
            <span style={{ textAlign: 'center' }}>
              The resources have been successfully added to the project
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
    user: { currentUser: { employee = {} } = {}, permissions = {} },
  }) => ({
    employee,
    permissions,
    projectDetails,
    loadingFetchResourceList: loading.effects['projectDetails/fetchResourceListEffect'],
  }),
)(AddResourcesModal);
