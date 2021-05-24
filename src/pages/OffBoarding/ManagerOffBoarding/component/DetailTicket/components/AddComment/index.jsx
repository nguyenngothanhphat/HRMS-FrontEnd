import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ loading, offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
  loading: loading.effects['offboarding/complete1On1'],
}))
class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      canBeRehired: false,
    };
  }

  handleSubmitComments = () => {
    const { dispatch, idComment: id = '' } = this.props;
    const { q: content = '', canBeRehired } = this.state;
    const payload = { id, content, canBeRehired };
    dispatch({
      type: 'offboarding/complete1On1',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({}, () => {
          this.getList1On1();
        });
      }
    });
  };

  getList1On1 = () => {
    const { dispatch, myRequest: { _id: code } = {} } = this.props;
    dispatch({
      type: 'offboarding/getList1On1',
      payload: {
        offBoardingRequest: code,
      },
    });
  };

  handleChange = (e) => {
    this.setState({
      q: e.target.value,
    });
  };

  handleCanBeRehired = (e) => {
    const { target: { checked = false } = {} } = e;
    this.setState({
      canBeRehired: checked,
    });
  };

  render() {
    const { loading, nameOwner = '', isHRManager = false } = this.props;
    const { q } = this.state;
    const date = moment().format('DD.MM.YY | h:mm A');

    return (
      <>
        <div className={styles.closingComments}>
          <div className={styles.header}>
            <span className={styles.title}>{nameOwner} comments from 1-on-1</span>
            <span className={styles.time}>{date}</span>
          </div>

          <div className={styles.content}>
            <div className={styles.textArea}>
              <TextArea className={styles.box} allowClear value={q} onChange={this.handleChange} />
              {!isHRManager && (
                <div className={styles.canBeRehired}>
                  <Checkbox onChange={this.handleCanBeRehired}>Can be rehired</Checkbox>{' '}
                  <span>(This will remain private to yourself and the HR)</span>
                </div>
              )}
            </div>

            <div className={styles.buttonArea}>
              <Button onClick={this.handleSubmitComments} disabled={!q} loading={loading}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AddComment;
