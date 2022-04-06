import { Button, DatePicker, Form, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    user: { currentUser = {}, companiesOfUser = [] },
    onboard: { hrList = [], filterList = {} } = {},
  }) => ({
    loadingHandleExpiryTicket: loading.effects['onboard/handleExpiryTicket'],
    currentUser,
    companyLocationList,
    companiesOfUser,
    filterList,
    hrList,
  }),
)
class RenewModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedDate: '' };
  }

  componentDidMount = async () => {};

  renderHeaderModal = () => {
    const { titleModal = 'Renew offer' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const {
      handleRenewModal = () => {},
      ticketId = '',
      dispatch,
      processStatus = '',
      type = '',
      page = '',
      limit = '',
    } = this.props;
    const { expiryDate = '' } = values;
    if (expiryDate) {
      const res = await dispatch({
        type: 'onboarding/handleExpiryTicket',
        payload: {
          id: ticketId,
          tenantId: getCurrentTenant(),
          expiryDate,
          type: 1, // renew
          isAll: type === 'ALL',
          processStatus,
          page,
          limit,
        },
      });
      if (res?.statusCode === 200) {
        handleRenewModal(false);
      }
    }
  };

  disabledDate = (current) => {
    return current && current < moment();
  };

  render() {
    const { visible = false, handleRenewModal = () => {}, loadingHandleExpiryTicket } = this.props;

    const { selectedDate } = this.state;

    return (
      <>
        <Modal
          className={styles.RenewModal}
          onCancel={() => handleRenewModal(false, '', '')}
          destroyOnClose
          footer={[
            <Button onClick={() => handleRenewModal(false, '', '')} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={!selectedDate}
              loading={loadingHandleExpiryTicket}
            >
              Submit
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
          >
            <Form.Item label="Select new expiry date" name="expiryDate" labelCol={{ span: 24 }}>
              <DatePicker
                disabledDate={this.disabledDate}
                placeholder="Select a date"
                format="DD.MM.YY"
                disabled={loadingHandleExpiryTicket}
                onChange={(val) =>
                  this.setState({
                    selectedDate: val,
                  })}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default RenewModal;
