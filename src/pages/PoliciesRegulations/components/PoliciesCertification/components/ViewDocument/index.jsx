import { Button, Col, Row, Skeleton, Steps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import FileContent from './components/FileContent';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import NoteComponent from './components/NoteComponent';

const MainLayout = ({ children, title }) => {
  return (
    <PageContainer>
      <Row className={styles.MainLayout}>
        <Col span={24}>
          <div className={styles.header}>
            <div className={styles.header__left}>{title || 'Policies Certification'}</div>
          </div>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <div className={styles.containerPolicies}>{children}</div>
        </Col>
      </Row>
    </PageContainer>
  );
};
const ViewDocument = (props) => {
  const {
    dispatch,
    currentUser: {
      location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      employee = {},
    } = {},
    loadingGetList = false,
    listCategory = [],
    match: { params: { reId = '', categoryID = '' } = {} },
    loadingCertifyDocument = false,
  } = props;

  const [current, setCurrent] = useState(0);
  const [currentFile, setCurrentFile] = useState({});
  console.log('🚀 ~ ViewDocument ~ currentFile', currentFile);
  const [selectedCategory, setSelectedCategory] = useState({});
  console.log('🚀 ~ ViewDocument ~ selectedCategory', selectedCategory);

  useEffect(() => {
    dispatch({
      type: 'policiesRegulations/fetchListCategory',
      payload: {
        country: [countryID],
      },
    });
  }, []);

  useEffect(() => {
    if (listCategory.length > 0 && categoryID) {
      setSelectedCategory(listCategory.find((x) => x._id === categoryID));
    }
  }, [JSON.stringify(listCategory)]);

  useEffect(() => {
    if (selectedCategory?._id) {
      const find = selectedCategory?.policyregulations.find((x) => x._id === reId);
      const findIndex = selectedCategory?.policyregulations.findIndex((x) => x._id === reId);
      if (find !== -1) {
        setCurrentFile(find);
        setCurrent(findIndex);
      }
    }
  }, [JSON.stringify(selectedCategory)]);

  const onDone = () => {
    history.push(`/policies-regulations/certify`);
  };

  const onNext = () => {
    if (current === selectedCategory?.policyregulations?.length - 1) {
      onDone();
    }
    dispatch({
      type: 'policiesRegulations/certifyDocumentEffect',
      payload: {
        employeeId: employee?._id,
        isRead: true,
      },
    });
    setCurrent(current + 1);
    const file = selectedCategory?.policyregulations[current + 1];
    setCurrentFile(file);
  };

  const onPrevious = () => {
    if (current > -1) {
      setCurrent(current - 1);
      const file = selectedCategory?.policyregulations[current - 1];
      setCurrentFile(file);
    }
  };

  const _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              {current > 0 && (
                <Button
                  type="secondary"
                  className={styles.bottomBar__button__secondary}
                  onClick={onPrevious}
                >
                  Previous
                </Button>
              )}

              <Button
                type="primary"
                className={styles.bottomBar__button__primary}
                onClick={onNext}
                loading={loadingCertifyDocument}
                disabled={loadingCertifyDocument}
              >
                {current < selectedCategory?.policyregulations?.length - 1 ? 'Next' : 'Done'}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const Note = {
    title: 'Note',
    data: (
      <Typography.Text>
        The Salary structure will be sent as a <span>provisional offer</span>. The candidate must
        accept the and acknowledge the salary structure as a part of final negotiation.
        <br />
        <br />
        <span style={{ fontWeight: 'bold', color: '#707177' }}>
          Post acceptance of salary structure, the final offer letter will be sent.
        </span>
      </Typography.Text>
    ),
  };

  if (loadingGetList)
    return (
      <MainLayout>
        <div className={styles.ViewDocument}>
          <Skeleton active />
        </div>
      </MainLayout>
    );
  return (
    <MainLayout title={selectedCategory?.name}>
      <div className={styles.ViewDocument}>
        <Row gutter={24}>
          <Col xs={24} lg={7} xl={5}>
            <div className={styles.stepContainer}>
              <Steps current={current} direction="vertical">
                {selectedCategory?.policyregulations?.length &&
                  selectedCategory?.policyregulations.map((item) => {
                    return <Steps.Step key={item?.attachment?.id} title={item?.attachment?.name} />;
                  })}
              </Steps>
            </div>
          </Col>
          <Col
            xs={24}
            lg={12}
            xl={13}
            className={styles.mainContainer}
            style={{ paddingBottom: '24px' }}
          >
            {/* <div className={styles.titleHeader}>
              <span className={styles.title}>File Name</span>
            </div> */}
            <div className={styles.leftContent}>
              <FileContent url={currentFile?.attachment?.url} />
            </div>
            {_renderBottomBar()}
          </Col>

          <Col xs={24} lg={5} xl={6}>
            <NoteComponent note={Note} />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default connect(
  ({
    loading,
    policiesRegulations: { listCategory = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { permissions = {}, currentUser },
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    loadingCertifyDocument: loading.effects['policiesRegulations/certifyDocumentEffect'],
    listCategory,
    currentUser,
    permissions,
    listLocationsByCompany,
  }),
)(ViewDocument);
