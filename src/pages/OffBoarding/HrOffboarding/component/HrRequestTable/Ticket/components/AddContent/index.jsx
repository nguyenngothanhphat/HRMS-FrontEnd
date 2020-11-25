import React, { PureComponent } from 'react';
import { Row, Col, Input, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;

class AddContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      content: e.target.value,
    });
  };

  render() {
    const { content } = this.state;
    const { addcontent = () => {} } = this.props;
    return (
      <div className={styles.reasonPutOnHold}>
        <Row gutter={[0, 20]} justify="space-between">
          <Col className={styles.reasonPutOnHold__title}>Add content from 1-on-1</Col>
          <Col>
            <Row>
              <div className={styles.reasonPutOnHold__dateTime}>
                <span>
                  <span className={styles.subText}>Lasted updated by</span> |{' '}
                  {moment().format('DD.MM.YY | h:mm A')}
                </span>
              </div>
            </Row>
          </Col>
        </Row>
        <div className={styles.reasonPutOnHold__textArea}>
          <TextArea allowClear onChange={this.handleChange} />
          <Button
            className={styles.btn__submit}
            disabled={!content}
            onClick={() => addcontent(content)}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default AddContent;
