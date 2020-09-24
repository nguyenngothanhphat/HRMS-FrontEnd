import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';

import EmploymentDetails from '../EmploymentDetails';
import YourInformation from '../YourInformation';
import styles from './index.less';

class EditForm extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <div className={styles.EditForm}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Employment details" key="1">
            <EmploymentDetails />
          </TabPane>
          <TabPane tab="Your information" key="2">
            <YourInformation />
          </TabPane>
        </Tabs>
        <Button type="primary">Next</Button>
      </div>
    );
  }
}

export default EditForm;
