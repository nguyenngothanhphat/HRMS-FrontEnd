import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const { TabPane } = Tabs;

const mockData = [
  {
    id: 1,
    link: 'http://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
    text: 'Casual Leave Policy',
  },
  {
    id: 2,
    link: 'http://api-stghrms.paxanimi.ai/api/attachments/60c6fe575c94a70561aaca35/ModelMaternityPolicy.pdf',
    text: 'Maternity Leave Policy',
  },
  {
    id: 3,
    link: 'http://api-stghrms.paxanimi.ai/api/attachments/60c6ff445c94a70561aaca44/sampleBereavementLeavePolicy.pdf',
    text: 'Bereavement Leave Policy',
  },
  {
    id: 4,
    link: 'http://api-stghrms.paxanimi.ai/api/attachments/60c6ff9d5c94a70561aaca47/LWOP%2520Guidelines.pdf',
    text: 'Leave without Pay Policy',
  },
];
export default class QuickLinks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewDocumentModal: false,
      link: '',
    };
  }

  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  onLinkClick = (link) => {
    this.setViewDocumentModal(true);
    this.setState({
      link,
    });
  };

  render() {
    const { viewDocumentModal, link } = this.state;
    return (
      <div className={styles.QuickLinks}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quick Links" key="1">
            {mockData.map((row) => (
              <span key={row.id} onClick={() => this.onLinkClick(row.link)}>
                {row.text}
              </span>
            ))}
          </TabPane>
        </Tabs>
        <ViewDocumentModal
          url={link}
          visible={viewDocumentModal}
          onClose={this.setViewDocumentModal}
        />
      </div>
    );
  }
}
