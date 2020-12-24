import React, { Component } from 'react';
import { Row, Form, Input, Button, Col, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
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
      emergencyContactDetails: [],
    };
  }

  componentDidMount() {
    const { generalData, dispatch } = this.props;

    dispatch({
      type: 'employeeProfile/fetchListRelation',
      payload: {},
    });

    const {
      emergencyContact: eContact = '',
      emergencyPersonName: ePersonName = '',
      emergencyRelation: eRelation = '',
    } = generalData;

    const newEmergencyContact = {
      emergencyContact: eContact,
      emergencyPersonName: ePersonName,
      emergencyRelation: eRelation,
    };

    const arrData = [];
    arrData.push(newEmergencyContact);
    this.setState({ emergencyContactDetails: arrData });
  }

  handleAddBtn = () => {
    const { emergencyContactDetails } = this.state;
    const newDataArr = [...emergencyContactDetails];

    const newGeneralDataTemp = {
      emergencyContact: '',
      emergencyPersonName: '',
      emergencyRelation: '',
    };

    newDataArr.push(newGeneralDataTemp);
    this.setState({ emergencyContactDetails: newDataArr });
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
    const { emergencyContactDetails } = this.state;
    const newData = [...emergencyContactDetails];

    if (idName === `emergencyContact ${index}`) {
      newData[index].emergencyContact = value;
    }
    if (idName === `emergencyPersonName ${index}`) {
      newData[index].emergencyPersonName = value;
    }

    this.setState({ emergencyContactDetails: newData });
  };

  handleChangeFieldSelect = (value, index) => {
    const { emergencyContactDetails } = this.state;
    const newData = [...emergencyContactDetails];
    newData[index].emergencyRelation = value;

    this.setState({ emergencyContactDetails: newData });
  };

  processDataChanges = () => {
    const { generalData } = this.props;
    const { emergencyContactDetails: newData } = this.state;

    const { _id } = generalData;

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

    console.log('payload: ', payload);
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
        sm: { span: 9 },
      },
    };

    const { generalData, loading, handleCancel = () => {} } = this.props;
    const { emergencyContactDetails } = this.state;
    const newEmergencyContactDetails = [...emergencyContactDetails];

    const { emergencyContact = '', emergencyPersonName = '', emergencyRelation = '' } = generalData;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          ref={this.formRef}
          className={styles.Form}
          {...formItemLayout}
          onValuesChange={this.handleChange}
          onFinish={this.handleSave}
        >
          {emergencyContactDetails ? (
            <>
              {newEmergencyContactDetails.map((item, index) => {
                const { emergencyContact, emergencyPersonName, emergencyRelation } = item;
                return (
                  <div key={index}>
                    {index > 0 ? <div className={styles.line} /> : null}
                    <Form.Item
                      label="Emergency Contact"
                      name={`emergencyContact ${index}`}
                      rules={[
                        {
                          pattern: /^[+]*[\d]{0,10}$/,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateWorkNumber',
                          }),
                        },
                      ]}
                    >
                      <Input
                        defaultValue={emergencyContact}
                        className={styles.inputForm}
                        onChange={(e) => this.handleChangeField(e.target.id, e.target.value, index)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Person’s Name"
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
                        size="large"
                        placeholder="Please select a choice"
                        showArrow
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        className={styles.inputForm}
                        defaultValue={emergencyRelation}
                        onChange={(value) => this.handleChangeFieldSelect(value, index)}
                      >
                        {listRelation.map((item, index) => {
                          return (
                            <Option key={index} value={item}>
                              {item}
                            </Option>
                          );
                        })}
                      </Select>
                      {/* <Input
                        defaultValue={emergencyRelation}
                        className={styles.inputForm}
                        onChange={(e) => this.handleChangeField(e.target.id, e.target.value, index)}
                      /> */}
                    </Form.Item>
                  </div>
                );
              })}
            </>
          ) : null}
          <Col span={9} offset={1} className={styles.addMoreButton}>
            <div onClick={this.handleAddBtn}>
              <PlusOutlined className={styles.addMoreButtonIcon} />
              Add more
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
