import React, { Component } from 'react';
import { Row, Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      employee = '',
      originData: { taxData: taxDataOrigin = {} } = {},
      tempData: { taxData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/fetchTax'],
    employee,
    taxDataOrigin,
    taxData,
  }),
)
class EditTax extends Component {
  handleChange = (changedValues) => {
    const { dispatch, taxData, taxDataOrigin } = this.props;
    const taxValues = {
      ...taxData[0],
      ...changedValues,
    };
    const newList = [...taxData];
    newList.splice(0, 1, taxValues);
    const isModified = JSON.stringify(taxValues) !== JSON.stringify(taxDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { taxData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChangesHaveId = () => {
    const { taxData: taxDataTemp } = this.props;
    const { incomeTaxRule = '', panNum = '', _id: id = '' } = taxDataTemp[0];
    const payloadChanges = {
      id,
      incomeTaxRule,
      panNum,
    };
    return payloadChanges;
  };

  processDataChangesNoId = () => {
    const { taxData: taxDataTemp, employee } = this.props;
    const { incomeTaxRule = '', panNum = '' } = taxDataTemp[0];
    const payloadChanges = {
      employee,
      incomeTaxRule,
      panNum,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { taxData } = this.props;
    const newObj = { ...taxData[0] };
    const listKey = ['incomeTaxRule', 'panNum'];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch, taxData } = this.props;
    const dataTempKept = this.processDataKept() || {};
    const idTax = taxData[0] ? taxData[0]._id : '';
    if (idTax) {
      const payload = this.processDataChangesHaveId() || {};
      dispatch({
        type: 'employeeProfile/updateTax',
        payload,
        dataTempKept,
        key: 'openTax',
      });
    } else {
      const payload = this.processDataChangesNoId() || {};
      dispatch({
        type: 'employeeProfile/addTax',
        payload,
        dataTempKept,
        key: 'openTax',
      });
    }
  };

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

    const { taxData, loading, handleCancel = () => {} } = this.props;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          ref={this.formRef}
          className={styles.Form}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          initialValues={{
            incomeTaxRule: taxData[0] ? taxData[0].incomeTaxRule : '',
            panNum: taxData[0] ? taxData[0].panNum : '',
          }}
          onValuesChange={this.handleChange}
          onFinish={this.handleSave}
        >
          <Form.Item
            label="Income Tax Rule"
            name="incomeTaxRule"
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
            label="PAN Number"
            name="panNum"
            validateTrigger="onChange"
            rules={[
              {
                pattern: /^[A-Z0-9]{0,12}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>

          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={() => handleCancel('tax')}>
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
        </Form>
      </Row>
    );
  }
}

export default EditTax;
