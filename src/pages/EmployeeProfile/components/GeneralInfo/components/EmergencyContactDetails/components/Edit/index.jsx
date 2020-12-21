/* eslint-disable no-console */
import React, { Component } from 'react';
import { Row, Form, Input, Button, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
  }),
)
class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: []
    };
    // this.handleFieldChange = debounce(this.handleFieldChange, 600);
  }

  componentDidMount (){
    const { generalData } = this.props;
    const {
      emergencyContact = '',
      emergencyPersonName = '',
      emergencyRelation = '',
      // _id = '',
    } = generalData;
    const generalDataTemp = {
      id: 0,
      _emergencyContact: emergencyContact,
      _emergencyPersonName: emergencyPersonName,
      _emergencyRelation: emergencyRelation,
    };
    const arrData = [];
    arrData.push(generalDataTemp);
    this.setState({dataArr: arrData});    
  }

  handleAddBtn = () => {
    const {dataArr} = this.state;
    const newDataArr = [...dataArr];

    const newGeneralDataTemp = {
      id: newDataArr.length,
      _emergencyContact: '',
      _emergencyPersonName: '',
      _emergencyRelation: '',
    };

    newDataArr.push(newGeneralDataTemp);
    this.setState({dataArr: newDataArr});
  }

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

  processDataChanges = () => {
    const { generalData: generalDataTemp } = this.props;
    const {
      emergencyContact = '',
      emergencyPersonName = '',
      emergencyRelation = '',
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      id,
      emergencyContact,
      emergencyPersonName,
      emergencyRelation,
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
    // const { dispatch } = this.props;
    // const payload = this.processDataChanges() || {};
    // const dataTempKept = this.processDataKept() || {};

    // dispatch({
    //   type: 'employeeProfile/updateGeneralInfo',
    //   payload,
    //   dataTempKept,
    //   key: 'openContactDetails',
    // });

    const {dataArr} = this.state;
    console.log('SAVE: ', dataArr)
  };

  handleSaveContactDetail = () => {
    const {dataArr} = this.state;
    console.log('dataArr: ', dataArr);
  }

  handleChangeField = (idName, value, index) => {
    const {dataArr} = this.state;
    const newData = [...dataArr];

    // let contact = '';
    // let personName = '';
    // let relation = '';

    // const newObj = {
    //   id: index,
    //   _emergencyContact: contact,
    //   _emergencyPersonName: personName,
    //   _emergencyRelation: relation,
    // }

    if(idName==='_emergencyContact'){
      newData[index][idName] = value;
    }
    if (idName==='_emergencyPersonName') {
      newData[index][idName] = value;
    }
    if (idName==='_emergencyRelation'){
      newData[index][idName] = value;
    }

    this.setState({dataArr: newData})

    // console.log('newData: ', newData)
  }

  render() {
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

    const { loading, handleCancel = () => {} } = this.props;
    const {dataArr} = this.state;
    const data = [...dataArr];
    // const { emergencyContact = '', emergencyPersonName = '', emergencyRelation = '' } = generalData;
    console.log('dataArr: ', dataArr);
    
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {
          dataArr ? (
            <>
              {
                data.map((item) => {
            const { _emergencyContact, _emergencyPersonName, _emergencyRelation, id} = item;
            return (
              <Form
                key={id}
                ref={this.formRef}
                className={styles.Form}
                {...formItemLayout}
                initialValues={{ _emergencyContact, _emergencyPersonName, _emergencyRelation }}
                onValuesChange={this.handleChange}
                onFinish={this.handleSave}
              >
                <Form.Item
                  label="Emergency Contact"
                  name="_emergencyContact"
                  rules={[
              {
                pattern: /^[+]*[\d]{0,10}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
                >
                  <Input className={styles.inputForm} onChange={(e) => this.handleChangeField(e.target.id, e.target.value, id)} />
                </Form.Item>
                <Form.Item
                  label="Person’s Name"
                  name="_emergencyPersonName"
                  validateTrigger="onChange"
                  rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
                >
                  <Input className={styles.inputForm} onChange={(e) => this.handleChangeField(e.target.id, e.target.value, id)} />
                </Form.Item>
                <Form.Item
                  label="Relation"
                  name="_emergencyRelation"
                  rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
                >
                  <Input className={styles.inputForm} onChange={(e) => this.handleChangeField(e.target.id, e.target.value, id)} />
                </Form.Item>
                <Col span={9} offset={1} className={styles.addMoreButton}>
                  <div onClick={this.handleAddBtn}>
                    <PlusOutlined className={styles.addMoreButtonIcon} />
                    Add more
                  </div>
                </Col>
                <div className={styles.spaceFooter} />
              </Form>
            )
          })
              }
            </>
          ) : null
        }
        <Col>
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
        </Col>
        {/* <Form
          ref={this.formRef}
          className={styles.Form}
          {...formItemLayout}
          initialValues={{ emergencyContact, emergencyPersonName, emergencyRelation }}
          onValuesChange={this.handleChange}
          onFinish={this.handleSave}
        >
          <Form.Item
            label="Emergency Contact"
            name="emergencyContact"
            rules={[
              {
                pattern: /^[+]*[\d]{0,10}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Person’s Name"
            name="emergencyPersonName"
            validateTrigger="onChange"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Relation"
            name="emergencyRelation"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
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
            >
              Save
            </Button>
          </div>
        </Form> */}
      </Row>
    );
  }
}

export default Edit;
