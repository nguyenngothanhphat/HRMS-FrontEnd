import React, { PureComponent } from 'react';
import { Form, Table, Button, Input, Row, Col, InputNumber } from 'antd';
import { formatMessage, connect } from 'umi';
// import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { every } from 'lodash';
import { getCurrentTenant } from '@/utils/authority';
import { TYPE_QUESTION, SPECIFY } from '@/components/Question/utils';
import NotifyModal from '../NotifyModal';
import styles from './index.less';
// import { Page } from '../../../../../../../FormTeamMember/utils';

@connect(
  ({
    optionalQuestion: { data: question },
    candidatePortal: {
      listTitle = [],
      checkMandatory = {},
      localStep,
      data: {
        processStatus = '',
        assignTo: { generalInfo: { workEmail: hrEmail = '' } = {} } = {},
        dateOfJoining = '',
      } = {},
      tempData: { options = 1 },
      tempData,
      salaryStructure = [],
    },
    user: { currentUser: { company: { _id = '' } = {} } = {} },
    loading,
  }) => ({
    question,
    listTitle,
    checkMandatory,
    dateOfJoining,
    localStep,
    processStatus,
    _id,
    salaryStructure,
    options,
    tempData,
    hrEmail,
    loadingSendEmail: loading.effects['candidatePortal/sendEmailByCandidate'],
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
      notifyModalVisible: false,
    };
  }

  onClickReNegotiate = () => {
    const { dispatch, hrEmail = '' } = this.props;
    this.setState({
      actionType: 're-negotiate',
    });
    dispatch({
      type: 'candidatePortal/sendEmailByCandidate',
      payload: {
        options: 2,
        hrEmail,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleNotifyModalVisible(true);
      }
    });
  };

  checkAllFieldsValidate = () => {
    const { settings, dispatch } = this.props;
    const valid = settings?.map((question) => {
      const employeeAnswers = question.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = question?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (question.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = question?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };

  onClickNext = () => {
    const {
      dispatch,
      options,
      tempData,
      localStep,
      checkMandatory,
      question,
      hrEmail = '',
      // dateOfJoining = '',
    } = this.props;
    const messageErr = this.checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (question._id !== '' && question.settings && question.settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: question._id,
          settings: question.settings,
        },
      });
    }

    this.setState({
      actionType: 'accept',
    });

    dispatch({
      type: 'candidatePortal/sendEmailByCandidate',
      payload: {
        options: 5,
        hrEmail,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleNotifyModalVisible(true);
      }
    });

    dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        options,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        options: tempData.options,
      },
    });
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep + 1,
        checkMandatory: {
          ...checkMandatory,
          filledDocumentVerification: true,
        },
      },
    });
  };

  handleNotifyModalVisible = (value) => {
    this.setState({
      notifyModalVisible: value,
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
    const { value = '', key, edit = false, number = {}, prefix, suffix } = data;
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
        {`${prefix && prefix} ${value} `}{' '}
        <span style={{ color: 'rgba(22, 28, 41, 0.5)' }}>{suffix && suffix}</span>
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
    const { loadingSendEmail } = this.props;
    const { actionType } = this.state;
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            {/* <div className={styles.bottomBar__status}>{this._renderStatus()}</div> */}
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              <Button
                type="secondary"
                onClick={this.onClickReNegotiate}
                className={styles.bottomBar__button__secondary}
                loading={loadingSendEmail && actionType === 're-negotiate'}
              >
                Re Negotiate
              </Button>
              <Button
                type="primary"
                // htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} `}
                loading={loadingSendEmail && actionType === 'accept'}
              >
                Accept
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { salaryStructure = [], options } = this.props;
    const { notifyModalVisible, actionType } = this.state;

    const modalTitle =
      actionType === 'accept'
        ? 'The acceptance of the provisional salary offer has been mailed to the HR.'
        : 'Thank you!';
    const modalContent =
      actionType === 'accept'
        ? 'Upon reviewing, the HR team shall get it touch with you for the final phase of discussions.'
        : 'Your response has been noted. The HR will get back to you 1-2 days to neogotiate the offer.';

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
            {/* <Row>
              <AnswerQuestion page={Page.Salary_Structure} />
            </Row> */}
          </div>
          {/* {this._renderFooter()} */}
          {options === 1 ? this._renderBottomBar() : null}
        </Form>

        <NotifyModal
          visible={notifyModalVisible}
          onClose={() => this.handleNotifyModalVisible(false)}
          title={modalTitle}
          content={modalContent}
        />
      </div>
    );
  }
}

export default SalaryStructureTemplate;
