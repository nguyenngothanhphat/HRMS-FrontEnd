import React, { PureComponent } from 'react';
import { Form, Table, Button, Input, Row, Col, InputNumber } from 'antd';
import { formatMessage, connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import TextArea from 'antd/lib/input/TextArea';
import styles from './index.less';

@connect(
  ({
    candidateProfile: {
      listTitle = [],
      checkMandatory = {},
      localStep,
      data: { processStatus = '' } = {},
      tempData: { options = 1 },
      tempData,
      salaryStructure = [],
    },
    user: { currentUser: { company: { _id = '' } = {} } = {} },
  }) => ({
    listTitle,
    checkMandatory,
    localStep,
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

  onClickPrev = () => {
    const { dispatch, localStep } = this.props;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  onClickNext = () => {
    const { dispatch, options, tempData, localStep } = this.props;

    dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        options,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        options: tempData.options,
      },
    });
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
      },
    });
  };

  onFinish = (values) => {};

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
        // style={{ paddingLeft: '30px' }}
      >
        {title}
      </span>
    );
  };

  _renderTableValue = (order) => {
    const { isEditted } = this.state;
    const { salaryStructure = [] } = this.props;
    const data = salaryStructure?.find((item) => item.order === order) || {};
    const { value = '', key, edit = false, number = {} } = data;
    const isNumber = Object.keys(number).length > 0;

    // return null;

    if (edit && isEditted) {
      if (isNumber) {
        const { current = '', max = '' } = number;
        return (
          <Form.Item name={key} className={styles.formNumber}>
            <InputNumber
              // onChange={(val) => this.handleNumberChange(key, val, value)}
              defaultValue={current}
              max={parseFloat(max)}
              name={key}
            />
            <span>{value}</span>
          </Form.Item>
        );
      }
      return (
        <Form.Item name={key} className={styles.formInput}>
          <Input
            //  onChange={(e) => this.handleChange(e)}
            defaultValue={value}
            name={key}
          />
        </Form.Item>
      );
    }

    if (isNumber) {
      const { current = '' } = number;
      return (
        <span
          className={`${this.isBlueText(data.order) === true ? `blue-text` : null} ${
            data.order === ' ' ? `big-text` : null
          }`}
        >
          {`${current} ${value}`}
        </span>
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
      //     <a href="#">{formatMessage({ id: 'component.customEmailsTableField.editEmail' })}</a>
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
    const { processStatus } = this.props;

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
    const { salaryStructure = [], options } = this.props;

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
          {options === 1 ? this._renderBottomBar() : null}
        </Form>
      </div>
    );
  }
}

export default SalaryStructureTemplate;
