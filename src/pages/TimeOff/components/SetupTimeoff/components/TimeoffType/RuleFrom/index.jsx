import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
// import addIcon from '@/assets/addTicket.svg';
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
              <Button className={styles.buttonRequest}>{render.button}</Button>
            </div>
          </div>
          <div className={styles.straightLine} />
          <div>
            {children.map((item, index) => {
              const { title, name, change } = item;
              return (
                <div>
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
                  {index !== children.length - 1 && <div className={styles.borderStyles} />}
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
      <div className={styles.root}>
        <Row gutter={[30, 25]}>
          {array.map((render) => (
            <Col span={24}>{this.renderItem(render)}</Col>
          ))}
        </Row>
        <div className={styles.footer}>
          <Button className={styles.btnNext}>Next</Button>
        </div>
      </div>
    );
  }
}

export default RuleFrom;
