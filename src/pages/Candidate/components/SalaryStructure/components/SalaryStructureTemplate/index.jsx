import React, { PureComponent } from 'react';
import { Form, Table, Button, Input, Row, Col } from 'antd';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    candidateProfile: {
      listTitle = [],
      checkMandatory = {},
      currentStep = {},
      data: { processStatus = '' } = {},
      tempData: { options = 1 },
      tempData,
      salaryStructure = [],
    },
    user: { currentUser: { company: { _id = '' } = {} } = {} },
  }) => ({
    listTitle,
    checkMandatory,
    currentStep,
    processStatus,
    _id,
    salaryStructure,
    options,
    tempData,
  }),
)
class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEditted: false,
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
    // const { salaryStructure } = this.state;
    // const newsalaryStructure = [...salaryStructure];
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
    const { dispatch, options, tempData } = this.props;
    console.log(options);
    // dispatch({
    //   type: 'candidateInfo/save',
    //   payload: {
    //     currentStep: currentStep + 1,
    //   },
    // });
    dispatch({
      type: 'candidateProfile/updateByCandidateModel',
      payload: {
        options,
      },
    });
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        options: tempData.options,
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
    const { salaryStructure } = this.props;
    const data = salaryStructure.find((item) => item.order === order);
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
    const { salaryStructure } = this.props;
    const data = salaryStructure.find((item) => item.order === order);
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
                // htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} `}
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
    const { salaryStructure } = this.props;
    // const defaultValue = listTitle.length > 0 ? listTitle[0].name : [];
    return (
      <div className={styles.salaryStructureTemplate}>
        <Form onFinish={this.onFinish}>
          <div className={styles.salaryStructureTemplate_table}>
            <Table
              dataSource={salaryStructure}
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

export default SalaryStructureTemplate;
