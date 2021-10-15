import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';

import styles from './index.less';

const AppCard = (props) => {
  const { app: { name = '', icon = '', link = '' } = {} } = props;

  const onAppClick = () => {
    history.push(`/`);
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
