import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
import moment from 'moment';
import { formatMessage, connect } from 'umi';
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
    };
  }

  handleSubmitComments = () => {
    const { dispatch, idComment: id = '' } = this.props;
    const { q: content = '' } = this.state;
    const payload = { id, content };
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

  render() {
    const { loading } = this.props;
    const { q } = this.state;
    const date = moment().format('DD.MM.YY | h:mm A');

    return (
      <>
        <div className={styles.closingComments}>
          <Row gutter={[0, 20]} justify="space-between">
            <Col className={styles.closingComments__title}>
              {formatMessage({ id: 'pages.offBoarding.closingComments' })}
            </Col>
            <Col>
              <Row>
                <div className={styles.closingComments__dateTime}>{date}</div>
              </Row>
            </Col>
          </Row>
          <div className={styles.closingComments__textArea}>
            <TextArea allowClear value={q} onChange={this.handleChange} />
            <Button
              className={styles.btn__submit}
              onClick={this.handleSubmitComments}
              disabled={!q}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default AddComment;
