import React, { PureComponent } from 'react';
import { Tabs, Anchor } from 'antd';
import styles from './index.less';

const { Link } = Anchor;
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
  render() {
    return (
      <div className={styles.QuickLinks}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quick Links" key="1">
            <Anchor affix={false}>
              {mockData.map((row) => (
                <Link key={row.id} href={row.link} title={row.text} />
              ))}
            </Anchor>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
