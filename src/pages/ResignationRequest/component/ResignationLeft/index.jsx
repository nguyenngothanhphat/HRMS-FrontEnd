import React, { Component } from 'react';
import { Input, Form, Button } from 'antd';
import { connect } from 'umi';

import icon from '@/assets/offboarding-schedule.svg';
import styles from './index.less';

const { TextArea } = Input;
@connect()
class ResignationLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = async (values) => {
    const { dispatch } = this.props;
    const { reasonForLeaving } = values;

    if (dispatch) {
      await dispatch({
        type: 'offboarding/sendRequest',
        payload: {
          reasonForLeaving,
          action: 'submit',
          name: 'new request',
          approvalFlow: '5fa5062e53f4cf5c9ab0fbba',
        },
      });
    }
  };

  submitForm = (values) => {
    // const { username } = values;

    console.log(values);
  };

  render() {
    return (
      <div className={styles.resignationLeft}>
        <div className={styles.title_Box}>
          <div>
            <img src={icon} alt="iconCheck" className={styles.icon} />
          </div>
          <span className={styles.title_Text}>
            A last working date (LWD) will generated after your request is approved by your manager
            and the HR.
            <p>
              The Last Working Day (LWD) will be generated as per our Standard Offboarding Policy.
            </p>
          </span>
        </div>
        <Form onFinish={this.onFinish}>
          <div className={styles.titleBody}>
            <div className={styles.center}>
              <p className={styles.textBox}> Reason for leaving us?</p>
              <p className={styles.textTime}>
                <span style={{ color: 'black' }}>22.05.20 </span>| 12PM
              </p>
            </div>
            <Form.Item
              name="reasonForLeaving"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea className={styles.boxReason} />
            </Form.Item>
          </div>
          <div className={styles.subbmitForm}>
            <div className={styles.subbmiText}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </div>
            <Form.Item>
              <Button className={styles.buttonDraft} onClick={() => this.onFinish('fdfdfdf')}>
                Save to draft
              </Button>
              <Button className={styles.buttonSubmit} htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}
export default ResignationLeft;
