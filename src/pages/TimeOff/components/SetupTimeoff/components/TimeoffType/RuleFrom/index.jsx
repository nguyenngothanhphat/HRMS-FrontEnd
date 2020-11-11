import React, { Component } from 'react';
import { Row, Col } from 'antd';
import addIcon from '@/assets/addTicket.svg';
import icon from '@/assets/delete.svg';
import styles from './index.less';

class RuleFrom extends Component {
  onChange = () => {};

  renderItem = (render) => {
    const { children = [] } = render;
    return (
      <div className={styles.TimeoffRuleFrom}>
        <div className={styles.from}>
          <div className={styles.header}>
            <div className={styles.flex}>
              <div className={styles.title}>{render.type}</div>
              <div className={styles.buttonRequest}>
                <img src={addIcon} alt="" style={{ margin: '5px' }} />
                <span>{render.button}</span>
              </div>
            </div>
          </div>
          <div className={styles.strang} />
          <div className={styles.body}>
            {children.map((item) => {
              const { title, name, change } = item;
              return (
                <div className={styles.flexText}>
                  <div className={styles.text}>{title}</div>
                  {name !== 'true' ? (
                    <div className={styles.Configure}>
                      <span onClick={change}> Configure</span>
                    </div>
                  ) : (
                    <div className={styles.Configure}>
                      <span> Configure</span>
                      <img src={icon} alt="" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { onChangeCasualLeave = () => {} } = this.props;
    const array = [
      {
        type: 'Type A: Paid Leaves',
        button: 'Add a new paid leave',

        children: [
          {
            title: 'Casual Leave (CL)*',
            change: onChangeCasualLeave,
          },
          {
            title: 'Sick Leave (SL)* ',
          },
          {
            title: ' Compensation leave (Co) ',
            name: 'true',
          },
        ],
      },
      {
        type: 'Type B: Unpaid Leaves',
        button: 'Add a new paid leave',
        children: [
          {
            title: 'Leave without Pay (LWP)*',
          },
        ],
      },
      {
        type: 'Type C: Paid Leaves',
        button: 'Add a new paid leave',
        children: [
          {
            title: 'Casual Leave (CL)*',
          },
          {
            title: 'Sick Leave (SL)* ',
            name: 'true',
          },
          {
            title: ' Compensation leave (Co) ',
            name: 'true',
          },
        ],
      },
      {
        type: 'Type D: Unpaid Leaves',
        button: 'Add a new paid leave',
        children: [
          {
            title: 'Work from Client Place (WCP)*',
          },
          {
            title: 'Work from Home (WFH)',
            name: 'true',
          },
        ],
      },
    ];

    return (
      <Row className={styles.root} gutter={[30, 25]}>
        {array.map((render) => (
          <Col span={12}>{this.renderItem(render)}</Col>
        ))}
      </Row>
    );
  }
}

export default RuleFrom;
