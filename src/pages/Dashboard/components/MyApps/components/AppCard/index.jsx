import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';

import styles from './index.less';

const AppCard = (props) => {
  const { app: { name = '', icon = '', link = '' } = {} } = props;
  let directlyClick = '';  

  if(name === 'Timesheets') {directlyClick = '/time-sheet'}
  if(name === 'Directory') {directlyClick = '/directory/org-chart'}
  if(name === 'Timeoff') {directlyClick = '/time-off/overview'}
  const onAppClick = () => {
    history.push(directlyClick);
  };

  return (
    <Col span={8} className={styles.AppCard} onClick={() => onAppClick(link)}>
      <div>
        <img src={icon} alt="" />
        <span>{name}</span>
      </div>
    </Col>
  );
};

export default connect(() => ({}))(AppCard);
