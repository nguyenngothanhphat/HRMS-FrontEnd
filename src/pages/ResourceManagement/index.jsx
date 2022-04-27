import React, { PureComponent } from 'react';
import { connect } from 'umi';
import ManagerTicket from './Resources';

@connect(() => ({}))
class ResourceManagement extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/clearState',
    });
  }

  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    return <ManagerTicket tabName={tabName} />;
  }
}

export default ResourceManagement;
