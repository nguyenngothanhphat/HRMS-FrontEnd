import React from 'react';
import { Input, Form, Button } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import icon from '@/assets/offboarding-schedule.svg';
import styles from './index.less';

const ResigationLeft = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const date = moment().format('DD.MM.YY | h:mm A');

  const submitForm = (type) => {
    const { dispatch, approvalflow = [] } = props;
    const fiterActive = approvalflow.find((item) => item.status === 'ACTIVE') || {};
    const data = form.getFieldValue('field2');
    if (dispatch) {
      dispatch({
        type: 'offboarding/sendRequest',
        payload: {
          reasonForLeaving: data,
          action: type === 'draft ' ? 'submit' : 'draft',
          approvalFlow: fiterActive._id,
        },
      });
    }
  };
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
      <Form form={form}>
        <div className={styles.titleBody}>
          <div className={styles.center}>
            <p className={styles.textBox}> Reason for leaving us?</p>
            <p className={styles.textTime}>
              <span style={{ color: 'black' }}> {date}</span>
            </p>
          </div>
          <Form.Item
            name="field2"
            rules={[{ required: true, message: `'Please input your reason!'` }]}
          >
            <TextArea className={styles.boxReason} />
          </Form.Item>
        </div>
        <Form.Item>
          <div className={styles.subbmitForm}>
            <div className={styles.subbmiText}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </div>
            <Button className={styles.buttonDraft} onClick={() => submitForm('draft')}>
              Save to draft
            </Button>
            <Button
              className={styles.buttonSubmit}
              htmlType="submit"
              onClick={() => submitForm('submit')}
            >
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ offboarding: { approvalflow = [] } = {} }) => ({
  approvalflow,
}))(ResigationLeft);
