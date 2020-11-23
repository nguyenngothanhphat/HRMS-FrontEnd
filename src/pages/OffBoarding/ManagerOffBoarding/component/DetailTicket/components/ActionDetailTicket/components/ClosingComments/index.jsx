import React, { Component } from 'react';
import { Button, Row, Col, Space, Input } from 'antd';
import editIcon from '@/assets/edit-off-boarding.svg';
import thumbsUpIcon from '@/assets/thumbs-up.svg';
import moment from 'moment';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ loading, offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
  loading: loading.effects['offboarding/complete1On1'],
}))
class ClosingComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSumbit: false,
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
        this.setState(
          {
            isSumbit: true,
          },
          () => {
            this.getList1On1();
          },
        );
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
    const { myRequest = {}, loading } = this.props;
    const { isSumbit, q } = this.state;
    const { employee: { generalInfo: { firstName: nameEmployee = '' } = {} } = {} } = myRequest;
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
                {isSumbit && (
                  <div
                    className={styles.closingComments__edit}
                    onClick={() => this.setState({ isSumbit: false })}
                  >
                    <img src={editIcon} alt="edit-icon" />
                    <span>Edit</span>
                  </div>
                )}
                <div className={styles.closingComments__dateTime}>{date}</div>
              </Row>
            </Col>
          </Row>

          {isSumbit ? (
            <div className={styles.closingComments__content}>
              <div className={styles.closingComments__content__text}>{q}</div>
              <div className={styles.closingComments__content__note}>
                <Space>
                  <img src={thumbsUpIcon} alt="thumbs-up-icon" />
                  <span>
                    Your comment for the 1-on-1 with {nameEmployee} has been recorded.{' '}
                    {nameEmployee} and the HR manager will be able to view this comment.
                  </span>
                </Space>
              </div>
            </div>
          ) : (
            <div className={styles.closingComments__textArea}>
              <TextArea
                allowClear
                placeholder="The reason I have decided to end my journey with Lollypop here is because…"
                value={q}
                onChange={this.handleChange}
              />
              <Button
                className={styles.btn__submit}
                onClick={this.handleSubmitComments}
                disabled={!q}
                loading={loading}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ClosingComments;
