import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { EMP_ROW_HEIGHT } from '@/constants/timeSheet';
import { diffTime } from '@/utils/utils';
import styles from './index.less';

const marginBlock = 8;
const CardOverlay = (props) => {
  const { timeSheet: { projectList = [] } = {}, selectedTask = {} } = props;
  const { startTime = '', endTime = '', projectId = '' } = selectedTask;
  const selectedProject = projectList.find((item) => item.id === projectId);

  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();

  const timeFormat = (time) => moment(time, 'hh:mm a').format('HH:mm');

  useEffect(() => {
    if (startTime && endTime) {
      const topMinutes = diffTime(timeFormat(startTime), 0, 'minutes');
      const bottomMinutes = diffTime(24, timeFormat(endTime), 'minutes');
      setTop((EMP_ROW_HEIGHT * topMinutes) / 60 + EMP_ROW_HEIGHT / 2 + marginBlock / 2);
      setBottom((EMP_ROW_HEIGHT * bottomMinutes) / 60 + EMP_ROW_HEIGHT / 2 + marginBlock / 2);
    }
  }, [selectedTask]);

  return (
    <div className={styles.CardOverlay} style={{ top, bottom }}>
      <div className={styles.projectName}>
        {selectedProject ? selectedProject.projectName : '(Untitled)'}
      </div>
      <div className={styles.projectTime}>
        {moment(startTime, 'hh:mm a').format('hh:mm A')} -{' '}
        {moment(endTime, 'hh:mm a').format('hh:mm A')}
      </div>
    </div>
  );
};

export default connect(({ timeSheet }) => ({
  timeSheet,
}))(CardOverlay);
