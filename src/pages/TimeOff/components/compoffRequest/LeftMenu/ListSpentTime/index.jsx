import React, { Component } from 'react';
import { Row, Col, Input } from 'antd';
import NoteIcon from '@/assets/xclose.svg';
import styles from './index.less';

class ListSpentTime extends Component {
  onChange = () => {};

  delete = (data) => {
    console.log(data);
  };

  renderItem = (render) => {
    return (
      <Row gutter={[10, 17]}>
        <Col span={7}>
          <div>{render.date} </div>
        </Col>
        <Col span={7}>
          <div>{render.day} </div>
        </Col>
        <Col span={9}>
          <div className={styles.flex}>
            <Input value={render.spentTime} className={styles.inputField} />
            <img src={NoteIcon} alt="" onClick={() => this.delete(render.id)} />
          </div>
        </Col>
      </Row>
    );
  };

  render() {
    const array = [
      {
        date: '13.08.2020',
        day: '15.08.2020',
        spentTime: '5',
        id: '12',
      },
      {
        date: '13.08.2020',
        day: '15.08.2020',
        spentTime: '10',
        id: '7',
      },
      {
        date: '13.08.2020',
        day: '15.08.2020',
        spentTime: '7',
        id: '9',
      },
    ];

    return (
      <div className={styles.root}>
        <Row gutter={[10, 17]}>
          <Col span={7}>
            <div> Date</div>
          </Col>
          <Col span={7}>
            <div>Day </div>
          </Col>
          <Col span={7}>
            <div>Time Spent </div>
          </Col>
        </Row>
        {array && array ? (
          array.map((render) => this.renderItem(render))
        ) : (
          <div className={styles.nondata}>Selected duration will appear as individual days.</div>
        )}
      </div>
    );
  }
}

export default ListSpentTime;
