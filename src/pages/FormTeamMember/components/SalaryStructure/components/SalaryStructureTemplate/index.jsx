/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Select, Form, Table, Button, Input, Row, Col, InputNumber, Spin } from 'antd';
import { formatMessage, connect } from 'umi';
// import { dialog } from '@/utils/utils';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import doneIcon from './assets/doneIcon.png';
import editIcon from './assets/editIcon.png';
import styles from './index.less';

import PROCESS_STATUS from '../../../utils';

@connect(
  ({
    loading,
    candidateInfo: {
      cancelCandidate,
      checkMandatory = {},
      currentStep = {},
      data: {
        listTitle = [],
        title = {},
        processStatus = '',
        salaryStructure: {
          settings = [
            // {
            //   key: 'basic',
            //   title: 'Basic',
            //   value: '',
            //   order: 'A',
            // },
            // {
            //   key: 'hra',
            //   title: 'HRA',
            //   value: '',
            //   order: 'B',
            // },
            // {
            //   title: 'Other allowances',
            //   key: 'otherAllowances',
            //   value: 'Balance amount',
            //   order: 'C',
            // },
            // {
            //   key: 'totalEarning',
            //   title: 'Total earning (Gross)',
            //   order: 'D',
            //   value: 'A + B + C',
            // },
            // {
            //   key: 'deduction',
            //   title: 'Deduction',
            //   order: 'E',
            //   value: ' ',
            // },
            // {
            //   key: 'employeesPF',
            //   title: "Employee's PF",
            //   value: '',
            //   order: 'G',
            // },
            // {
            //   key: 'employeesESI',
            //   title: "Employee's ESI",
            //   value: '',
            //   order: 'H',
            // },
            // {
            //   key: 'professionalTax',
            //   title: 'Professional Tax',
            //   value: 'Rs.200',
            //   order: 'I',
            // },
            // {
            //   key: 'tds',
            //   title: 'TDS',
            //   value: 'As per IT rules',
            //   order: 'J',
            // },
            // {
            //   key: 'netPayment',
            //   title: 'Net Payment',
            //   value: 'F - (G + H + I + J)',
            //   order: ' ',
            // },
          ],
        } = {},
      } = {},
      data,
      tempData = {},
    },
    user: { currentUser: { company: { _id = '' } = {} } = {}, currentUser: { location = {} } = {} },
  }) => ({
    loadingTable: loading.effects['candidateInfo/saveSalaryStructure'],
    loadingFetchTable: loading.effects['candidateInfo/fetchTableData'],
    listTitle,
    cancelCandidate,
    location,
    checkMandatory,
    currentStep,
    processStatus,
    _id,
    data,
    settings,
    title,
    tempData,
  }),
)
class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      salaryTitle: '',
      dataSettings: [],
      // error: '',
      // errorInfo: '',
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

  componentDidUpdate(prevProps) {
    const { listTitle = [], salaryTitle: salaryTitleId, settings } = this.props;
    const { salaryTitle = '' } = this.state;
    if (!salaryTitleId) {
      return;
    }
    const titleName = listTitle.find((item) => item._id === salaryTitleId);
    if (titleName && !salaryTitle) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        salaryTitle: titleName.name,
      });
    }

    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      dataSettings: settings,
    });
  }

  // componentDidCatch(error, errorInfo) {
  //   // Catch errors in any components below and re-render with error message
  //   console.log(error);
  //   console.log(errorInfo);
  //   // You can also log error messages to an error reporting service here
  // }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        listTitle: [],
      },
    });
  };

  componentDidMount = () => {
    const {
      dispatch,
      settings,
      salaryTitle: salaryTitleId,
      location: { headQuarterAddress: { country = {} } = {} } = {},
    } = this.props;
    const tempTableData = [...settings];
    const isFilled = tempTableData.filter((item) => item.value === '');

    // Fetch Salary structure table when user click other tab (Ex: Job Details, Basic Information,...) then click Salary structure
    if (salaryTitleId) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          salaryTitle: salaryTitleId,
        },
      });

      dispatch({
        type: 'candidateInfo/fetchTableData',
        payload: {
          title: salaryTitleId,
          tenantId: getCurrentTenant(),
          country: country._id || country,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          dispatch({
            type: 'candidateInfo/saveFilledSalaryStructure',
            payload: {
              filledSalaryStructure: true,
            },
          });
        }
      });
    }

    // if (processStatus !== 'DRAFT') {
    //   dispatch({
    //     type: 'candidateInfo/fetchTitleListByCompany',
    //     payload: { company: _id },
    //   });
    //

    // dispatch({
    //   type: 'candidateInfo/saveTemp',
    //   payload: {
    //     salaryTitle: '',
    //   },
    // });
    this.setState({
      dataSettings: settings,
    });

    const { processStatus } = this.props;
    // const tempTableData = [...settings];

    if (processStatus === 'DRAFT') {
      dispatch({
        type: 'candidateInfo/fetchTitleListByCompany',
        payload: { company: getCurrentCompany(), tenantId: getCurrentTenant() },
      });
    }

    if (isFilled.length === 0 && tempTableData.length > 0) {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: true,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: false,
        },
      });
    }
  };

  // componentWillUnmount = () => {
  //   const {
  //     dispatch,
  //     currentStep,
  //     settings,
  //     // salaryPosition,
  //     data: {
  //       _id,
  //       salaryStructure: { title },
  //     },
  //   } = this.props;
  //   dispatch({
  //     type: 'candidateInfo/updateByHR',
  //     payload: {
  //       salaryStructure: {
  //         title,
  //         settings,
  //       },
  //       candidate: _id,
  //       currentStep,
  //     },
  //   }).then(({ data: data1, statusCode }) => {
  //     if (statusCode === 200) {
  //       dispatch({
  //         type: 'candidateInfo/save',
  //         payload: {
  //           currentStep: data1.currentStep,
  //         },
  //       });
  //     }
  //   });
  // };

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
    const {
      dispatch,
      currentStep,
      settings,
      // salaryPosition,
      data: { _id },
    } = this.props;
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        salaryStructure: {
          settings,
        },
        candidate: _id,
        currentStep: currentStep + 1,
        tenantId: getCurrentTenant(),
      },
    }).then(({ data: data1, statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'candidateInfo/save',
          payload: {
            currentStep: data1.currentStep,
          },
        });
      }
    });
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

  handleChange = (e, current) => {
    const { dispatch, settings } = this.props;

    const { target } = e;
    const { name, value } = target;

    const isNumber = !!current;

    const tempTableData = [...settings];
    const index = tempTableData.findIndex((data) => data.key === name);

    if (isNumber) {
      tempTableData[index].value = `${current} ${value}`;
    } else {
      tempTableData[index].value = value;
    }
    const isFilled = tempTableData.filter((item) => item.value === '');
    if (isFilled.length === 0 && tempTableData.length > 0) {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: true,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: false,
        },
      });
    }
    // dispatch({
    //   type: 'candidateInfo/saveSalaryStructure',
    //   payload: {
    //     settings: tempTableData,
    //   },
    // });
  };

  handleNumberChange = (name, current, value) => {
    const { dispatch, settings } = this.props;
    const tempTableData = [...settings];
    const index = tempTableData.findIndex((data) => data.key === name);

    tempTableData[index].number.current = current;

    const isFilled = tempTableData.filter((item) => item.value === '');
    if (isFilled.length === 0 && tempTableData.length > 0) {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: true,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/saveFilledSalaryStructure',
        payload: {
          filledSalaryStructure: false,
        },
      });
    }
  };

  handleChangeSelect = (value) => {
    // const {
    //   dispatch,
    //   tempData: { workLocation: { headQuarterAddress: { country = '' } = {} } = {} } = {},
    // } = this.props;
    const { dispatch, location: { headQuarterAddress: { country = {} } = {} } = {} } = this.props;
    // const tempTableData = [];
    // const check = tempTableData.map((data) => data.value !== '').every((data) => data === true);

    // dispatch({
    //   type: 'candidateInfo/saveOrigin',
    //   payload: {
    //     title: {
    //       _id: value,
    //     },
    //   },
    // });
    // console.log('id', this.props.salaryTitleId === null);
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        salaryTitle: value,
      },
    });

    dispatch({
      type: 'candidateInfo/fetchTableData',
      payload: { title: value, tenantId: getCurrentTenant(), country: country._id || country },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'candidateInfo/saveFilledSalaryStructure',
          payload: {
            filledSalaryStructure: true,
          },
        });
      }
    });

    // const isFilled = tempTableData.filter((item) => item.value === '');
    // if (isFilled.length === 0 && tempTableData.length > 0) {
    //   dispatch({
    //     type: 'candidateInfo/saveFilledSalaryStructure',
    //     payload: {
    //       filledSalaryStructure: true,
    //     },
    //   });
    // } else {
    //   dispatch({
    //     type: 'candidateInfo/saveFilledSalaryStructure',
    //     payload: {
    //       filledSalaryStructure: false,
    //     },
    //   });
    // }

    // dispatch({
    //   type: 'candidateInfo/saveSalaryStructure',
    //   payload: {
    //     settings: tempTableData,
    //   },
    // });
  };

  _renderTableTitle = (order) => {
    const { settings } = this.props;
    const data = settings?.find((item) => item.order === order);
    const { title = '' } = data;
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
    const { settings = [] } = this.props;
    const data = settings?.find((item) => item.order === order);
    const { value = '', key, number = {} } = data;
    const isNumber = Object.keys(number).length > 0;

    const valueKey = () => {
      if (key === 'basic' || key === 'hra' || key === 'employeesPF' || key === 'employeesESI') {
        return true;
      }

      return false;
    };

    if (isEditted) {
      if (isNumber) {
        const { current = '', max = '' } = number;
        return (
          <Form.Item name={key} className={styles.formNumber}>
            <InputNumber
              onChange={(val) => this.handleNumberChange(key, val, value)}
              defaultValue={current}
              max={parseFloat(max)}
              name={key}
            />
            <span>{value}</span>
          </Form.Item>
        );
      }
      return (
        <>
          {valueKey() ? (
            <Form.Item name={key} className={styles.formInput}>
              <Input
                className={styles.formInput__field}
                onChange={(e) => this.handleChange(e)}
                defaultValue={value}
                name={key}
              />
            </Form.Item>
          ) : (
            <span>{value}</span>
          )}
        </>
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
        {footerData.map((data, index) => {
          return (
            <div key={`${index + 1}`} className={styles.salaryStructureTemplate_footer_info}>
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
    const { processStatus, settings } = this.props;
    if (
      (processStatus === 'DRAFT' ||
        processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ||
        processStatus === 'SENT-PROVISIONAL-OFFER') &&
      settings.length !== 0
    ) {
      return (
        <Form.Item className={styles.buttons}>
          {isEditted === true ? (
            <Button type="primary" onClick={this.onClickEdit}>
              <img src={doneIcon} alt="icon" />
              {formatMessage({ id: 'component.salaryStructureTemplate.done' })}
            </Button>
          ) : (
            <Button type="primary" onClick={this.onClickEdit}>
              <img src={editIcon} alt="icon" />{' '}
              {formatMessage({ id: 'component.salaryStructureTemplate.edit' })}
            </Button>
          )}
        </Form.Item>
      );
    }
    return <Form.Item />;
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
    const { filledSalaryStructure = false } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>
              {processStatus === 'DRAFT' ? this._renderStatus() : null}
            </div>
          </Col>
          <Col className={styles.bottomBar__button} span={8}>
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
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { Option } = Select;
    const { loadingTable, salaryTitle: salaryTitleId, loadingFetchTable } = this.props;
    const { processStatus, listTitle = [] } = this.props;
    const { dataSettings } = this.state;

    return (
      <div className={styles.salaryStructureTemplate}>
        <Form
          initialValues={{
            salaryTemplate: salaryTitleId,
          }}
          onFinish={this.onFinish}
        >
          {listTitle.length === 0 && loadingFetchTable ? null : (
            <div className={styles.salaryStructureTemplate_select}>
              <Form.Item label="Select a salary structure template" name="salaryTemplate">
                <Select
                  value={salaryTitleId}
                  onChange={this.handleChangeSelect}
                  onFocus={this.onFocusSelect}
                  placeholder="Please select a choice!"
                  loading={loadingTable || loadingFetchTable}
                  size="large"
                  style={{ width: 280 }}
                  disabled={processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT}
                >
                  {listTitle.map(({ _id = '', name = '' }) => {
                    return (
                      <Option key={_id} value={_id}>
                        {name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          )}
          {loadingFetchTable ? (
            <Spin className={styles.spin} />
          ) : (
            <>
              {salaryTitleId && (
                <>
                  {this._renderButtons()}
                  <div className={styles.salaryStructureTemplate_table}>
                    <Table
                      loading={loadingTable}
                      dataSource={dataSettings}
                      columns={this._renderColumns()}
                      pagination={false}
                    />
                  </div>
                  {this._renderFooter()}
                  {processStatus === 'ACCEPT-PROVISIONAL-OFFER' || processStatus === 'DRAFT'
                    ? this._renderBottomBar()
                    : null}
                </>
              )}
            </>
          )}
        </Form>
      </div>
    );
  }
}

export default SalaryStructureTemplate;
