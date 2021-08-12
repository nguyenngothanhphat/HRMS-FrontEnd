import React, { Component } from 'react';
import { Link, history } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import s from './index.less';

export default class Links extends Component {
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

  render() {
    const { title = '', showButton = false, listData = [], type = '' } = this.props;
    const { visible = false, linkPDF = '', title: titleNews = '' } = this.state;
    return (
      <>
        <div className={s.root}>
          <div className={s.viewTop}>
            <div className={s.title}>{title}</div>
            {showButton && (
              <Link to="/faqpage">
                <div className={s.btnViewAll}>View all</div>
              </Link>
            )}
          </div>
          {listData.map((item) =>
            type === 'link' ? this.renderLink(item) : this.renderViewPDF(item),
          )}
        </div>
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
