import React, { Component } from 'react';
import { history } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import s from './index.less';

const listQuickLinks = [
  {
    name: 'Coronavirus resources',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
    isNew: true,
  },
  {
    name: 'Work From Home guidelines',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
    isNew: true,
  },
  {
    name: 'Employee Handbook',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
  },
  {
    name: 'Annual Report 2020',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
  },
  {
    name: 'Training Program 2020',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
  },
  {
    name: 'Submit Commuter Claim',
    href: 'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf',
  },
];

export default class QuickLinks extends Component {
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
    const { name = '', href = '', isNew = false } = item;
    return (
      <div style={{ display: 'flex' }} key={item}>
        <p onClick={() => this.openModalViewPDF(href, name)}>{name}</p>
        {isNew && <div className={s.new}>New</div>}
      </div>
    );
  };

  renderContent = () => {
    const { type = '' } = this.props;
    return (
      <div className={s.QuickLinks}>
        {listQuickLinks.map((item) =>
          type === 'link' ? this.renderLink(item) : this.renderViewPDF(item),
        )}
      </div>
    );
  };

  render() {
    const { visible = false, linkPDF = '', title: titleNews = '' } = this.state;
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
