import { Button } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import CustomDatePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomDatePicker';
import ImportModal from '@/pages/TimeSheet/components/ComplexView/components/ImportModal';
import styles from './index.less';

const DailyHeader = (props) => {
  const {
    selectedDate,
    setSelectedDate = () => {},
    viewChangeComponent = '',
    loadingFetch = false,
  } = props;
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  // MAIN AREA
  return (
    <div className={styles.DailyHeader}>
      <div className={styles.DailyHeader__left}>
        <CustomDatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disableBtn={loadingFetch}
        />
      </div>
      <div className={styles.DailyHeader__middle}>{viewChangeComponent()}</div>
      <div className={styles.DailyHeader__right}>
        <Button icon={<img src={AddIcon} alt="" />} onClick={() => setAddTaskModalVisible(true)}>
          Add Task
        </Button>
        <Button onClick={() => setImportModalVisible(true)}>Import</Button>
      </div>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        date={selectedDate}
        mode="multiple"
      />
      <ImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        date={selectedDate}
      />
    </div>
  );
};

export default connect(() => ({}))(DailyHeader);
