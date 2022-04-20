import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styleMyApp from '../../index.less';
import AppCard from '../AppCard';

const ShowAllAppModalContent = (props) => {
  const { myApps = [] } = props;

  const renderModalContent = () => {
    return (
      <div className={styleMyApp.content}>
        <Row gutter={[24, 24]}>
          {myApps.map((app) => (
            <AppCard app={app} />
          ))}
        </Row>
      </div>
    );
  };

  return renderModalContent();
};

export default connect(() => ({}))(ShowAllAppModalContent);
