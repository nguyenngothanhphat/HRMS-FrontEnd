import { Button, Card, Tabs, Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import AddContent from './components/AddContent';
import MilestoneCard from './components/MilestoneCard';
import CommonModal from '../../../CommonModal';
import AddButton from '../AddButton';
import styles from './index.less';

const { TabPane } = Tabs;

const Planning = (props) => {
  const {
    dispatch,
    projectDetails: { projectId = '', milestoneList = [] } = {},
    loadingFetch = false,
    loadingAdd = false,
  } = props;

  // permissions
  const { allowModify = false } = props;

  const [addMilestoneModalVisible, setAddMilestoneModalVisible] = useState(false);

  const fetchMilestoneList = () => {
    dispatch({
      type: 'projectDetails/fetchMilestoneListEffect',
      payload: {
        projectId,
      },
    });
  };

  useEffect(() => {
    fetchMilestoneList();
  }, []);

  const renderEmptyCard = () => {
    return (
      <Card>
        <div className={styles.empty}>
          <span className={styles.firstText}>No Milestones added yet.</span>
          <span className={styles.secondText}>
            You are first required to add the milestones, after which you can proceed to add your
            resources.
          </span>
          <Button
            icon={<img src={WhiteAddIcon} alt="" />}
            className={styles.addMilestone}
            onClick={() => setAddMilestoneModalVisible(true)}
            disabled={!allowModify}
          >
            Add Milestones
          </Button>
        </div>
      </Card>
    );
  };

  const renderDataCard = () => {
    const operations = (
      <AddButton text="Add Milestone" onClick={() => setAddMilestoneModalVisible(true)} />
    );

    return (
      <div className={styles.contentCard}>
        <Tabs tabBarExtraContent={allowModify ? operations : null}>
          {milestoneList.map((m) => {
            return (
              <TabPane tab={m.milestoneName} key={m.id}>
                <MilestoneCard data={m} projectId={projectId} allowModify={allowModify} />;
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  };

  if (loadingFetch) {
    return (
      <div className={styles.Planning}>
        <Skeleton active />
      </div>
    );
  }
  return (
    <div className={styles.Planning}>
      {milestoneList.length === 0 ? renderEmptyCard() : renderDataCard()}
      <CommonModal
        visible={addMilestoneModalVisible}
        onClose={() => setAddMilestoneModalVisible(false)}
        content={
          <AddContent
            refreshData={fetchMilestoneList}
            onClose={() => setAddMilestoneModalVisible(false)}
          />
        }
        title="Add Milestones"
        firstText="Add"
        loading={loadingAdd}
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingFetch: loading.effects['projectDetails/fetchMilestoneListEffect'],
  loadingAdd: loading.effects['projectDetails/addMilestoneEffect'],
}))(Planning);
