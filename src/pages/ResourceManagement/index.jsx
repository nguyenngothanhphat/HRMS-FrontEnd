import React, { PureComponent } from 'react';
import ManagerTicket from './Resources';

class ResourceManagement extends PureComponent {
  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    return <ManagerTicket tabName={tabName} />;
  }
}

export default ResourceManagement;
