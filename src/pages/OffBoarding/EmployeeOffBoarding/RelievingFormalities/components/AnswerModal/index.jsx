import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, Row, Col, Radio } from 'antd';
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
  formRef = React.createRef();

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

  renderFormItem = (answer, question, answerType, indexOfQuestion) => {
    const radioStyle = {
      display: 'block',
      // height: '30px',
      lineHeight: '30px',
    };

    return (
      <>
        <Row key={`${indexOfQuestion + 1}`} align="top" gutter={['10', '10']}>
          <Col span={12}>
            <span>
              <span style={{ fontWeight: 'bold' }}>Question {indexOfQuestion + 1}: </span>
              {question}
            </span>
          </Col>
          <Col span={12}>
            {answerType === 'FIELD' && (
              <>
                <Form.Item name={[indexOfQuestion]} fieldKey={[indexOfQuestion]}>
                  <TextArea />
                </Form.Item>
              </>
            )}

            {answerType === 'BULLET' && (
              <>
                <Form.Item name={[indexOfQuestion]} fieldKey={[indexOfQuestion]}>
                  <Radio.Group>
                    {answer.map((value, index) => (
                      <Radio style={radioStyle} key={`${index + 1}`} value={value}>
                        {value}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  };

  renderForm = () => {
    const { questionList } = this.state;
    return (
      <>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.List name="questions">
            {() => (
              <>
                {questionList.map((data, index) => {
                  const { answer = '', question = '', answerType = '' } = data;
                  return this.renderFormItem(answer, question, answerType, index);
                })}
              </>
            )}
          </Form.List>
        </Form>
      </>
    );
  };

  onFinish = (values) => {
    console.log('values', values);
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
            <Button key="submit" type="primary" form="myForm" htmlType="submit">
              {submitText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AnswerModal;
