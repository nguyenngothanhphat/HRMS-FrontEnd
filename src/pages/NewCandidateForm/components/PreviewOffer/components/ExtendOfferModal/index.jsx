import { Button, Modal, Form, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(() => ({}))
class ExtendOfferModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
    };
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  disabledDate = (current) => {
    return current && current < moment();
  };

  renderModalContent = () => {
    const { currentExpiryDate = null } = this.props;
    return (
      <div className={styles.queryContent}>
        <span className={styles.titleText}>
          Please input the date that you would like to extend the offer to.
        </span>
        <Form
          name="basic"
          // ref={this.formRef}
          id="myForm"
          onFinish={this.onFinish}
        >
          <Row>
            <Col span={16}>
              <Form.Item label="Extend offer letter date" name="expiryDate" labelCol={{ span: 24 }}>
                <DatePicker
                  disabledDate={this.disabledDate}
                  placeholder="Select a date"
                  format="DD.MM.YY"
                  onChange={(val) =>
                    this.setState({
                      selectedDate: val,
                    })}
                  defaultValue={currentExpiryDate ? moment(currentExpiryDate) : null}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // on finish
  onFinish = () => {
    const { onFinish = () => {} } = this.props;
    const { selectedDate } = this.state;
    onFinish(selectedDate);
  };

  render() {
    const { visible = false, loading } = this.props;
    const { selectedDate } = this.state;

    return (
      <>
        <Modal
          className={styles.ExtendOfferModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              onClick={this.onFinish}
              disabled={!selectedDate}
              loading={loading}
            >
              Extend
            </Button>,
          ]}
          title={this.renderModalHeader()}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default ExtendOfferModal;
