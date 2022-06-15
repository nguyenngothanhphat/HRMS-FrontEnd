import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import { flattenDeep } from 'lodash';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import EmptyComponent from '@/components/Empty';
import styles from './index.less';

const { TabPane } = Tabs;

class QuickLinks extends PureComponent {
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

  componentDidMount = () => {
    const { dispatch, location: { _id: locationId = '' } = {} } = this.props;
    dispatch({
      type: 'homePage/fetchQuickLinkTimeOffEffect',
      payload: {
        type: TAB_IDS_QUICK_LINK.TIMEOFF.toLowerCase(),
        location: [locationId],
      },
    });
  };

  render() {
    const { viewDocumentModal, link } = this.state;
    const { quickLinkListTimeOff } = this.props;
    const quickLinkList = flattenDeep(quickLinkListTimeOff.map((x) => x.attachmentInfo));
    return (
      <div className={styles.QuickLinks}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quick Links" key="1">
            {quickLinkList.length <= 0 && <EmptyComponent />}
            {quickLinkList.map((row) => (
              <span key={row.id} onClick={() => this.onLinkClick(row.url)}>
                {row.name.slice(0, -4)}
              </span>
            ))}
          </TabPane>
        </Tabs>
        <ViewDocumentModal
          url={link}
          visible={viewDocumentModal}
          onClose={() => this.setViewDocumentModal(false)}
        />
      </div>
    );
  }
}

export default connect(
  ({
    homePage: { quickLinkListTimeOff = [] } = {},
    user: { currentUser: { location = {} } = {} } = {},
  }) => ({
    quickLinkListTimeOff,
    location,
  }),
)(QuickLinks);
