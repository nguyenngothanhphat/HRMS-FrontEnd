import React, { Component } from 'react';
import { history, connect } from 'umi';
import { flattenDeep } from 'lodash';
import { Spin } from 'antd';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import s from './index.less';
import EmptyComponent from '../Empty';

class QuickLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkPDF: '',
      title: '',
    };
  }

  openModalViewPDF = (linkPDF, title) => {
    this.setState({
      visible: true,
      linkPDF,
      title,
    });
  };

  closeModalViewPDF = () => {
    this.setState({
      visible: false,
      linkPDF: '',
      title: '',
    });
  };

  mapItemMenu = (value) => {
    const { _id } = value;
    history.push({
      pathname: `/faqpage`,
      query: {
        id: _id,
      },
    });
  };

  renderLink = (item) => {
    const { name } = item;
    return (
      <div style={{ display: 'flex' }} key={item} onClick={() => this.mapItemMenu(item)}>
        <div className={s.link}> {name}</div>
      </div>
    );
  };

  renderViewPDF = (item) => {
    const { name = '', url = '', isRead = false } = item;
    return (
      <div style={{ display: 'flex' }} key={item}>
        <p onClick={() => this.openModalViewPDF(url, name)}>{name.slice(0, -4)}</p>
        {isRead && <div className={s.new}>New</div>}
      </div>
    );
  };

  renderContent = () => {
    const { type = '', quickLinkListHomePage = [] } = this.props;
    const listQuickLinks = flattenDeep(quickLinkListHomePage.map((x) => x.attachmentInfo));
    return (
      <div className={s.QuickLinks}>
        {!listQuickLinks.length > 0 && <EmptyComponent />}
        {listQuickLinks.map((item) =>
          type === 'link' ? this.renderLink(item) : this.renderViewPDF(item),
        )}
      </div>
    );
  };

  componentDidMount = () => {
    const { dispatch, location: { _id: locationId = '' } = {} } = this.props;
    dispatch({
      type: 'homePage/fetchQuickLinkHomePageEffect',
      payload: {
        type: TAB_IDS_QUICK_LINK.GENERAL.toLowerCase(),
        location: [locationId],
      },
    });
  };

  render() {
    const { visible = false, linkPDF = '', title: titleNews = '' } = this.state;
    const { loadingFetchQuickLinkList } = this.props;
    if (loadingFetchQuickLinkList) return <Spin />;
    return (
      <>
        {this.renderContent()}
        <ViewDocumentModal
          fileName={titleNews}
          url={linkPDF}
          visible={visible}
          onClose={this.closeModalViewPDF}
        />
      </>
    );
  }
}

export default connect(
  ({
    homePage: { quickLinkListHomePage = [] } = {},
    loading,
    user: { currentUser: { location = {} } = {} } = {},
  }) => ({
    quickLinkListHomePage,
    location,
    loadingFetchQuickLinkList: loading.effects['homePage/fetchQuickLinkHomePageEffect'],
  }),
)(QuickLinks);
