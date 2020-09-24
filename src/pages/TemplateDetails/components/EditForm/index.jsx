import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';

import styles from './index.less';

class EditForm extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <div className={styles.EditForm}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Employment details" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Your information" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
        <Button type="primary">Next</Button>
      </div>
    );
  }
}

export default EditForm;
