/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Table, Button, Input, Row, Col, InputNumber, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
// import { dialog } from '@/utils/utils';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
// import { PROCESS_STATUS } from '@/utils/onboarding';
import doneIcon from './assets/doneIcon.png';
import editIcon from './assets/editIcon.png';
import styles from './index.less';

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
        department = '',
        workLocation = '',
        processStatus = '',
        salaryStructure: {
          settings: settingsOriginData = [],
          title: salaryTitleOriginData = {},
        } = {},
        candidate,
      } = {},
      data,
      tempData = {},
      tempData: {
        titleList = [],
        locationList = [],
        departmentList = [],
        salaryStructure: {
          settings: settingsTempData = [],
          title: salaryTitleTempData = {},
          department: salaryDepartmentTempData = {},
          workLocation: salaryWorkLocationTempData = {},
        } = {},
      } = {},
    },
    user: { currentUser: { company: { _id = '' } = {} } = {}, currentUser: { location = {} } = {} },
  }) => ({
    loadingTable: loading.effects['candidateInfo/saveSalaryStructure'],
    loadingFetchTable: loading.effects['candidateInfo/fetchTableData'],
    loadingEditSalary: loading.effects['candidateInfo/updateByHR'],
    loadingTitleList: loading.effects['candidateInfo/fetchTitleList'],
    listTitle,
    titleList,
    cancelCandidate,
    location,
    checkMandatory,
    locationList,
    department,
    workLocation,
    departmentList,
    salaryDepartmentTempData,
    salaryWorkLocationTempData,
    currentStep,
    processStatus,
    _id,
    data,
    settingsOriginData,
    settingsTempData,
    title,
    salaryTitleOriginData,
    salaryTitleTempData,
    tempData,
    candidate,
  }),
)
class SalaryStructureTemplate extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      // dataSettings: [],
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
    const { dispatch, settingsTempData: settings = [], title } = this.props;
    const tempTableData = [...settings];
    const isFilled = tempTableData.filter((item) => item.value === '');

    // Fetch Salary structure table when user click other tab (Ex: Job Details, Basic Information,...) then click Salary structure
    // this.fetchSalaryStructure();

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
    // this.setState({
    //   dataSettings: settings,
    // });

    // const { processStatus } = this.props;
    // const tempTableData = [...settings];

    // if (processStatus === 'DRAFT') {

    // dispatch({
    //   type: 'candidateInfo/fetchTitleListByCompany',
    //   payload: { company: getCurrentCompany(), tenantId: getCurrentTenant() },
    // });

    dispatch({
      type: 'candidateInfo/fetchDepartmentList',
      payload: { company: getCurrentCompany(), tenantId: getCurrentTenant() },
    });

    dispatch({
      type: 'candidateInfo/fetchLocationList',
      payload: { company: getCurrentCompany(), tenantId: getCurrentTenant() },
    });
    // }

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
    this.handleChangeSelect(title._id);
  };

  componentDidUpdate = (prevProps) => {
    const { department } = this.props;
    if (prevProps.department !== department) {
      this.handleChangeDepartment(department._id || department);
    }
    // if (prevProps.salaryTitle !== salaryTitle) {
    //   this.fetchSalaryStructure();
    // }
  };

  fetchSalaryStructure = () => {
    const {
      dispatch,
      settingsTempData: settings = [],
      salaryTitle: salaryTitleId,
      location: { headQuarterAddress: { country = {} } = {} } = {},
    } = this.props;

    if (salaryTitleId) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          salaryTitle: salaryTitleId,
        },
      });

      if (settings.length === 0) {
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
      } else {
        dispatch({
          type: 'candidateInfo/saveFilledSalaryStructure',
          payload: {
            filledSalaryStructure: true,
          },
        });
      }
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
      settingsOriginData: settings = [],
      // salaryPosition,
      data: { _id },
      tempData: { salaryTitle = '' } = {},
    } = this.props;

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        salaryStructure: {
          settings,
          title: salaryTitle,
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

  onClickEdit = (key) => {
    const { isEditted } = this.state;
    const {
      dispatch,
      settingsTempData: settings = [],
      candidate,
      salaryTitleTempData,
    } = this.props;
    const tenantId = getCurrentTenant();

    if (key === 'done') {
      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          tenantId,
          candidate,
          salaryStructure: {
            title: salaryTitleTempData,
            settings,
          },
        },
      }).then(() => {
        this.setState({
          isEditted: !isEditted,
        });
      });
    } else {
      this.setState({
        isEditted: !isEditted,
      });
    }
  };

  onCancel = async () => {
    const { dispatch, salaryTitle: salaryTitleId, settingsOriginData: settings = [] } = this.props;

    await dispatch({
      type: 'candidateInfo/saveSalaryStructure',
      payload: { title: salaryTitleId, settings },
    });

    this.formRef.current.resetFields();

    this.setState({
      isEditted: false,
    });
  };

  onClickSubmit = () => {
    const { isEditted } = this.state;
    this.setState({
      isEditted: !isEditted,
    });
  };

  isBlueText = (order) => {
    const orderNonDisplay = [];
    return orderNonDisplay.includes(order);
  };

  isEditted = (order) => {
    const orderNonDisplay = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    return orderNonDisplay.includes(order);
  };

  handleChange = (e, current) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;

    const { target } = e;
    const { name, value } = target;

    const isNumber = !!current;

    const tempTableData = [...settings];

    const index = tempTableData.findIndex((data) => data.key === name);

    if (isNumber) {
      tempTableData[index].value = `${current} ${value}`;
    } else {
      // tempTableData[index].value = value;
      tempTableData[index] = {
        ...tempTableData[index],
        value,
      };
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
    dispatch({
      type: 'candidateInfo/saveSalaryStructure',
      payload: {
        settings: tempTableData,
      },
    });
  };

  handleNumberChange = (name, current) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;
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
    const { dispatch, location: { headQuarterAddress: { country = {} } = {}, _id } = {} } =
      this.props;
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
    this.formRef.current.resetFields();
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        salaryTitle: value,
      },
    });

    dispatch({
      type: 'candidateInfo/fetchTableData',
      payload: {
        title: value,
        tenantId: getCurrentTenant(),
        country: country._id || country,
        location: _id,
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

  handleChangeDepartment = (value) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidateInfo/fetchTitleList',
      payload: {
        department: value,
      },
    });
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        salaryTitle: null,
      },
    });
  };

  handleChangeGrade = (value) => {
    console.log(value);
  };

  handleChangeLocation = (value) => {
    console.log(value);
  };

  _renderTableTitle = (record) => {
    const { settingsTempData: settings = [] } = this.props;
    const data = settings.find((item) => item === record) || {};
    return <span className={` ${data.rank === 2 ? `big-text` : null}`}>{data?.title}</span>;
  };

  _renderTableValue = (record) => {
    const { isEditted } = this.state;
    const { settingsTempData: settings = [] } = this.props;
    const data = settings.find((item) => item === record) || {};
    const { value = '', key, number = {} } = data;
    const isNumber = Object.keys(number).length > 0;

    const valueKey = () => {
      if (value !== '') {
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
    const { processStatus, settingsTempData: settings = [], loadingEditSalary } = this.props;
    if (
      (processStatus === 'DRAFT' ||
        processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ||
        processStatus === 'SENT-PROVISIONAL-OFFER') &&
      settings.length !== 0
    ) {
      return (
        <Form.Item className={styles.buttons}>
          {isEditted === true ? (
            <div className={styles.actionBtn}>
              <Button
                loading={loadingEditSalary}
                type="primary"
                onClick={() => this.onClickEdit('done')}
              >
                <img src={doneIcon} alt="icon" />
                Done
              </Button>
              <Button className={styles.cancelBtn} type="primary" onClick={this.onCancel}>
                <CloseCircleOutlined />
                <span>Cancel</span>
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => this.onClickEdit('edit')}>
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
    const {
      loadingTable,
      salaryTitle: salaryTitleId,
      department,
      workLocation,
      loadingFetchTable,
      settingsTempData: settings,
      title,
    } = this.props;
    const { processStatus } = this.props;
    return (
      <div className={styles.salaryStructureTemplate}>
        <Form
          initialValues={{
            salaryTemplate: salaryTitleId,
            // grade,
            // department,
            // location,
          }}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={6} lg={6}>
                <p className={styles.p_title_select}>Grade</p>
                <div className={styles.salaryStructureTemplate_select}>
                  <Input
                    value={Object.keys(title).length !== 0 ? title.grade : null}
                    size="large"
                    disabled
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <p className={styles.p_title_select}>Department</p>
                <div className={styles.salaryStructureTemplate_select}>
                  <Input
                    value={
                      Object.keys(department).length !== 0 ? department.name : department || null
                    }
                    size="large"
                    disabled
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <p className={styles.p_title_select}>Location</p>
                <div className={styles.salaryStructureTemplate_select}>
                  <Input
                    value={
                      Object.keys(workLocation).length !== 0
                        ? workLocation.name
                        : workLocation || null
                    }
                    size="large"
                    // style={{ width: 280 }}
                    disabled
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <p className={styles.p_title_select}> Job title</p>
                <div className={styles.salaryStructureTemplate_select}>
                  <Input
                    value={Object.keys(title).length !== 0 ? title.name : title || null}
                    size="large"
                    // style={{ width: 280 }}
                    disabled
                  />
                </div>
              </Col>
            </Row>
            {loadingFetchTable ? (
              <Spin className={styles.spin} />
            ) : (
              <>
                {/* {salaryTitleId && (
                    <> */}
                {this._renderButtons()}
                <div className={styles.salaryStructureTemplate_table}>
                  <Table
                    loading={loadingTable}
                    dataSource={settings}
                    columns={this._renderColumns()}
                    pagination={false}
                  />
                </div>
                {/* {this._renderFooter()} */}
                {processStatus === 'ACCEPT-PROVISIONAL-OFFER' || processStatus === 'DRAFT'
                  ? this._renderBottomBar()
                  : null}
                {/* </>
                  )} */}
              </>
            )}
          </>
        </Form>
      </div>
    );
  }
}

export default SalaryStructureTemplate;
