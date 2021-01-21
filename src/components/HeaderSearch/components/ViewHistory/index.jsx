/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { UserOutlined, AntDesignOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { Avatar, Row, Col } from 'antd';
import s from './index.less';

const dummyListRecent = ['PSI 2021', 'Townhall - December, 2020', 'Pitch doc'];
const dummyListPeople = [
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
  'Manasi Sanghani',
];

const dummyListType = ['Documents', 'Reports', 'Requests', 'Events'];

class ViewHistory extends PureComponent {
  renderItem = (item, index, isType = false) => {
    return (
      <Col span={6} key={index} className={s.itemDisplay}>
        <Avatar size={48} icon={!isType ? <UserOutlined /> : <AntDesignOutlined />} />
        <p className={s.itemDisplay__text}>{item}</p>
      </Col>
    );
  };

  searchByHistoryKeyword = (value) => {
    const { closeSearch = () => {}, setKeyword = () => {} } = this.props;
    closeSearch(false);
    setKeyword(value);
    history.push({
      pathname: '/search-result',
      query: { keySearch: value },
    });
  };

  render() {
    const { changeMode = () => {} } = this.props;
    return (
      <div className={s.containerViewHistory}>
        {dummyListRecent.length !== 0 && (
          <div className={`${s.blockRecent} ${s.viewRecent}`}>
            {dummyListRecent.map((item, index) => (
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
        <div className={s.blockRecent}>
          <Row>{dummyListPeople.map((item, index) => this.renderItem(item, index))}</Row>
        </div>
        <div className={s.blockRecent}>
          <Row>{dummyListType.map((item, index) => this.renderItem(item, index, true))}</Row>
        </div>
        <div className={s.viewActionChangeMode} onClick={() => changeMode('advanced')}>
          Advanced Search
        </div>
      </div>
    );
  }
}

export default ViewHistory;
