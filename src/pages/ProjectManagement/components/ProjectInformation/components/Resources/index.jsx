import { Button, Card, Tabs, Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import CommonModal from '@/components/CommonModal';
import AddResourceTypeContent from './components/AddResourceTypeContent';
import ResourcesCard from './components/ResourcesCard';
import ResourceTypeCard from './components/ResourceTypeCard';

import styles from './index.less';

const { TabPane } = Tabs;

const Resources = (props) => {
  const {
    dispatch,
    projectDetails: { resourceTypeList = [], projectId = '' } = {},
    loadingAdd = false,
    loadingFetch = false,
  } = props;
  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);
  const [unfilter, setUnfilter] = useState(true);

  // permissions
  const { allowModify = false } = props;

  const fetchResourceTypeList = (searchKey, filter) => {
    dispatch({
      type: 'projectDetails/fetchResourceTypeListEffect',
      payload: {
        projectId,
        searchKey,
        ...filter,
      },
    });
  };

  useEffect(() => {
    fetchResourceTypeList();
  }, []);

  // render ui
  const renderEmptyCard = () => {
    return (
      <Card>
        <div className={styles.empty}>
          <span className={styles.firstText}>No Resource Types added yet.</span>
          <span className={styles.secondText}>
            You are required to add the resource types after which you can add the resources.
          </span>
          <Button
            icon={<img src={WhiteAddIcon} alt="" />}
            className={styles.addResources}
            onClick={() => setAddResourceTypeModalVisible(true)}
            disabled={!allowModify}
          >
            Add Resource Type
          </Button>
        </div>
      </Card>
    );
  };

  const renderDataCard = () => {
    const onTabClick = (key) => {
      if (key === '1') {
        fetchResourceTypeList();
      }
    };
    return (
      <div className={styles.contentCard}>
        <Tabs destroyInactiveTabPane onTabClick={onTabClick}>
          <TabPane tab="Resource Type" key="1">
            <ResourceTypeCard
              data={resourceTypeList}
              refreshResourceType={fetchResourceTypeList}
              allowModify={allowModify}
              setUnfilter={(value) => setUnfilter(value)}
            />
          </TabPane>
          <TabPane tab="Resources" key="2">
            <ResourcesCard allowModify={allowModify} />
          </TabPane>
        </Tabs>
      </div>
    );
  };

  if (loadingFetch && resourceTypeList.length === 0 && unfilter) {
    return (
      <div className={styles.Resources}>
        <Skeleton active />
      </div>
    );
  }
  return (
    <div className={styles.Resources}>
      {resourceTypeList.length === 0 && unfilter ? renderEmptyCard() : renderDataCard()}
      <CommonModal
        visible={addResourceTypeModalVisible}
        onClose={() => setAddResourceTypeModalVisible(false)}
        content={
          <AddResourceTypeContent
            visible={addResourceTypeModalVisible}
            onClose={() => setAddResourceTypeModalVisible(false)}
            refreshData={fetchResourceTypeList}
          />
        }
        title="Add Resource Type"
        firstText="Add"
        width={800}
        loading={loadingAdd}
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingAdd: loading.effects['projectDetails/addResourceTypeEffect'],
  loadingFetch: loading.effects['projectDetails/fetchResourceTypeListEffect'],
}))(Resources);
