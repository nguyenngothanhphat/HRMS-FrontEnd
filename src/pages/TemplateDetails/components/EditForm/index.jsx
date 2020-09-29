import React, { PureComponent } from 'react';
import { Tabs, Button } from 'antd';
import { formatMessage } from 'umi';
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
          <TabPane
            className={styles.tabs}
            tab={formatMessage({ id: 'component.editForm.employmentDetails' })}
            key="1"
          >
            <EmploymentDetails />
          </TabPane>
          <TabPane
            className={styles.tabs}
            tab={formatMessage({ id: 'component.editForm.yourInformation' })}
            key="2"
          >
            <YourInformation />
          </TabPane>
        </Tabs>
        <Button onClick={this.onNext} type="primary">
          {formatMessage({ id: 'component.editForm.next' })}
        </Button>
      </div>
    );
  }
}

export default EditForm;
