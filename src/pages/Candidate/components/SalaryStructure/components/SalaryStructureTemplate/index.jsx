import React, { PureComponent } from 'react';
import { Select, Form, Table, Button, Input, Row, Col } from 'antd';
import { formatMessage, connect } from 'umi';
import doneIcon from './assets/doneIcon.png';
import editIcon from './assets/editIcon.png';
import styles from './index.less';

@connect(
  ({
    candidateInfo: {
      listTitle = [],
      checkMandatory = {},
      currentStep = {},
      data: { processStatus = '' } = {},
      tableData = [],
    },
    user: { currentUser: { company: { _id = '' } = {} } = {} },
  }) => ({
    listTitle,
    checkMandatory,
    currentStep,
    processStatus,
    _id,
    tableData,
  }),
)
class SalaryStructureTemplate extends PureComponent {
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

  componentDidMount = () => {
    const { dispatch, _id } = this.props;
    // const { tableData } = this.state;
    // const newTableData = [...tableData];
    dispatch({
      type: 'candidateInfo/fetchTitleListByCompany',
      payload: { company: _id },
    });
  };

  onClickPrev = () => {
    const { dispatch, currentStep } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  onClickNext = () => {
    const { dispatch, currentStep } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
      },
    });
  };

  onFinish = (values) => {
    console.log.log('hi', values);
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

  _renderTableTitle = (order) => {
    const { tableData } = this.props;
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
    const { isEditted } = this.state;
    const { tableData } = this.props;
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

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledSalaryStructure } = checkMandatory;
    return !filledSalaryStructure ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
    // return (
    //   <div className={styles.normalText}>
    //     <div className={styles.redText}>*</div>
    //     {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
    //   </div>
    // );
  };

  _renderBottomBar = () => {
    const { checkMandatory, processStatus } = this.props;
    const { filledSalaryStructure } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>
              {processStatus === 'DRAFT' ? this._renderStatus() : null}
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              {/* <Button
                type="primary"
            salaryTemplate    htmlType="submit"
                // onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
              >
                Next
              </Button> */}
              <Button
                type="secondary"
                onClick={this.onClickPrev}
                className={styles.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledSalaryStructure ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledSalaryStructure}
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
    const { tableData } = this.props;
    // const defaultValue = listTitle.length > 0 ? listTitle[0].name : [];
    return (
      <div className={styles.salaryStructureTemplate}>
        <Form onFinish={this.onFinish}>
          <div className={styles.salaryStructureTemplate_table}>
            <Table
              dataSource={tableData}
              columns={this._renderColumns()}
              // size="large"
              pagination={false}
            />
          </div>
          {this._renderFooter()}
          {/* {this._renderBottomBar()} */}
        </Form>
      </div>
    );
  }
}

export default SalaryStructureTemplate;
