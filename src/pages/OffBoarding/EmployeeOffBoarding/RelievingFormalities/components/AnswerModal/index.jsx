import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(
  ({
    offboarding: { relievingDetails: { isSent, exitPackage: { waitList = [] } = {} } = {} } = {},
  }) => ({
    waitList,
    isSent,
  }),
)
class AnswerModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      packageName: '',
      questionList: [],
    };
  }

  componentDidMount = () => {
    const { waitList = [], selectedDocument = -1 } = this.props;
    if (waitList.length > 0) {
      const item = waitList[selectedDocument];
      const { packageName = '', settings = [] } = item;
      this.setState({
        packageName,
        questionList: settings,
      });
    }
  };

  renderFormItem = (question, index) => {
    return (
      <>
        <Row align="middle" gutter={['10', '10']}>
          <Col span={12}>
            <span>
              <span style={{ fontWeight: 'bold' }}>Question {index + 1}: </span>
              {question}
            </span>
          </Col>
          <Col span={12}>
            <Form.Item key={`${index + 1}`} name={`question${index}`}>
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  renderForm = () => {
    const { questionList } = this.state;
    return (
      <>
        <Form>
          <Form.List name="questions">
            {() => (
              <>
                {questionList.map((data, index) => {
                  const { answer = '', question = '', answerType = '' } = data;
                  return this.renderFormItem(question, index);
                })}
              </>
            )}
          </Form.List>
        </Form>
      </>
    );
  };

  render() {
    const { visible, onClose = () => {}, submitText = '' } = this.props;
    const { packageName } = this.state;

    return (
      <Modal
        className={styles.AnswerModal}
        onCancel={() => onClose()}
        destroyOnClose
        width={700}
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <p className={styles.title}>{packageName}</p>
          <div className={styles.formContainer}>{this.renderForm()}</div>
          <div className={styles.footer}>
            <Button onClick={() => onClose()}>{submitText}</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AnswerModal;
