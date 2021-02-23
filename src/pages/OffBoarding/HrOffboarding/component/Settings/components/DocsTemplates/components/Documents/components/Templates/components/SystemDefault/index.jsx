import React, { PureComponent } from 'react';
import TemplateTable from '../../../TemplateTable';

class SystemDefault extends PureComponent {
  render() {
    const { list = [] } = this.props;
    return <TemplateTable list={list} inTab />;
  }
}

export default SystemDefault;
