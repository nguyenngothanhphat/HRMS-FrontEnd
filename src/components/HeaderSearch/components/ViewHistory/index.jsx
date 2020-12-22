/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import iconRecent from '@/assets/iconRecent.png';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Row, Col, Avatar } from 'antd';
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
  'Manasi Sanghani',
];

const dummyListType = ['Documents', 'Reports', 'Requests', 'Events'];

class ViewHistory extends PureComponent {
  render() {
    const { changeMode = () => {} } = this.props;
    return (
      <div className={s.containerViewHistory}>
        {dummyListRecent.length !== 0 && (
          <div className={s.blockRecent}>
            <p className={s.titleBlock}>Recent</p>
            {dummyListRecent.map((item, index) => (
              <div key={index} style={{ marginTop: '16px' }}>
                <img src={iconRecent} alt="iconRecent" style={{ marginRight: '12px' }} />
                {item}
              </div>
            ))}
          </div>
        )}
        <div className={s.blockRecent}>
          <p className={s.titleBlock} style={{ marginBottom: '16px' }}>
            People
          </p>
          <Row gutter={[16, 16]}>
            {dummyListPeople.map((item, index) => (
              <Col span={6} key={index} className={s.viewCol}>
                <Avatar style={{ marginRight: '10px' }} size="small" icon={<UserOutlined />} />
                {item}
              </Col>
            ))}
          </Row>
        </div>
        <div className={s.blockRecent}>
          <p className={s.titleBlock} style={{ marginBottom: '16px' }}>
            Type
          </p>
          <Row gutter={[16, 16]}>
            {dummyListType.map((item, index) => (
              <Col span={6} key={index} className={s.viewCol}>
                <Avatar style={{ marginRight: '10px' }} size="small" icon={<AntDesignOutlined />} />
                {item}
              </Col>
            ))}
          </Row>
        </div>
        <div className={s.viewActionChangeMode} onClick={() => changeMode('advanced')}>
          Advanced Search
        </div>
      </div>
    );
  }
}

export default ViewHistory;
