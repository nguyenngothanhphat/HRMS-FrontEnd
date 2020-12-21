import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(
  ({
    offboarding: {
      relievingDetails: { _id = '', isSent, exitPackage: { waitList = [] } = {} } = {},
    } = {},
    loading,
  }) => ({
    _id,
    waitList,
    isSent,
    loadingSavePackage: loading.effects['offboarding/saveOffBoardingPackage'],
  }),
)
class AnswerModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      packageName: '',
      settings: [],
      templateRelieving: '',
    };
  }

  componentDidMount = () => {
    const { waitList = [], selectedDocument = -1 } = this.props;
    if (waitList.length > 0) {
      const item = waitList[selectedDocument];
      const { packageName = '', settings = [], templateRelieving = '' } = item;
      this.setState({
        packageName,
        settings,
        templateRelieving,
      });
    }
  };

  renderFormItem = (answer, question, answerType, indexOfQuestion) => {
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
                  <Checkbox.Group options={answer} />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  };

  renderForm = () => {
    const { settings } = this.state;
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
                {settings.map((data, index) => {
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
    const { questions = [] } = values;
    const { settings, templateRelieving } = this.state;
    const { dispatch, _id = '', onClose = () => {} } = this.props;

    const newSettings = [...settings];
    questions.forEach((value, index) => {
      let setting = [];
      if (typeof value === 'string' || value instanceof String) {
        const answer = [];
        answer.push(value);
        setting = { ...newSettings[index], answer };
      } else {
        setting = { ...newSettings[index], answer: value };
      }
      if (typeof value === 'undefined') {
        setting = { ...newSettings[index], answer: [] };
      }
      newSettings[index] = setting;
    });

    const payload = {
      packageType: 'EXIT-PACKAGE',
      ticketId: _id,
      settings: newSettings,
      templateId: templateRelieving,
    };

    dispatch({
      type: 'offboarding/saveOffBoardingPackage',
      payload,
    }).then((statusCode) => {
      if (statusCode === 200) {
        onClose('submit');
      }
    });
  };

  render() {
    const { visible, onClose = () => {}, submitText = '', loadingSavePackage } = this.props;
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
            <Button
              loading={loadingSavePackage}
              key="submit"
              type="primary"
              form="myForm"
              htmlType="submit"
            >
              {submitText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AnswerModal;
