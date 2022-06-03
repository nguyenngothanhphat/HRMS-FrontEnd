/* eslint-disable react/no-array-index-key */
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import avtDefault from '@/assets/defaultAvatar.png';

import docIcon from '@/assets/advanceSearchDocs.svg';
import reportIcon from '@/assets/advanceSearchReport.svg';
import requestIcon from '@/assets/advanceSearchRequest.svg';
import eventIcon from '@/assets/advanceSearchEvents.svg';

import s from './index.less';

@connect(({ searchAdvance: { historySearch = {} } = {} }) => ({
  historySearch,
}))
class ViewHistory extends Component {
  renderItem = (item = {}, index) => {
    const { resetSearch = () => {} } = this.props;
    const {
      employee: { _id = '' },
      userId = '',
      firstName = '',
      avatar = '',
    } = item;
    return (
      <Col
        span={6}
        key={index}
        className={s.itemDisplay}
        onClick={() => {
          history.push(`/employees/employee-profile/${userId}`);
          resetSearch();
        }}
      >
        <Avatar size={48} icon={<UserOutlined />} src={avatar || avtDefault} />
        <p className={s.itemDisplay__text}>{firstName}</p>
      </Col>
    );
  };

  searchByHistoryKeyword = (value) => {
    const { closeSearch = () => {}, setKeyword = () => {} } = this.props;
    closeSearch(true);
    setKeyword(value);
    history.push({
      pathname: '/search-result',
      query: { keySearch: value },
    });
  };

  handleSearchByCategory = () => {
    const { resetSearch = () => {} } = this.props;
    history.push({
      pathname: '/search-result',
      query: { isSearchByCategory: true },
    });
    resetSearch();
  };

  render() {
    const {
      changeMode = () => {},
      historySearch: { key = [], dataSearch: { employee = [] } = {} } = {},
    } = this.props;
    return (
      <div className={s.containerViewHistory}>
        {key.length === 0 ? (
          <div className={`${s.blockRecent} ${s.viewRecent}`}>No recents</div>
        ) : (
          <div className={`${s.blockRecent} ${s.viewRecent}`}>
            {key.map((item, index) => (
              <div
                key={index}
                className={s.itemRecent}
                onClick={() => this.searchByHistoryKeyword(item)}
              >
                <SearchOutlined className={s.textRecent__icon} />
                <span className={s.textRecent}>{item}</span>
              </div>
            ))}
          </div>
        )}
        {employee.length === 0 ? (
          <div className={`${s.blockRecent} ${s.viewRecent}`}>No recents</div>
        ) : (
          <Row className={s.blockRecent}>
            {employee.map((item, index) => this.renderItem(item, index))}
          </Row>
        )}
        <Row className={s.blockRecent}>
          <Col span={6} className={s.itemDisplay} onClick={this.handleSearchByCategory}>
            <Avatar size={48} icon={<img alt="documents" src={docIcon} />} />
            <p className={s.itemDisplay__text}>Documents</p>
          </Col>
          <Col span={6} className={s.itemDisplay} onClick={this.handleSearchByCategory}>
            <Avatar size={48} icon={<img alt="Reports" src={reportIcon} />} />
            <p className={s.itemDisplay__text}>Reports</p>
          </Col>
          <Col span={6} className={s.itemDisplay} onClick={this.handleSearchByCategory}>
            <Avatar size={48} icon={<img alt="Requests" src={requestIcon} />} />
            <p className={s.itemDisplay__text}>Requests</p>
          </Col>
          <Col span={6} className={s.itemDisplay} onClick={this.handleSearchByCategory}>
            <Avatar size={48} icon={<img alt="Events" src={eventIcon} />} />
            <p className={s.itemDisplay__text}>Events</p>
          </Col>
        </Row>
        <div className={s.viewActionChangeMode} onClick={() => changeMode('advanced')}>
          Advanced Search
        </div>
      </div>
    );
  }
}

export default ViewHistory;
