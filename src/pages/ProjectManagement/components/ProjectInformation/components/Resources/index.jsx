import { Button, Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import CommonModal from '../CommonModal';
import AddResourceTypeContent from './components/AddResourceTypeContent';
import ResourcesCard from './components/ResourcesCard';
import ResourceTypeCard from './components/ResourceTypeCard';
import ResourceTableCard from './components/ResourceTableCard';

import styles from './index.less';

const { TabPane } = Tabs;

const Resources = (props) => {
  const { resourceTypes = [1] } = props;
  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);

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
            <ResourceTableCard />
            <ResourceTypeCard />
          </TabPane>
          <TabPane tab="Resources" key="2">
            <ResourcesCard />
          </TabPane>
        </Tabs>
      </div>
    );
  };

  return (
    <div className={styles.Resources}>
      {resourceTypes.length === 0 ? renderEmptyCard() : renderDataCard()}
      <CommonModal
        visible={addResourceTypeModalVisible}
        onClose={() => setAddResourceTypeModalVisible(false)}
        content={<AddResourceTypeContent />}
        title="Add Resource Type"
        firstText="Add"
        width={800}
      />
    </div>
  );
};
export default connect(() => ({}))(Resources);
