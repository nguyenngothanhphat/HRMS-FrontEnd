import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';

import EmploymentDetails from '../EmploymentDetails';
import YourInformation from '../YourInformation';
import styles from './index.less';

class EditForm extends PureComponent {
  onNext = () => {
    const { onNext = {} } = this.props;
    onNext();
  };

  render() {
    const { TabPane } = Tabs;
    return (
      <div className={styles.EditForm}>
        <Tabs defaultActiveKey="1">
          <TabPane className={styles.tabs} tab="Employment details" key="1">
            <EmploymentDetails />
          </TabPane>
          <TabPane className={styles.tabs} tab="Your information" key="2">
            <YourInformation />
          </TabPane>
        </Tabs>
        <Button onClick={this.onNext} type="primary">
          Next
        </Button>
      </div>
    );
  }
}

export default EditForm;
