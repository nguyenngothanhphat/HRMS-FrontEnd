import { Button, Col, Row } from 'antd';
// import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { trimStart, toString, trim } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import NotifyModal from '../NotifyModal';
import styles from './index.less';
import { SALARY_STRUCTURE_OPTION } from '@/utils/onboardingSetting';

@connect(
  ({
    candidatePortal: {
      data: {
        processStatus = '',
        salaryStructure: { status = '', settings = [] },
        assignTo: { generalInfo: { workEmail: hrEmail = '' } = {} } = {},
      } = {},
      tempData: { options = 1 },
      tempData,
      data,
      salaryStructureSetting,
      // salaryStructure = [],
    },
    user: { currentUser: { company: { _id = '' } = {} } = {} },
    loading,
  }) => ({
    processStatus,
    _id,
    status,
    settings,
    options,
    tempData,
    data,
    hrEmail,
    salaryStructureSetting,
    loadingSalary: loading.effects['candidatePortal/fetchCandidateById'],
    loadingSendEmail: loading.effects['candidatePortal/sendEmailByCandidate'],
  }),
)
class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      notifyModalVisible: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, data: { grade = {}, workLocation = {} } = {} } = this.props;
    dispatch({
      type: 'candidatePortal/fetchSalaryStructureByGrade',
      payload: {
        grade: grade?._id,
        location: workLocation?._id,
        getSetting: false,
      },
    });
  };

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

  onClickNext = () => {
    const { dispatch, hrEmail = '' } = this.props;
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
  };

  handleNotifyModalVisible = (value) => {
    this.setState({
      notifyModalVisible: value,
    });
    if (!value) {
      history.push(`/candidate-portal/dashboard`);
    }
  };

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

  formatNumber = (value) => {
    const list = trim(value).split('.');
    let num = list[0] === '0' ? list[0] : trimStart(list[0], '0');
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };

  renderSingle = (value, unit) => {
    if (!value) return '0';
    if (unit !== '%') return `${unit} ${this.formatNumber(value)}`;
    return (
      <div>
        {value}
        <span className={styles.ofBasic}> % of Basics</span>
      </div>
    );
  };

  convertValue = (value) => {
    const str = toString(value);
    const list = str.split('.');

    let num = list[0] !== '' && list[0] !== '0' ? trimStart(list[0], '0') : '0';
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };

  convertVeriable = (value) => {
    const str = toString(value);
    const list = str.split('.');
    list[0] = list[0] !== '0' && list[0] !== '' ? trimStart(list[0], '0') : '0';
    return list.join('.');
  };

  _renderValue = (item) => {
    return (
      <div key={item.key} className={styles.salary__right__text}>
        {this.renderSingle(item.value, item.unit)}
      </div>
    );
  };

  _renderBottomBar = () => {
    const { loadingSendEmail, status } = this.props;
    const { actionType } = this.state;
    if (status === 'IN-PROGRESS')
      return (
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col span={8}>
              {/* <div className={styles.bottomBar__status}>{this._renderStatus()}</div> */}
            </Col>
            <Col span={16}>
              <div className={styles.bottomBar__button}>
                <Button
                  type="secondary"
                  onClick={this.onClickReNegotiate}
                  className={styles.bottomBar__button__secondary}
                  loading={loadingSendEmail && actionType === 're-negotiate'}
                >
                  Contact HR
                </Button>
                <Button
                  type="primary"
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
    return '';
  };

  render() {
    const { settings, loadingSalary, salaryStructureSetting = {} } = this.props;
    const { notifyModalVisible, actionType } = this.state;

    const { option = '' } = salaryStructureSetting || {};

    const isTotalCompensation = option === SALARY_STRUCTURE_OPTION.TOTAL_COMPENSATION;

    const modalTitle =
      actionType === 'accept'
        ? 'The acceptance of the provisional salary offer has been mailed to the HR.'
        : 'Thank you!';
    const modalContent =
      actionType === 'accept'
        ? 'Upon reviewing, the HR team shall get it touch with you for the final phase of discussions.'
        : 'Your response has been noted. The HR will get back to you 1-2 days to discuss the offer.';
    return (
      <div className={styles.salaryStructureTemplate}>
        {!loadingSalary && (
          <div className={styles.salaryStructureTemplate_table}>
            {isTotalCompensation && (
              <Row className={styles.salaryTop}>
                <Col span={12} className={styles.salaryTop__left}>
                  {settings.map(
                    (item) =>
                      item.key === 'total_compensation' && (
                        <div key={item.key} className={styles.salaryTotal__left__text}>
                          {item.title}
                        </div>
                      ),
                  )}
                </Col>
                <Col span={12} className={styles.salaryTop__right}>
                  {settings.map(
                    (item) =>
                      item.key === 'total_compensation' && (
                        <div key={item.key} className={styles.salaryTotal__right__text}>
                          {this.renderSingle(item.value, item.unit)}
                        </div>
                      ),
                  )}
                </Col>
              </Row>
            )}
            <Row className={styles.salary}>
              <Col span={12} className={styles.salary__left}>
                {settings.map(
                  (item) =>
                    ![
                      'total_compensation',
                      isTotalCompensation ? 'total_cost_company' : '',
                    ].includes(item.key) && (
                      <div key={item.key} className={styles.salary__left__text}>
                        {item.title}
                      </div>
                    ),
                )}
              </Col>
              <Col span={12} className={styles.salary__right}>
                {settings.map((item) => {
                  if (
                    ![
                      'total_compensation',
                      isTotalCompensation ? 'total_cost_company' : '',
                    ].includes(item.key)
                  ) {
                    if (item.key === 'salary_13')
                      return (
                        <div key={item.key} className={styles.salary__right__text}>
                          {item.value !== 0
                            ? this.renderSingle(item.value, item.unit)
                            : '(Basic/12) x The number of months work'}
                        </div>
                      );
                    return this._renderValue(item);
                  }
                  return '';
                })}
              </Col>
            </Row>
            <Row className={styles.salaryTotal}>
              <Col span={12} className={styles.salaryTotal__left}>
                {settings.map(
                  (item) =>
                    [isTotalCompensation ? 'total_cost_company' : 'total_compensation'].includes(
                      item.key,
                    ) && (
                      <div key={item.key} className={styles.salaryTotal__left__text}>
                        {item.title}
                      </div>
                    ),
                )}
              </Col>
              <Col span={12} className={styles.salaryTotal__right}>
                {settings.map(
                  (item) =>
                    [isTotalCompensation ? 'total_cost_company' : 'total_compensation'].includes(
                      item.key,
                    ) && (
                      <div key={item.key} className={styles.salaryTotal__right__text}>
                        {this.renderSingle(item.value, item.unit)}
                      </div>
                    ),
                )}
              </Col>
            </Row>
          </div>
        )}
        {this._renderBottomBar()}

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
