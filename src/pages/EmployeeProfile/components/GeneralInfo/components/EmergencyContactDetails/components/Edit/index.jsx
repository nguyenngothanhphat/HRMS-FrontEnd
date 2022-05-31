import React, { Component } from 'react';
import { Row, Form, Input, Button, Col, Select, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import removeIcon from '../assets/removeIcon.svg';

import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      listRelation = [],
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
    listRelation,
  }),
)
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formEmergencyDetail: [{}],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchListRelation',
    });
  }

  handleAddBtn = () => {
    const { generalData, dispatch } = this.props;
    const { formEmergencyDetail } = this.state;
    const { emergencyContactDetails = [] } = generalData;
    if (emergencyContactDetails.length > 0) {
      const newEmergencyContactDetails = [...emergencyContactDetails, {}];

      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { generalData: { emergencyContactDetails: newEmergencyContactDetails } },
      });
    } else {
      const newEmergencyContactDetails = [...formEmergencyDetail, {}];

      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { generalData: { emergencyContactDetails: newEmergencyContactDetails } },
      });
    }
  };

  handleRemove = (index) => {
    const { generalData, dispatch } = this.props;
    const { emergencyContactDetails = [] } = generalData;
    const newList = [...emergencyContactDetails];
    newList.splice(index, 1);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: { emergencyContactDetails: newList } },
    });
  };

  handleChange = (changedValues) => {
    const { dispatch, generalData, generalDataOrigin } = this.props;
    const generalInfo = {
      ...generalData,
      ...changedValues,
    };
    const isModified = JSON.stringify(generalInfo) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: generalInfo },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  handleChangeField = (idName, value, index) => {
    const {
      generalData: { emergencyContactDetails = [] },
      dispatch,
    } = this.props;
    let newIdName = '';

    if (idName === `emergencyContact ${index}`) {
      newIdName = idName.slice(0, 16);
    }
    if (idName === `emergencyPersonName ${index}`) {
      newIdName = idName.slice(0, 19);
    }

    const item = emergencyContactDetails[index];
    const newItem = { ...item, [newIdName]: value };
    const newList = [...emergencyContactDetails];

    newList.splice(index, 1, newItem);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: { emergencyContactDetails: newList } },
    });
  };

  handleChangeFieldSelect = (value, index) => {
    const {
      generalData: { emergencyContactDetails = [] },
      dispatch,
    } = this.props;

    const item = emergencyContactDetails[index];
    const newItem = { ...item, emergencyRelation: value };
    const newList = [...emergencyContactDetails];

    newList.splice(index, 1, newItem);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: { emergencyContactDetails: newList } },
    });
  };

  processDataChanges = () => {
    const { generalData, generalDataOrigin } = this.props;

    const { _id } = generalDataOrigin;
    const { emergencyContactDetails: newData = [] } = generalData;

    const payloadChanges = {
      emergencyContactDetails: newData,
      id: _id,
    };

    return payloadChanges;
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = ['emergencyContact', 'emergencyPersonName', 'emergencyRelation'];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};

    const listContact = payload.emergencyContactDetails || [];
    const findContactNull = listContact.filter(
      (obj) =>
        obj.emergencyContact === undefined ||
        obj.emergencyPersonName === undefined ||
        obj.emergencyRelation === undefined,
    );
    if (findContactNull.length > 0) {
      notification.error({
        message: 'All fileds cannot empty!',
      });
      return;
    }
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openContactDetails',
    });
  };

  render() {
    const { Option } = Select;
    const { listRelation } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };

    const {
      generalData: { emergencyContactDetails = [] },
      loading,
      handleCancel = () => {},
    } = this.props;
    const { formEmergencyDetail } = this.state;
    const formEmergency =
      emergencyContactDetails.length > 0 ? emergencyContactDetails : formEmergencyDetail;
    return (
      <Row gutter={[0, 24]} className={styles.Edit}>
        <Form
          ref={this.formRef}
          className={styles.Form}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          onValuesChange={this.handleChange}
          onFinish={this.handleSave}
        >
          {formEmergency.map((item, index) => {
            const { emergencyContact, emergencyPersonName, emergencyRelation } = item;
            return (
              <div key={`${index + 1}`} className={styles.containerForm}>
                {index > 0 ? <div className={styles.line} /> : null}
                {index >= 1 ? (
                  <div className={styles.removeIcon}>
                    <img onClick={() => this.handleRemove(index)} src={removeIcon} alt="remove" />
                  </div>
                ) : null}
                <Form.Item
                  label="Emergency Contact’s Name"
                  name={`emergencyPersonName ${index}`}
                  validateTrigger="onChange"
                  rules={[
                    {
                      pattern: /^[a-zA-Z ]*$/,
                      message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                    },
                  ]}
                >
                  <Input
                    defaultValue={emergencyPersonName}
                    className={styles.inputForm}
                    placeholder="Enter the Emergency Contact’s Name"
                    onChange={(e) => this.handleChangeField(e.target.id, e.target.value, index)}
                  />
                </Form.Item>
                <Form.Item
                  label="Relation"
                  name={`emergencyRelation ${index}`}
                  rules={[
                    {
                      pattern: /^[a-zA-Z ]*$/,
                      message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                    },
                  ]}
                >
                  <Select
                    size={14}
                    placeholder="Please select a choice"
                    showArrow
                    filterOption={
                      (input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      // eslint-disable-next-line react/jsx-curly-newline
                    }
                    className={styles.inputForm}
                    defaultValue={emergencyRelation}
                    onChange={(value) => this.handleChangeFieldSelect(value, index)}
                  >
                    {listRelation.map((value, i) => {
                      return (
                        <Option key={`${i + 1}`} value={value}>
                          {value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Contact No."
                  name={`emergencyContact ${index}`}
                  rules={[
                    {
                      // pattern: /^[+]*[\d]{0,10}$/,
                      pattern:
                        // eslint-disable-next-line no-useless-escape
                        /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
                      message: formatMessage({
                        id: 'pages.employeeProfile.validateWorkNumber',
                      }),
                    },
                  ]}
                >
                  <Input
                    defaultValue={emergencyContact}
                    className={styles.inputForm}
                    placeholder="Enter the Emergency Contact’s Number"
                    onChange={(e) => this.handleChangeField(e.target.id, e.target.value, index)}
                  />
                </Form.Item>
              </div>
            );
          })}
          <Col span={24} className={styles.addMoreButton}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined className={styles.addMoreButtonIcon} />
              Add another Emergency Contact
            </div>
          </Col>

          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
              onClick={this.handleSaveContactDetail}
            >
              Save
            </Button>
          </div>
        </Form>
      </Row>
    );
  }
}

export default Edit;
