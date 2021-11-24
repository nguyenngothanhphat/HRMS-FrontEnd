import React, { PureComponent } from 'react';
import { Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

class ProjectStatictis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.projectStatictis}>
        <Select className={styles.select} placeholder='Select' defaultValue='All Projects(131)'>
          <Option>Value1</Option>
        </Select>
      </div>
    );
  }
}

export default ProjectStatictis;
