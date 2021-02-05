/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { UserOutlined, AntDesignOutlined, SearchOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { Avatar, Row, Col } from 'antd';
import avtDefault from '@/assets/avtDefault.jpg';
import s from './index.less';

@connect(({ searchAdvance: { historyKeyword = [], historyEmployees = [] } = {} }) => ({
  historyKeyword,
  historyEmployees,
}))
class ViewHistory extends PureComponent {
  renderItem = (item = {}, index) => {
    const { resetSearch = () => {} } = this.props;
    const { _id = '', generalInfo: { firstName = '', avatar = '' } = {} } = item;
    return (
      <Col
        span={6}
        key={index}
        className={s.itemDisplay}
        onClick={() => {
          history.push(`/employees/employee-profile/${_id}`);
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
    const { changeMode = () => {}, historyKeyword = [], historyEmployees = [] } = this.props;
    return (
      <div className={s.containerViewHistory}>
        {historyKeyword.length !== 0 && (
          <div className={`${s.blockRecent} ${s.viewRecent}`}>
            {historyKeyword.map((item, index) => (
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
        {historyEmployees.length > 0 && (
          <Row className={s.blockRecent}>
            {historyEmployees.map((item, index) => this.renderItem(item, index))}
          </Row>
        )}
        <Row className={s.blockRecent}>
          <Col span={6} className={s.itemDisplay} onClick={this.handleSearchByCategory}>
            <Avatar size={48} icon={<AntDesignOutlined />} />
            <p className={s.itemDisplay__text}>Documents</p>
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
