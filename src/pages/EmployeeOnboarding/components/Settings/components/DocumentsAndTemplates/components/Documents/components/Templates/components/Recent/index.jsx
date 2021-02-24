import React, { PureComponent } from 'react';
import TemplateTable from '../../../TemplateTable';

class Recent extends PureComponent {
  render() {
    const { list = [], loading = false } = this.props;
    return <TemplateTable list={list} loading={loading} inTab />;
  }
}

export default Recent;
