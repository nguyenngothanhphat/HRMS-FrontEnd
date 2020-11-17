import React, { Component } from 'react';
import { Button, Tabs } from 'antd';
import { Link } from 'umi';
import icon from '@/assets/offboarding-flow.svg';
import TabContent from './tabContent';
import TabDrafts from './TableEmployee';
import styles from './index.less';

export default class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId } = this.state;

    if (prevState.tabId !== tabId) {
      this.initDataTable(tabId);
    }
  }

  initDataTable = (tabId) => {
    if (tabId === '1') {
      console.log('tab1');
    }
    if (tabId === '2') {
      console.log('tab2');
    }
  };

  callback = (key) => {
    this.setState({
      tabId: key,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { data = [] } = this.props;

    return (
      <div className={styles.Contanner}>
        <div className={styles.title_Box}>
          <div>
            <img src={icon} alt="iconCheck" className={styles.icon} />
          </div>
          <span className={styles.title_Text}>
            Super six years with us. Thank you. We are indebted by your contribution to our company
            and clients all this while.
            <p>
              This is not the end we like to see.{' '}
              <span style={{ color: 'blue' }}> Request for feedback?</span>
            </p>
          </span>
        </div>
        <div className={styles.subTitle_Text}>
          But, if you have made your mind then lets get to it.
        </div>
        <Button className={styles.submitButton}>
          <Link to="/employee-offboarding/resignation-request"> Set a resgination request </Link>
        </Button>
        <div>
          <Tabs defaultActiveKey="1" className={styles.tabComponent} onTabClick={this.callback}>
            <TabPane tab="Send Request" key="1">
              <TabContent data={data} />
            </TabPane>
            <TabPane tab="Drafts" key="2">
              <div className={styles.marrinTop}>
                <TabDrafts data={data} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
