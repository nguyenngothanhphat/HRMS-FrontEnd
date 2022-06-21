import { Button, Form, Input, Modal, Select, Skeleton, Tag } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({ adminSetting: { viewingSettingTicket = {}, settingTicketList = [] } = {}, loading }) => ({
    viewingSettingTicket,
    settingTicketList,
    loadingFetchByID: loading.effects['adminSetting/fetchSettingTicketByID'],
    loadingUpsert: loading.effects['adminSetting/upsertSettingTicket'],
  }),
)
class EditModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedQueryTypes: [],
    };
  }

  componentDidUpdate = (prevProps) => {
    const { selectedSettingTicketID = '' } = this.props;

    if (selectedSettingTicketID && selectedSettingTicketID !== prevProps.selectedSettingTicketID) {
      this.fetchQueryTypeByID(selectedSettingTicketID);
    }
  };

  fetchQueryTypeByID = async (id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/fetchSettingTicketByID',
      payload: {
        _id: id,
      },
    });
    if (res.statusCode === 200) {
      this.setState({
        selectedQueryTypes: res.data.queryType,
      });
    }
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add Support Team';
    if (action === 'edit') {
      title = 'Edit Support Team';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onKeyDown = (e) => {
    const value = e.target.value.trim();
    if (e.keyCode === 13 && value) {
      this.onAddOption(value);
    }
  };

  onAddOption = (value) => {
    if (value) {
      const { selectedQueryTypes } = this.state;
      let listTypeNameTemp = JSON.parse(JSON.stringify(selectedQueryTypes));
      listTypeNameTemp.push({ name: value });
      listTypeNameTemp = [...new Set(listTypeNameTemp)];
      this.setState({
        selectedQueryTypes: listTypeNameTemp,
      });
      this.formRef.current.setFieldsValue({
        queryType: listTypeNameTemp.map((x) => x.name),
      });
    }
  };

  onRemoveOption = (queryTypeName) => {
    const { selectedQueryTypes } = this.state;
    let listTypeNameTemp = JSON.parse(JSON.stringify(selectedQueryTypes));

    listTypeNameTemp = listTypeNameTemp.filter((item) => item.name !== queryTypeName);
    this.setState({
      selectedQueryTypes: listTypeNameTemp,
    });
    this.formRef.current.setFieldsValue({
      queryType: listTypeNameTemp.map((x) => x.name),
    });
  };

  renderQueryTypeNames = () => {
    const { selectedQueryTypes } = this.state;
    if (selectedQueryTypes.length === 0) return '';

    return (
      <div className={styles.listQueryTypes}>
        {selectedQueryTypes.map((item) => {
          return (
            <Tag
              closable
              key={item.name}
              className={styles.nameTag}
              onClose={() => this.onRemoveOption(item)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {item.name}
            </Tag>
          );
        })}
      </div>
    );
  };

  onFinish = async (values) => {
    const {
      action = '',
      dispatch,
      selectedSettingTicketID = '',
      onRefresh = () => {},
      country = '',
    } = this.props;

    const { selectedQueryTypes } = this.state;

    const payload = {
      name: values.name,
      country,
      queryType: selectedQueryTypes,
    };

    if (action === 'edit') {
      payload._id = selectedSettingTicketID;
    }

    const res = await dispatch({
      type: 'adminSetting/upsertSettingTicket',
      payload,
    });
    if (res.statusCode === 200) {
      onRefresh();
      this.handleCancel();
    }
  };

  handleCancel = () => {
    const { dispatch, onClose = () => {} } = this.props;
    this.formRef.current.resetFields();
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingSettingTicket: {},
      },
    });

    this.setState({
      selectedQueryTypes: [],
    });

    onClose(false);
  };

  render() {
    const {
      visible = false,
      action = '',
      loadingFetchByID = false,
      loadingUpsert = false,
      viewingSettingTicket = {},
    } = this.props;

    const { selectedQueryTypes } = this.state;
    const { queryType: queryTypeProp = [], name: nameProp = '' } = viewingSettingTicket || {};

    return (
      <>
        <Modal
          className={styles.EditModal}
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
              loading={loadingUpsert}
              disabled={loadingUpsert || loadingFetchByID}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          {loadingFetchByID ? (
            <Skeleton />
          ) : (
            <Form
              name="basic"
              ref={this.formRef}
              id="myForm"
              onFinish={this.onFinish}
              initialValues={
                action === 'edit'
                  ? {
                      name: nameProp,
                      queryType: queryTypeProp.map((x) => x.name),
                    }
                  : {}
              }
            >
              <Form.Item
                rules={[{ required: true, message: 'Required field!' }]}
                label="Support Team"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter the support team name" disabled={loadingUpsert} />
              </Form.Item>

              <Form.Item
                label="Query Type"
                name="queryType"
                labelCol={{ span: 24 }}
                rules={[{ required: selectedQueryTypes.length === 0, message: 'Required field!' }]}
                className={styles.formItem}
              >
                <Select
                  allowClear
                  mode="tags"
                  className={styles.InputQueryTypes}
                  placeholder="Enter new query type"
                  onKeyDown={(e) => this.onKeyDown(e)}
                  dropdownClassName={styles.selectDropdown}
                  onClear={() => this.setState({ selectedQueryTypes: [] })}
                  onDeselect={(value) => this.onRemoveOption(value)}
                  onSelect={(value) => this.onAddOption(value)}
                >
                  {selectedQueryTypes.map((type) => {
                    return (
                      <Option
                        className={styles.optionSelect}
                        value={type.name}
                        key={type.name}
                        disabled={loadingUpsert}
                      >
                        {type.name}
                      </Option>
                    );
                  })}
                </Select>
                {/* {this.renderQueryTypeNames()} */}
              </Form.Item>
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
