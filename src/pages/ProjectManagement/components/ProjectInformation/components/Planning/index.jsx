import { Button, Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import WhiteAddIcon from '@/assets/projectManagement/whitePlus.svg';
import AddContent from './components/AddContent';
import MilestoneCard from './components/MilestoneCard';
import CommonModal from '../CommonModal';
import AddButton from '../AddButton';
import styles from './index.less';

const { TabPane } = Tabs;

const Planning = (props) => {
  const [addMilestoneModalVisible, setAddMilestoneModalVisible] = useState(false);
  const {
    milestones = [
      {
        id: 1,
        name: 'Research',
      },
      {
        id: 2,
        name: 'Design',
      },
      {
        id: 3,
        name: 'Engineering',
      },
    ],
  } = props;

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
          >
            Add Milestones
          </Button>
        </div>
      </Card>
    );
  };

  const getMilestoneContent = () => {
    return <MilestoneCard />;
  };

  const renderDataCard = () => {
    const operations = (
      <AddButton text="Add Milestone" onClick={() => setAddMilestoneModalVisible(true)} />
    );

    return (
      <div className={styles.contentCard}>
        <Tabs tabBarExtraContent={operations}>
          {milestones.map((m, i) => {
            return (
              <TabPane tab={m.name} key={m.id}>
                {getMilestoneContent(i)}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  };

  return (
    <div className={styles.Planning}>
      {milestones.length === 0 ? renderEmptyCard() : renderDataCard()}
      <CommonModal
        visible={addMilestoneModalVisible}
        onClose={() => setAddMilestoneModalVisible(false)}
        content={<AddContent />}
        title="Add Milestones"
        firstText="Add"
      />
    </div>
  );
};
export default connect(() => ({}))(Planning);
