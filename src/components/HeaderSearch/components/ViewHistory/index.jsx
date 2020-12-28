/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import iconRecent from '@/assets/iconRecent.png';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import s from './index.less';

const dummyListRecent = ['PSI 2021', 'Townhall - December, 2020', 'Pitch doc'];
const dummyListPeople = [
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
  'Manasi Sanghani',
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
];

const dummyListType = ['Documents', 'Reports', 'Requests', 'Events'];

class ViewHistory extends PureComponent {
  renderItem = (item, index, isType = false) => {
    return (
      <div key={index} className={s.itemDisplay}>
        <Avatar size={40} icon={!isType ? <UserOutlined /> : <AntDesignOutlined />} />
        <p style={{ marginTop: '10px' }}>{item}</p>
      </div>
    );
  };

  render() {
    const { changeMode = () => {} } = this.props;
    return (
      <div className={s.containerViewHistory}>
        {dummyListRecent.length !== 0 && (
          <div className={s.blockRecent}>
            <p className={s.titleBlock}>Recent</p>
            {dummyListRecent.map((item, index) => (
              <div key={index} style={{ marginTop: '16px', cursor: 'pointer' }}>
                <img src={iconRecent} alt="iconRecent" style={{ marginRight: '12px' }} />
                {item}
              </div>
            ))}
          </div>
        )}
        <div className={`${s.blockRecent} ${s.viewRow}`}>
          {dummyListPeople.map((item, index) => this.renderItem(item, index))}
        </div>
        <div className={`${s.blockRecent} ${s.viewRow}`}>
          {dummyListType.map((item, index) => this.renderItem(item, index, true))}
        </div>
        <div className={s.viewActionChangeMode} onClick={() => changeMode('advanced')}>
          Advanced Search
        </div>
      </div>
    );
  }
}

export default ViewHistory;
