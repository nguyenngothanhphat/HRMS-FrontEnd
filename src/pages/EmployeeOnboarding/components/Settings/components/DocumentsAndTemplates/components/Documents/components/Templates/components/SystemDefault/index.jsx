import React, { PureComponent } from 'react';
import TemplateTable from '../../../TemplateTable';

class SystemDefault extends PureComponent {
  render() {
    const { list = [], loading = false } = this.props;
    return <TemplateTable list={list} loading={loading} inTab />;
  }
}

export default SystemDefault;
