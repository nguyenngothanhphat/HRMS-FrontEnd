import React, { PureComponent } from 'react';
import { Select, Form, Table, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi';

import styles from './index.less';

const DRAFT = 'DRAFT';
const SENT_PROVISIONAL_OFFER = 'SENT-PROVISIONAL-OFFER';
const ACCEPT_PROVISIONAL_OFFER = 'ACCEPT-PROVISIONAL-OFFER';
const RENEGOTIATE_PROVISIONAL_OFFER = 'RENEGOTIATE-PROVISIONAL-OFFER';
const DISCARDED_PROVISIONAL_OFFER = 'DISCARDED-PROVISIONAL-OFFER';

export default class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEditted: false,
      tableData: [
        {
          key: 'basic',
          title: 'Basic',
          value: 'Rs. 12888',
          order: 'A',
        },
        {
          key: 'hra',
          title: 'HRA',
          value: '50% of Basic',
          order: 'B',
        },
        {
          title: 'Other allowances',
          key: 'otherAllowances',
          value: 'Balance amount',
          order: 'C',
        },
        {
          key: 'totalEarning',
          title: 'Total earning (Gross)',
          order: 'D',
          value: 'A + B + C',
        },
        {
          key: 'deduction',
          title: 'Deduction',
          order: 'E',
          value: ' ',
        },
        {
          key: 'employeesPF',
          title: "Employee's PF",
          value: '12 % of Basic',
          order: 'G',
        },
        {
          key: 'employeesESI',
          title: "Employee's ESI",
          value: '0.75 of Gross',
          order: 'H',
        },
        {
          key: 'professionalTax',
          title: 'Professional Tax',
          value: 'Rs.200',
          order: 'I',
        },
        {
          key: 'tds',
          title: 'TDS',
          value: 'As per IT rules',
          order: 'J',
        },
        {
          key: 'netPayment',
          title: 'Net Payment',
          value: 'F - (G + H + I + J)',
          order: ' ',
        },
      ],
      salaryTemplate: [
        {
          id: 0,
          name: 'UX Designer',
          value: 'UX Designer',
        },
        {
          id: 1,
          name: 'Business Development',
          value: 'Business Development',
        },
      ],
      footerData: [
        {
          name: 'Employer’s PF',
          value: '12% of Basic',
        },
        {
          name: 'Employer’s ESI',
          value: '3.75% of Gross',
        },
      ],
    };
  }

  // componentDidMount = () => {
  //   const { tableData } = this.state;
  //   const newTableData = [...tableData];
  //   console.log(newTableData);
  // };

  onFinish = (values) => {
    const { tableData } = this.state;
    console.log(values, tableData);
  };

  onClickEdit = () => {
    const { isEditted } = this.state;
    this.setState({
      isEditted: !isEditted,
    });
  };

  onClickSubmit = () => {
    const { isEditted } = this.state;
    this.setState({
      isEditted: !isEditted,
    });
  };

  isBlueText = (order) => {
    const orderNonDisplay = ['D', 'E', ' '];
    return orderNonDisplay.includes(order);
  };

  isEditted = (order) => {
    const orderNonDisplay = ['A', 'B', 'G', 'H'];
    return orderNonDisplay.includes(order);
  };

  handleChange = (e) => {
    const { tableData } = this.state;
    const { target } = e;
    const { name, value } = target;

    const tempTableData = [...tableData];
    const index = tempTableData.findIndex((data) => data.key === name);

    tempTableData[index].value = value;

    this.setState({
      tableData: tempTableData,
    });
  };

  _renderTableTitle = (order) => {
    const { tableData } = this.state;
    const data = tableData.find((item) => item.order === order);
    const { title } = data;
    return (
      <span
        className={`${this.isBlueText(data.order) === true ? `blue-text` : null} ${
          data.order === ' ' ? `big-text` : null
        }`}
      >
        {title}
      </span>
    );
  };

  _renderTableValue = (order) => {
    const { tableData, isEditted } = this.state;
    const data = tableData.find((item) => item.order === order);
    const { value, key } = data;
    if (this.isEditted(order) && isEditted) {
      return (
        <Form.Item name={key} className={styles.formInput}>
          <Input onChange={(e) => this.handleChange(e)} defaultValue={value} name={key} />
        </Form.Item>
      );
    }
    return (
      <span
        className={`${this.isBlueText(data.order) === true ? `blue-text` : null} ${
          data.order === ' ' ? `big-text` : null
        }`}
      >
        {value}
      </span>
    );
  };

  _renderTableOrder = (order) => {
    if (order === 'E') {
      return ' ';
    }
    return order;
  };

  _renderColumns = () => {
    const columns = [
      {
        title: '',
        dataIndex: 'order',
        key: 'title',
        width: '40%',
        render: (order) => this._renderTableTitle(order),
      },
      {
        title: '',
        dataIndex: 'order',
        key: 'order',
        width: '10%',
        render: (order) => this._renderTableOrder(order),
      },
      {
        title: '',
        dataIndex: 'order',
        key: 'value',
        className: 'thirdColumn',
        width: '50%',
        render: (order) => this._renderTableValue(order),
      },
      // {
      //   title: 'Action',
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: () => (
      //     <a href="#">{formatMessage({ id: 'component.customEmailsTableField.viewEmail' })}</a>
      //   ),
      // },
    ];
    return columns;
  };

  _renderFooter = () => {
    const { footerData } = this.state;
    return (
      <div className={styles.salaryStructureTemplate_footer}>
        {footerData.map((data) => {
          return (
            <div className={styles.salaryStructureTemplate_footer_info}>
              <p className={styles.title}>{data.name}</p>
              <p className={styles.value}>{data.value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  _renderButtons = () => {
    const { isEditted } = this.state;
    return (
      <Form.Item>
        {' '}
        {isEditted === true ? (
          <Button type="primary" onClick={this.onClickEdit}>
            Done
          </Button>
        ) : (
          <Button htmlType="submit" type="primary" onClick={this.onClickEdit}>
            Edit
          </Button>
        )}
      </Form.Item>
    );
  };

  _renderStatus = () => {
    // const { checkMandatory } = this.props;
    // const { filledBasicInformation } = checkMandatory;
    // return !filledBasicInformation ? (
    //   <div className={styles.normalText}>
    //     <div className={styles.redText}>*</div>
    //     {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
    //   </div>
    // ) : (
    //   <div className={styles.greenText}>
    //     * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
    //   </div>
    // );
    return (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    // const { checkMandatory } = this.props;
    // const { filledBasicInformation } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              {/* <Button
                type="primary"
                htmlType="submit"
                // onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
              >
                Next
              </Button> */}
              <Button
                type="primary"
                htmlType="submit"
                // onClick={this.onClickNext}
                className={styles.bottomBar__button__primary}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { Option } = Select;
    const { salaryTemplate, tableData } = this.state;
    return (
      <div className={styles.salaryStructureTemplate}>
        <Form onFinish={this.onFinish}>
          {' '}
          <div className={styles.salaryStructureTemplate_select}>
            <Form.Item label="Select a salary structure template" name="salaryTemplate">
              <Select size="large" style={{ width: 280 }}>
                {salaryTemplate.map((template) => {
                  return (
                    <Option key={template.order} value={template.value}>
                      {template.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          {this._renderButtons()}
          <div className={styles.salaryStructureTemplate_table}>
            <Table
              dataSource={tableData}
              columns={this._renderColumns()}
              // size="large"
              pagination={false}
            />
          </div>
          {this._renderFooter()}
          {this._renderBottomBar()}
        </Form>
      </div>
    );
  }
}
