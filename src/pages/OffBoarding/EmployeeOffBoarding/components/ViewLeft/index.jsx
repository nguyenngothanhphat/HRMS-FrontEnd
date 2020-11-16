import React, { Component } from 'react';
import { Button, Tabs } from 'antd';
import { Link } from 'umi';
import icon from '@/assets/offboarding-flow.svg';
import TabContent from './tabContent';
import styles from './index.less';

const datatable = [
  {
    id: 1,
    name: 'Send Request',
  },
  {
    id: 2,
    name: 'Drafts',
  },
];

export default class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
          <Tabs defaultActiveKey="1" className={styles.tabComponent}>
            {datatable.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <TabContent data={data} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}
