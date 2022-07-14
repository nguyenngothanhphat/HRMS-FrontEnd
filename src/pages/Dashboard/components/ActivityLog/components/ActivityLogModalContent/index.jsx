import React from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import CommonTab from '../CommonTab';

const ActivityLogModalContent = (props) => {
  const { tabKey = '', data = [] } = props;

  const renderModalContent = () => {
    if (data.length === 0) return <EmptyComponent />;
    switch (tabKey) {
      case '1':
        return <CommonTab isInModal type={tabKey} data={data} />;
      case '2':
        return <CommonTab isInModal type={tabKey} data={data} />;
      case '3':
        return <CommonTab isInModal type={tabKey} data={data} />;
      case '4':
        return <CommonTab isInModal type={tabKey} data={data} {...props} />;
      default:
        return '';
    }
  };
  return <div style={{ paddingBottom: 16 }}>{renderModalContent()}</div>;
};

export default connect(() => ({}))(ActivityLogModalContent);
