import { Button, Checkbox, Form, Modal, Select, Skeleton, Tag } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import { SUPPORT_TEAM } from '@/utils/adminSetting';
import CloseTagIcon from '@/assets/closeTagIcon.svg';

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
      queryTypeList: [],
    };
  }

  componentDidUpdate = (prevProps) => {
    const { selectedSettingTicketID = '' } = this.props;

    if (selectedSettingTicketID && selectedSettingTicketID !== prevProps.selectedSettingTicketID) {
      this.fetchQueryTypeByID(selectedSettingTicketID);
    }
  };

  onChangeSupportTeam = (val) => {
    const find = SUPPORT_TEAM.find((x) => val === x.value);
    this.setState({
      queryTypeList: find?.queryTypes || [],
      selectedQueryTypes: [],
    });
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
      const find = SUPPORT_TEAM.find((x) => res.data.name === x.value);
      this.setState({
        queryTypeList: find?.queryTypes || [],
        selectedQueryTypes: res.data.queryType || [],
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

  onAddOption = (queryTypeName) => {
    const { selectedQueryTypes } = this.state;
    const listTypeNameTemp = JSON.parse(JSON.stringify(selectedQueryTypes));

    listTypeNameTemp.push(queryTypeName);

    this.setState({
      selectedQueryTypes: listTypeNameTemp,
    });
  };

  onRemoveOption = (queryTypeName) => {
    const { selectedQueryTypes } = this.state;
    let listTypeNameTemp = JSON.parse(JSON.stringify(selectedQueryTypes));

    listTypeNameTemp = listTypeNameTemp.filter((item) => item !== queryTypeName);
    this.setState({
      selectedQueryTypes: listTypeNameTemp,
    });
  };

  onCheckbox = (e, roles) => {
    const { checked, value } = e.target || {};

    if (checked) {
      this.onAddOption(value, roles);
    } else {
      this.onRemoveOption(value);
    }
  };

  renderQueryTypes = (queryTypes) => {
    const { selectedQueryTypes = [] } = this.state;
    const { loading } = this.props;

    const checkedStatus = (queryTypeName) => {
      let check = false;
      selectedQueryTypes.forEach((itemId) => {
        if (itemId === queryTypeName) {
          check = true;
        }
      });

      return check;
    };

    return queryTypes.map((type, index) => {
      const className = index % 2 === 0 ? styles.evenClass : styles.oddClass;
      return (
        <Option
          className={`${styles.optionSelect} ${className}`}
          value={type}
          key={`${index + 1}`}
          disabled={loading}
        >
          <Checkbox
            value={type}
            onChange={(e) => this.onCheckbox(e, queryTypes)}
            checked={checkedStatus(type)}
          >
            <div>{type}</div>
          </Checkbox>
        </Option>
      );
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
              key={item}
              className={styles.nameTag}
              onClose={() => this.onRemoveOption(item)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {item}
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
      queryTypeList: [],
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
      settingTicketList = [],
    } = this.props;
    const { queryTypeList } = this.state;
    const queryTypeClassName = `${styles.InputQueryTypes} ${styles.placeholderQueryType}`;

    const supportTeamList =
      action === 'edit'
        ? SUPPORT_TEAM.filter(
            (x) =>
              !settingTicketList.some((y) => y.name === x.name) ||
              x.name === viewingSettingTicket.name,
          )
        : SUPPORT_TEAM.filter((x) => !settingTicketList.some((y) => y.name === x.name));

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
                      name: viewingSettingTicket?.name,
                    }
                  : {}
              }
            >
              <Form.Item
                rules={[{ required: true, message: 'Please select the support team!' }]}
                label="Support Team"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Select
                  showSearch
                  placeholder="Select the support team"
                  onChange={this.onChangeSupportTeam}
                >
                  {supportTeamList.map((d) => {
                    return <Option value={d.value}>{d.name}</Option>;
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label="Query Type"
                name="queryType"
                labelCol={{ span: 24 }}
                // rules={[{ required: true, message: 'Please select a role' }]}
                className={styles.formItem}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  className={queryTypeClassName}
                  onSelect={(value) => {
                    this.onAddOption(value, queryTypeList);
                  }}
                  onDeselect={(value) => {
                    this.onRemoveOption(value, queryTypeList);
                  }}
                >
                  {this.renderQueryTypes(queryTypeList)}
                </Select>
                {this.renderQueryTypeNames()}
              </Form.Item>
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
