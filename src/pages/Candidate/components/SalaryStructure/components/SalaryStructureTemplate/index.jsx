import React, { PureComponent } from 'react';
import { Form, Table, Button, Input, Row, Col, InputNumber } from 'antd';
import { formatMessage, connect } from 'umi';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(
  ({
    optionalQuestion: { data: question },
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
    question,
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
      isEdited: false,
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
    const { dispatch, options, tempData, localStep, checkMandatory, question } = this.props;
    if (question._id !== '' && question.settings && question.settings.length)
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: question._id,
          settings: question.settings,
        },
      });
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
        checkMandatory: {
          ...checkMandatory,
          filledDocumentVerification: true,
        },
      },
    });
  };

  onFinish = () => {};

  onClickEdit = () => {
    const { isEdited } = this.state;
    this.setState({
      isEdited: !isEdited,
    });
  };

  onClickSubmit = () => {
    const { isEdited } = this.state;
    this.setState({
      isEdited: !isEdited,
    });
  };

  isBlueText = (order) => {
    const orderNonDisplay = [];
    return orderNonDisplay.includes(order);
  };

  isEdited = (order) => {
    const orderNonDisplay = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    return orderNonDisplay.includes(order);
  };

  _renderTableTitle = (record) => {
    const { salaryStructure } = this.props;
    const data = salaryStructure.find((item) => item === record);
    return <span className={` ${data.rank === 2 ? `big-text` : null}`}>{data?.title}</span>;
  };

  _renderTableValue = (record) => {
    const { isEdited } = this.state;
    const { salaryStructure = [] } = this.props;
    const data = salaryStructure?.find((item) => item === record) || {};
    const { value = '', key, edit = false, number = {} } = data;
    const isNumber = Object.keys(number).length > 0;

    // return null;

    if (edit && isEdited) {
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
    // if (order === 'E') {
    //   return ' ';
    // }
    return order;
  };

  _renderColumns = () => {
    const columns = [
      {
        title: '',
        dataIndex: 'order',
        key: 'title',
        width: '40%',
        render: (_, record) => this._renderTableTitle(record),
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
        render: (_, record) => this._renderTableValue(record),
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
            <Row style={{ margin: '32px' }}>
              <AnswerQuestion />
            </Row>
          </div>
          {/* {this._renderFooter()} */}
          {options === 1 ? this._renderBottomBar() : null}
        </Form>
      </div>
    );
  }
}

export default SalaryStructureTemplate;
