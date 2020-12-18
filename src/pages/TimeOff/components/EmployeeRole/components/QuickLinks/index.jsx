import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import ViewPolicyModal from '@/components/ViewPolicyModal';
import styles from './index.less';

const { TabPane } = Tabs;

const mockData = [
  {
    id: 1,
    link: '#',
    text: 'Casual Leave Policy',
  },
  {
    id: 2,
    link: '#',
    text: 'Maternity Leave Policy',
  },
  {
    id: 3,
    link: '#',
    text: 'Bereavement Leave Policy',
  },
  {
    id: 4,
    link: '#',
    text: 'Leave without Pay Policy',
  },
];
export default class QuickLinks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewPolicyModal: false,
    };
  }

  setViewPolicyModal = (value) => {
    this.setState({
      viewPolicyModal: value,
    });
  };

  onLinkClick = () => {
    this.setViewPolicyModal(true);
  };

  render() {
    const { viewPolicyModal } = this.state;
    return (
      <div className={styles.QuickLinks}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quick Links" key="1">
            {mockData.map((row) => (
              <span key={row.id} onClick={this.onLinkClick}>
                {row.text}
              </span>
            ))}
          </TabPane>
        </Tabs>
        <ViewPolicyModal visible={viewPolicyModal} onClose={this.setViewPolicyModal} />
      </div>
    );
  }
}
