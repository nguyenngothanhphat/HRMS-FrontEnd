import { Button, Card, Tabs, Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import CommonModal from '../CommonModal';
import AddResourceTypeContent from './components/AddResourceTypeContent';
import ResourcesCard from './components/ResourcesCard';
import ResourceTypeCard from './components/ResourceTypeCard';

import styles from './index.less';

const { TabPane } = Tabs;

const Resources = (props) => {
  const {
    dispatch,
    projectDetails: { resourceTypeList = [], projectDetail: { projectId = '' } = {} } = {},
    loadingAdd = false,
    loadingFetch = false,
  } = props;
  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);

  const fetchResourceTypeList = (name) => {
    dispatch({
      type: 'projectDetails/fetchResourceTypeListEffect',
      payload: {
        projectId,
        name,
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
          >
            Add Resource Type
          </Button>
        </div>
      </Card>
    );
  };

  const renderDataCard = () => {
    return (
      <div className={styles.contentCard}>
        <Tabs>
          <TabPane tab="Resource Type" key="1">
            <ResourceTypeCard data={resourceTypeList} refreshData={fetchResourceTypeList} />
          </TabPane>
          <TabPane tab="Resources" key="2">
            <ResourcesCard />
          </TabPane>
        </Tabs>
      </div>
    );
  };

  if (loadingFetch && resourceTypeList.length === 0)
    return (
      <div className={styles.Resources}>
        <Skeleton />
      </div>
    );
  return (
    <div className={styles.Resources}>
      {resourceTypeList.length === 0 ? renderEmptyCard() : renderDataCard()}
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
