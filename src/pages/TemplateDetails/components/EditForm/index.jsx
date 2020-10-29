import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { formatMessage } from 'umi';
import EmploymentDetails from '../EmploymentDetails';
import YourInformation from '../YourInformation';
import styles from './index.less';

class EditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: '1',
    };
  }

  onNext = () => {
    const { onNext = {} } = this.props;
    onNext();
  };

  onSwitchTabs = () => {
    const { currentTab } = this.state;

    this.setState(
      {
        currentTab: '2',
      },
      () => {
        console.log(currentTab);
      },
    );
  };

  onTabClick = () => {
    const { currentTab } = this.state;

    this.setState({
      currentTab: currentTab === '1' ? '2' : '1',
    });
  };

  render() {
    const { currentTab } = this.state;
    const { currentTemplate } = this.props;
    const { settings } = currentTemplate;
    const { TabPane } = Tabs;
    return (
      <div className={styles.EditForm}>
        <Tabs onTabClick={this.onTabClick} defaultActiveKey="1" activeKey={currentTab}>
          <TabPane
            className={styles.tabs}
            tab={formatMessage({ id: 'component.editForm.employmentDetails' })}
            key="1"
          >
            <EmploymentDetails onNext={this.onSwitchTabs} settings={settings} />
          </TabPane>
          <TabPane
            className={styles.tabs}
            tab={formatMessage({ id: 'component.editForm.yourInformation' })}
            key="2"
          >
            <YourInformation onNext={this.onNext} />
          </TabPane>
        </Tabs>
        {/* <Button onClick={this.onNext} type="primary">
          {formatMessage({ id: 'component.editForm.next' })}
        </Button> */}
      </div>
    );
  }
}

export default EditForm;
