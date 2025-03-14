import { Card, Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import AddResourceTypeContent from './components/AddResourceTypeContent';
import ResourcesCard from './components/ResourcesCard';
import ResourceTypeCard from './components/ResourceTypeCard';

import CustomPrimaryButton from '@/components/CustomPrimaryButton';
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
  const [filter, setFilter] = useState({});
  const [searchValue, setSearchValue] = useState('');

  // permissions
  const { allowModify = false } = props;

  const fetchResourceTypeList = () => {
    dispatch({
      type: 'projectDetails/fetchResourceTypeListEffect',
      payload: {
        projectId,
        searchKey: searchValue,
        ...filter,
      },
    });
  };

  useEffect(() => {
    fetchResourceTypeList();
  }, [searchValue, JSON.stringify(filter)]);

  // render ui
  const renderEmptyCard = () => {
    return (
      <Card>
        <div className={styles.empty}>
          <span className={styles.firstText}>No Resource Types added yet.</span>
          <span className={styles.secondText}>
            You are required to add the resource types after which you can add the resources.
          </span>
          <CustomPrimaryButton
            icon={<img src={WhiteAddIcon} alt="" />}
            onClick={() => setAddResourceTypeModalVisible(true)}
            disabled={!allowModify}
            height={36}
          >
            Add Resource Type
          </CustomPrimaryButton>
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
              setFilter={setFilter}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              filter={filter}
            />
          </TabPane>
          <TabPane tab="Resources" key="2">
            <ResourcesCard allowModify={allowModify} />
          </TabPane>
        </Tabs>
      </div>
    );
  };

  const applied = Object.values(filter).filter((v) => v).length;
  const isAllEmpty = applied === 0 && !searchValue && resourceTypeList.length === 0;

  if (loadingFetch && isAllEmpty) {
    return (
      <div className={styles.Resources}>
        <Skeleton active />
      </div>
    );
  }
  return (
    <div className={styles.Resources}>
      {isAllEmpty ? renderEmptyCard() : renderDataCard()}
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
