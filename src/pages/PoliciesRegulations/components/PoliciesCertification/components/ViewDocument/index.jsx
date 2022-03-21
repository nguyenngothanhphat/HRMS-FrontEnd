import { Button, Col, Row, Skeleton, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import FileContent from './components/FileContent';
import styles from './index.less';

const ViewDocument = (props) => {
  const {
    dispatch,
    currentUser: {
      location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
    } = {},
    loadingGetList = false,
    listCategory = [],
    match: { params: { reId = '', categoryID = '' } = {} },
  } = props;

  const [current, setCurrent] = useState(0);
  const [currentFile, setCurrentFile] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});

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

              <Button type="primary" className={styles.bottomBar__button__primary} onClick={onNext}>
                {current < selectedCategory?.policyregulations?.length - 1 ? 'Next' : 'Done'}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  if (loadingGetList)
    return (
      <div className={styles.ViewDocument}>
        <Skeleton active />
      </div>
    );
  return (
    <div className={styles.ViewDocument}>
      <Row gutter={24}>
        <Col xs={24} lg={7} xl={6}>
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
          lg={17}
          xl={18}
          className={styles.mainContainer}
          style={{ paddingBlock: '24px' }}
        >
          <div className={styles.header}>
            <span className={styles.title}>File Name</span>
          </div>
          <div className={styles.leftContent}>
            <FileContent url={currentFile?.attachment?.url} />
          </div>
          {_renderBottomBar()}
        </Col>
      </Row>
    </div>
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
    listCategory,
    currentUser,
    permissions,
    listLocationsByCompany,
  }),
)(ViewDocument);
