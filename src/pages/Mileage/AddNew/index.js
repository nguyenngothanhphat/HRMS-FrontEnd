import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import {
  Col,
  Row,
  Form,
  Icon,
  Button,
  Input,
  Select,
  Checkbox,
  Menu,
  Dropdown,
  Modal,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import _ from 'lodash';
import SearchLocation from '../SearchLocation';
import MileageType from '../MileageType';
import styles from './index.less';
import PageLoading from '../../../components/PageLoading';
import GoogleMap from '../../../components/GoogleMap';
import { roundNumber } from '../../../utils/utils';

const noneProject = { name: 'None', _id: -1 };
const creditCardType = require('credit-card-type');

const getCardType = number => {
  const cardType = creditCardType(number);
  let nameType = number;
  if (cardType.length > 0) {
    nameType = `${cardType[0].niceType} - ${number}`;
  }
  return nameType;
};

const createListAllProject = list => {
  let newList = [];
  list.forEach(item => {
    const subList = item.subProjects.map(subItem => ({
      ...subItem,
      name: `${item.name} / ${subItem.name}`,
      subProjectName: subItem.name,
      isSubProject: true,
      _id: `${item._id}${subItem.name}`,
      _idParent: item._id,
    }));
    newList = [...newList, item, ...subList];
    newList = newList.sort((first, next) => first.name.localeCompare(next.name));
  });
  return newList;
};

const AddNewFormComponent = props => {
  const {
    match: { path },
    loadingEdit,
    fetchingAppSettings,
    paymentOptions: { personal = [], company = [] },
    submitSave,
    listTag,
    listProject,
    listCard,
    loading,
    form,
    currency: { list: listCurrency = [] } = {},
    originalNumber = 0,
    rate = 0,
    distanceUnit = 'km',
    dispatch,
    currentUser: {
      location: { currency: { _id: myCurrency = '' } = {}, _id: myLocationID = '' } = {},
    } = {},
    mileageTypeRate: { dynamic: listMileageTypeRate = [] } = {},
    mileage: { dynamic: mileageFieldConfig = [] } = {},
    item: reducerItem = {},
    item: {
      creditCard,
      exchangeRate: exChangeRateInit,
      reimbursable = true,
      paymentOption: paymentOptionInit,
      billable = true,
      tag: tagInit,
      project = noneProject,
      originCurrency: vehicleOriginCurrency = 'USD',
      date = '',
      subProjectName: subProjectNameItemBill,
      mileage: {
        from: fromMileage,
        to: toMileage,
        stop: stopMileage,
        type: vehicleTypeKey = '',
        rate: vehicleRate = '',
        distanceUnit: distanceUnitOrigin = '',
      } = {},
    } = {},
  } = props;

  const checkPath = path === '/expense/newmileage';
  const renderDefaultField = key => {
    let fieldByKey = {};
    if (mileageFieldConfig.length > 0) {
      fieldByKey = mileageFieldConfig.find(i => i.key === key);
    }
    return fieldByKey;
  };
  const projectField = renderDefaultField('project') || {};
  const {
    name: nameProjectField = '',
    placeholder: placeholderProjectField = '',
    required: requiredProjectField,
  } = projectField;
  const paymentOptionsField = renderDefaultField('paymentOption') || {};
  const {
    name: namePaymentOptionsField = '',
    placeholder: placeholderPaymentOptionsField = '',
    required: requiredPaymentOptionsField,
  } = paymentOptionsField;
  const tagField = renderDefaultField('tag') || {};
  const {
    name: nameTagField = '',
    placeholder: placeholderTagField = '',
    required: requiredTagField,
  } = tagField;

  const renderLabel = (name, check, required) => {
    return (
      <React.Fragment>
        <span className={!check ? styles.label : styles.labelFail}>{name}</span>
        <span
          style={!required ? { display: 'none' } : undefined}
          className={!check ? styles.required : styles.requiredFail}
        >
          *
        </span>
      </React.Fragment>
    );
  };
  const idProjectItemBill = () => {
    if (project._id !== -1) {
      if (subProjectNameItemBill) {
        return `${project._id}${subProjectNameItemBill}`;
      }
      return project._id;
    }
    return -1;
  };
  const [visibaleDelPop, setVisibaleDelPop] = useState(false);
  const menuEditButton = (
    <Menu className={styles.menu} onClick={() => setVisibaleDelPop(true)}>
      <Menu.Item key="1">{formatMessage({ id: 'mileage.deleteMileage' })}</Menu.Item>
    </Menu>
  );

  const listPaymentOptionsPersonal = personal.filter(i => i.name !== 'Personal');
  const listPaymentOptionsCompany = company.filter(i => i.name !== 'company');
  const listAllProject = createListAllProject(listProject);
  const newListProject = [noneProject, ...listAllProject];
  const [stop, setStop] = useState(stopMileage || []);
  const [googleMapList, setGoogleMapList] = useState({});
  const [vehicleType, setVehicleType] = useState({});
  const [exchangeRate, setExchangeRate] = useState(0);
  const [searchProject, setSearchProject] = useState('');
  const [projectSelected, setProjectSelected] = useState({});
  const [listProjectRecently] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  const [validitionProject, setValiditionProject] = useState(false);
  const [validationTag, setValidationTag] = useState(false);
  const [validationPaymentOption, setValidationPaymentOption] = useState(false);
  const [validationVehicleType, setValidationVehicleType] = useState(false);
  const [validationMapDistance, setValidationMapDistance] = useState(false);
  const { Option, OptGroup } = Select;
  const to = toMileage || {};
  useEffect(() => {
    setStop(stopMileage || []);
  }, [stopMileage]);
  let waypoints = [to, ...stop];
  useEffect(
    () => {
      waypoints = [to, ...stop];
    },
    stop,
    stopMileage,
    to
  );
  const checkMileageConfigField = (key, rule, item, callback) => {
    const keyErrorMessage = {
      project: formatMessage({ id: 'mileage.requiredProject' }),
      paymentOption: formatMessage({ id: 'mileage.requiredPaymentOption' }),
      tag: formatMessage({ id: 'mileage.requiredTag' }),
    };
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: keyErrorMessage[key],
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      switch (key) {
        case 'project':
          setValiditionProject(false);
          break;
        case 'paymentOption':
          setValidationPaymentOption(false);
          break;
        case 'tag':
          setValidationTag(false);
          break;
        default:
          break;
      }
    } else {
      switch (key) {
        case 'project':
          setValiditionProject(true);
          break;
        case 'paymentOption':
          setValidationPaymentOption(true);
          break;
        case 'tag':
          setValidationTag(true);
          break;
        default:
          break;
      }
    }
    callback(msg);
  };
  const checkMapDistance = (rule, value, callback) => {
    let msg;
    const filter = [
      v => ({
        check: !v,
        message: formatMessage({ id: 'mileage.mapDistanceValidation' }),
      }),
      () => ({
        check: value <= 0,
        message: formatMessage({ id: 'mileage.mapDistanceValidation' }),
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(value);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      setValidationMapDistance(false);
    } else {
      setValidationMapDistance(true);
    }
    callback(msg);
  };
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const projectItem = getFieldValue('project');
  const paymentType = getFieldValue('paymentOption');
  const handleInfoOnChange = () => {};
  const getAllPersonalPaymentName = list => {
    const result = list.map(item => {
      return item.name;
    });
    return result;
  };
  const checkMileageLocation = (rule, value, callback) => {
    let msg;
    try {
      if (typeof value !== 'object' && !value)
        throw new Error(formatMessage({ id: 'bill.required.mileage.address' }));
    } catch (error) {
      const { message } = error;
      msg = message;
    }
    callback(msg);
  };

  const handleDelete = () => {
    const {
      match: { params: { reId } = {} },
    } = props;
    dispatch({ type: 'bill/deleteExpense', payload: { expenseID: reId } });
  };
  const addNewTag = () => {
    dispatch({
      type: 'tag/createGroup',
      payload: { groupName: searchTag },
    }).then(data => {
      form.setFieldsValue({ tag: data._id });
      setSearchTag('');
    });
  };

  const listTagDisplay = searchTag
    ? listTag.filter(
        item => item.groupName && item.groupName.toLowerCase().indexOf(searchTag.toLowerCase()) > -1
      )
    : listTag;
  const iconAddTag =
    listTagDisplay.length === 0 && searchTag ? (
      <Icon type="plus" className={styles.btnAddTag} onClick={addNewTag} />
    ) : null;

  const onSearcProject = value => {
    setSearchProject(value);
  };
  const onSearchTag = value => {
    setSearchTag(value);
  };
  const onSelectProject = (value, list) => {
    const tmp = list.find(item => item._id === value);
    setProjectSelected(tmp);
    setSearchProject('');
  };
  const getProjectName = (list, id) => {
    const result = list.find(i => i._id === id);
    return result && result.name;
  };
  const hanldeSearchLocation = val => {
    const { mileage = {} } = reducerItem;
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...reducerItem,
          mileage: { ...mileage, ...val },
        },
      },
    });
  };
  const [mapDistance, setMapDistance] = useState(0);
  const handleGoogleMapChange = distance => {
    setMapDistance(distance);
  };
  const removeStop = k => {
    let newStop = [...stop];
    newStop = newStop.filter((value, index) => index !== k - 1);
    setStop(newStop);
    const { mileage = {} } = reducerItem;
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...reducerItem,
          mileage: { ...mileage, stop: newStop.filter(value => value.placeID), to },
        },
      },
    });
    form.resetFields();
  };

  const calculateTotalAmout = () => {
    if (vehicleType.currency) {
      if (vehicleType.currency === myCurrency) {
        return roundNumber(parseFloat(mapDistance) * parseFloat(vehicleType.money), 4);
      }
      return roundNumber(
        parseFloat(mapDistance) * parseFloat(vehicleType.money) * parseFloat(exchangeRate),
        4
      );
    }
    return 0;
  };
  const calculateTotalAmoutOrigin = () => {
    if (vehicleType.currency) {
      return roundNumber(parseFloat(mapDistance) * parseFloat(vehicleType.money), 4);
    }
    return 0;
  };
  const formItems = waypoints.map((location = {}, k) => {
    const { placeID } = location;
    const key = placeID || k;
    const propsSearch = {
      onChange: val => {
        let newStop = [...stop];
        if (k !== 0) {
          newStop[k - 1] = val;
        }
        newStop = newStop.filter(value => value.placeID);
        hanldeSearchLocation(k === 0 ? { to: val } : { stop: newStop });
      },
      delIcon:
        k + 1 === 1 ? (
          undefined
        ) : (
          <Icon
            className={styles.iconDel}
            type="delete"
            theme="twoTone"
            twoToneColor="red"
            onClick={() => removeStop(k)}
          />
        ),
    };
    let label = `${formatMessage({ id: 'bill.form.mileage.stop' })} ${k}`;
    if (stop.length === 0) label = formatMessage({ id: 'mileage.end' });
    else if (k === 0) label = formatMessage({ id: 'bill.form.mileage.end' });

    return (
      <Form.Item
        label={<span className={styles.mileageLabel}>{label}</span>}
        required={false}
        key={key}
      >
        {getFieldDecorator(k === 0 ? 'mileage.to' : `mileage.stop.${k}`, {
          initialValue: location,
          rules: [{ validator: checkMileageLocation }],
        })(
          <SearchLocation
            delIconClassName={styles.delIconSearchForm}
            isFull={k === 0}
            {...propsSearch}
          />
        )}
      </Form.Item>
    );
  });
  useEffect(() => {
    const {
      match: { params: { reId } = {} },
    } = props;
    dispatch({ type: 'currency/fetch' });
    dispatch({ type: 'tag/fetchGroup' });
    dispatch({ type: 'appSetting/fetchByLocation', payload: { location: myLocationID } });
    dispatch({ type: 'project/fetch', payload: { location: myLocationID } });
    dispatch({ type: 'bill/fetchItem', payload: reId });
    dispatch({ type: 'creditCard/fetchForEmployee' });
  }, []);
  useEffect(() => {
    setGoogleMapList({
      origin: fromMileage,
      destination: toMileage,
      waypoints: stopMileage || [],
    });
  }, [fromMileage, toMileage, stopMileage]);
  const handleAddStop = () => {
    setStop([...stop, {}]);
  };
  const handleSubmitForm = (saveAndNew = false) => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (calculateTotalAmout() <= 0) return;
      const {
        dateofspend,
        vehicletypeinput,
        billable: formBillable,
        paymentOption: formPaymentOption,
        tag: formTag,
        reimbursable: formReimbursable,
        creditCard: formCreditCard,
        distanceUnit: formDistanceUnit,
      } = values;

      const formData = {
        images: [],
        category: 'MILEAGE',
        date: moment(dateofspend).format('YYYY-MM-DD'),
        amount: calculateTotalAmout(),
        description: '',
        reimbursable: formReimbursable,
        originAmount: calculateTotalAmoutOrigin(),
        originCurrency: vehicleType.currency || 'USD',
        exchangeRate,
        currency: myCurrency,
        merchant: 'Merchant',
        type: {},
        project: projectSelected.isSubProject ? projectSelected._idParent : projectSelected._id,
        billable: formBillable,
        creditCard: formCreditCard || undefined,
        subProjectName: projectSelected.subProjectName,
        subProject: projectSelected.isSubProject,
        mileage: {
          type: vehicletypeinput,
          rate: vehicleType.money || 0,
          distance: mapDistance,
          from: fromMileage,
          to: toMileage,
          stop: stopMileage,
          distanceUnit: formDistanceUnit,
        },
        tag: formTag,
        paymentOption: formPaymentOption,
      };
      dispatch({ type: 'bill/submit', payload: { formData, saveAndNew } });
    });
  };
  const handleEditForm = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        dateofspend,
        vehicletypeinput,
        billable: formBillable,
        paymentOption: formPaymentOption,
        tag: formTag,
        reimbursable: formReimbursable,
        creditCard: formCreditCard,
        distanceUnit: formDistanceUnit,
      } = values;
      const {
        match: { params: { reId } = {} },
      } = props;
      const formData = {
        expenseID: reId,
        images: [],
        category: 'MILEAGE',
        date: moment(dateofspend).format('YYYY-MM-DD'),
        amount: calculateTotalAmout(),
        description: '',
        reimbursable: formReimbursable,
        originAmount: calculateTotalAmoutOrigin(),
        originCurrency: vehicleType.currency || 'USD',
        exchangeRate,
        currency: myCurrency,
        merchant: 'Merchant',
        type: {},
        project: projectSelected.isSubProject ? projectSelected._idParent : projectSelected._id,
        billable: formBillable,
        creditCard: formCreditCard || undefined,
        subProjectName: projectSelected.subProjectName || '',
        subProject: projectSelected.isSubProject || false,
        mileage: {
          type: vehicletypeinput,
          rate: vehicleType.money || 0,
          distance: mapDistance,
          from: fromMileage,
          to: toMileage,
          stop: stopMileage,
          distanceUnit: formDistanceUnit,
        },
        tag: formTag,
        paymentOption: formPaymentOption,
      };
      const data = _.pickBy(formData, _.identity);
      const newData = {
        ...data,
        reimbursable: formReimbursable,
        billable: formBillable,
        subProjectName: projectSelected.subProjectName || '',
        subProject: projectSelected.isSubProject || false,
      };
      dispatch({ type: 'bill/updateExpense', payload: { newData } });
    });
  };
  useEffect(() => {
    form.setFieldsValue({ mapdistance: mapDistance });
  }, [mapDistance]);

  const isShowDelButton = () => {
    if (path === '/expense/newmileage') {
      return false;
    }
    if (reducerItem && reducerItem.report && reducerItem.report._id) {
      return false;
    }

    return true;
  };

  const isEditExpenseReport = () => {
    if (reducerItem && reducerItem.report && reducerItem.report._id) {
      return true;
    }
    return false;
  };

  return (
    <PageLoading loading={loading && loadingEdit} size="small">
      <div className={styles.mileageAddNewContainer}>
        <Row className={styles.wrapHeader}>
          <Col span={24}>
            <Link
              to={isEditExpenseReport() ? `/report/view/${reducerItem.report._id}` : '/expense'}
            >
              <Icon type="left" className={styles.iconTitle} />
              <span className={styles.mileageAddNewTitle}>
                {checkPath
                  ? formatMessage({ id: 'mileage.addNewTitle' })
                  : formatMessage({ id: 'mileage.editTitle' })}
              </span>
            </Link>
          </Col>
        </Row>
        {fetchingAppSettings ? (
          <Row
            type="flex"
            style={{ height: '90vh', justifyContent: 'center', alignItems: 'center' }}
          >
            <Spin size="large" />
          </Row>
        ) : (
          <Row gutter={12}>
            <Col sm={12} xs={24} style={{ paddingRight: '27px', minWidth: '400px' }}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('info', {
                    initialValue: {
                      date: moment(date || Date.now()),
                      listMileageTypeRate,
                      listCurrency,
                      myCurrency,
                      exChangeRateInit,
                      originalNumber,
                      vehicleTypeKey,
                      form,
                      vehicleRate,
                      rate,
                      distanceUnit,
                      getFieldDecorator,
                      vehicleOriginCurrency,
                      setFieldsValue,
                      dispatch,
                      vehicleType,
                      setVehicleType,
                      exchangeRate,
                      setExchangeRate,
                      validationVehicleType,
                      setValidationVehicleType,
                      distanceUnitOrigin,
                      renderLabel,
                    },
                  })(<MileageType onChange={handleInfoOnChange} />)}
                </Form.Item>

                <Form.Item
                  label={
                    <span className={styles.mileageLabel}>
                      {formatMessage({ id: 'mileage.start' })}
                    </span>
                  }
                >
                  {getFieldDecorator('mileage.from', {
                    initialValue: fromMileage || {},
                    rules: [{ validator: checkMileageLocation }],
                  })(
                    <SearchLocation isFull onChange={val => hanldeSearchLocation({ from: val })} />
                  )}
                </Form.Item>
                {formItems}
                {waypoints.length > 8 && (
                  <p className={styles.warning}>
                    <FormattedMessage id="mileage.maxLocations" />
                  </p>
                )}
                <Form.Item>
                  <Button
                    size="small"
                    onClick={handleAddStop}
                    disabled={waypoints.length > 8}
                    className={styles.addStopBtn}
                  >
                    <FormattedMessage id="mileage.btnAddStop" />
                  </Button>
                </Form.Item>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label={renderLabel(
                        `${formatMessage({
                          id: 'mileage.distanceLabel',
                        })} (${vehicleType.distanceUnit || 'km'})`,
                        validationMapDistance,
                        true
                      )}
                    >
                      {getFieldDecorator('mapdistance', {
                        initialValue: mapDistance,
                        rules: [
                          {
                            validator: (rule, value, callback) =>
                              checkMapDistance(rule, value, callback),
                          },
                        ],
                      })(<Input readOnly className={styles.noBorder} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12} className={styles.wrapTotalAmout}>
                    <div className={styles.wrapContent}>
                      <div className={styles.labelTotalAmount}>
                        {formatMessage({ id: 'mileage.totalAmount' })}
                      </div>
                      <div className={styles.totalAmountValue}>
                        <span style={{ marginRight: '10px' }}>{`${myCurrency}`}</span>
                        <span className={styles.amoutValue}>
                          {calculateTotalAmout()
                            ? numeral(calculateTotalAmout()).format('0,0[.]00')
                            : 0}
                        </span>
                      </div>
                      {calculateTotalAmout() <= 0 && (
                        <div className={styles.totalAmountError}>
                          {formatMessage({ id: 'mileage.validationTotalAmount' })}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={projectItem === -1 ? 24 : 16}>
                    <Form.Item
                      label={renderLabel(nameProjectField, validitionProject, requiredProjectField)}
                      rules={[{ required: true }]}
                    >
                      {getFieldDecorator('project', {
                        initialValue: idProjectItemBill() || -1,
                        rules: [
                          {
                            validator: requiredProjectField
                              ? (rule, item, callback) =>
                                  checkMileageConfigField('project', rule, item, callback)
                              : () => true,
                          },
                        ],
                      })(
                        <Select
                          showSearch
                          placeholder={placeholderProjectField}
                          onSearch={onSearcProject}
                          filterOption={(input, option) =>
                            typeof option.props.children === 'string' &&
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                          }
                          onSelect={value => onSelectProject(value, listAllProject)}
                        >
                          {newListProject
                            .filter(item => item._id === -1)
                            .map(p => (
                              <Option key={p._id} value={p._id}>
                                {p.name}
                              </Option>
                            ))}
                          {!searchProject && (
                            <OptGroup label={formatMessage({ id: 'common.recently' })}>
                              {listProjectRecently.map(t => (
                                <Option key={t} value={t}>
                                  {getProjectName(newListProject, t)}
                                </Option>
                              ))}
                            </OptGroup>
                          )}
                          <OptGroup label="All Project">
                            {newListProject
                              .filter(item => item._id !== -1)
                              .map(p => (
                                <Option key={p._id} value={p._id}>
                                  {p.name}
                                </Option>
                              ))}
                          </OptGroup>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    {projectItem !== -1 && (
                      <Form.Item colon={false} label=" ">
                        {getFieldDecorator('billable', {
                          initialValue: billable,
                          valuePropName: 'checked',
                        })(
                          <Checkbox className={styles.viewCheckbox}>
                            <span className={styles.textCheckBox}>
                              {formatMessage({ id: 'mileage.clientBillable' })}
                            </span>
                          </Checkbox>
                        )}
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label={renderLabel(
                        namePaymentOptionsField,
                        validationPaymentOption,
                        requiredPaymentOptionsField
                      )}
                    >
                      {getFieldDecorator('paymentOption', {
                        initialValue: paymentOptionInit,
                        rules: [
                          {
                            validator: requiredPaymentOptionsField
                              ? (rule, value, callback) =>
                                  checkMileageConfigField('paymentOption', rule, value, callback)
                              : () => true,
                          },
                        ],
                      })(
                        <Select
                          placeholder={placeholderPaymentOptionsField}
                          className={validationPaymentOption ? styles.selectFail : styles.select}
                          showSearch
                          onChange={value => {
                            if (
                              getAllPersonalPaymentName(listPaymentOptionsPersonal).indexOf(value) >
                              -1
                            ) {
                              setFieldsValue({ reimbursable: true });
                            } else {
                              setFieldsValue({ reimbursable: false });
                            }
                          }}
                        >
                          <OptGroup label={formatMessage({ id: 'mileage.personal' })}>
                            {listPaymentOptionsPersonal.map(item => (
                              <Option key={item.key} value={item.name}>
                                {item.name}
                              </Option>
                            ))}
                          </OptGroup>
                          <OptGroup label={formatMessage({ id: 'mileage.company' })}>
                            {listPaymentOptionsCompany.map(item => (
                              <Option key={item.key} value={item.name}>
                                {item.name}
                              </Option>
                            ))}
                          </OptGroup>
                        </Select>
                      )}
                    </Form.Item>
                    {paymentType === 'company credit card' && (
                      <Form.Item
                        label={
                          <span className={styles.mileageLabel}>
                            {formatMessage({ id: 'mileage.creditCardNumber' })}
                          </span>
                        }
                      >
                        {getFieldDecorator('creditCard', {
                          initialValue: creditCard && creditCard._id,
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'bill.creditCard.required' }),
                            },
                          ],
                        })(
                          <Select
                            placeholder={formatMessage({ id: 'creditCard.select.placeholder' })}
                            className={styles.select}
                            showSearch
                          >
                            <OptGroup label="All Cards">
                              {listCard.map(item => (
                                <Option key={item._id} value={item._id}>
                                  {getCardType(item.lastFourDigits)}
                                </Option>
                              ))}
                            </OptGroup>
                          </Select>
                        )}
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label={renderLabel(nameTagField, validationTag, requiredTagField)}>
                      {getFieldDecorator('tag', {
                        initialValue: tagInit ? tagInit._id : undefined,
                        rules: [
                          {
                            validator: requiredTagField
                              ? (rule, value, callback) =>
                                  checkMileageConfigField('tag', rule, value, callback)
                              : () => true,
                          },
                        ],
                      })(
                        <Select
                          placeholder={placeholderTagField}
                          className={styles.select}
                          showSearch
                          onSearch={value => onSearchTag(value)}
                          suffixIcon={iconAddTag}
                          filterOption={false}
                        >
                          {listTagDisplay.map(p => (
                            <Option key={p._id} value={p._id}>
                              {p.groupName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ display: 'none' }}>
                  <Form.Item>
                    {getFieldDecorator('reimbursable', {
                      initialValue: reimbursable,
                      valuePropName: 'checked',
                    })(
                      <Checkbox className={styles.viewCheckbox}>
                        <span className={styles.textCheckBox}>
                          <FormattedMessage id="common.reimbursable" />
                        </span>
                      </Checkbox>
                    )}
                  </Form.Item>
                </Row>
                <Modal
                  className={styles.deleteModal}
                  visible={visibaleDelPop}
                  onOk={handleDelete}
                  onCancel={() => setVisibaleDelPop(false)}
                  cancelText={formatMessage({ id: 'bill.cancel' })}
                  okText={formatMessage({ id: 'bill.delete' })}
                  closable={false}
                >
                  <div className={styles.deleteTitle}>
                    {`${formatMessage({
                      id: 'mileage.deleteMileage',
                    })}?`}
                  </div>
                  <div>{formatMessage({ id: 'bill.delete.line1' })}</div>
                  <div>{`${formatMessage({ id: 'bill.delete.line3' })}?`}</div>
                </Modal>
              </Form>
            </Col>
            <Col
              sm={12}
              xs={24}
              className={styles.wrapRightContent}
              style={{ paddingLeft: '27px', paddingRight: '27px', minWidth: '360px' }}
            >
              <Row>
                <Col span={24}>
                  <span className={styles.mileageLabel}>
                    {formatMessage({ id: 'mileage.travelMapTitle' })}
                  </span>

                  {googleMapList.origin && googleMapList.destination && googleMapList.waypoints ? (
                    <div className={styles.googleMapArea} style={{ padding: '0 !important' }}>
                      <GoogleMap
                        {...googleMapList}
                        onChange={handleGoogleMapChange}
                        distanceUnit={vehicleType.distanceUnit || 'km'}
                      />
                    </div>
                  ) : (
                    <div className={styles.googleMapAreaSpan}>
                      <span className={styles.googleMapPlaceHoder}>
                        {formatMessage({ id: 'mileage.googleMapPlaceHoder' })}
                      </span>
                    </div>
                  )}
                </Col>
              </Row>
              <Form.Item>
                <Row gutter={12} className={styles.wrapGroupBtnAction}>
                  <Col>
                    {!isShowDelButton() ? (
                      <Button
                        type="primary"
                        loading={submitSave}
                        className={styles.btnAdd}
                        onClick={() => {
                          if (checkPath) {
                            handleSubmitForm();
                          } else {
                            handleEditForm();
                          }
                        }}
                      >
                        <FormattedMessage id="mileage.save" />
                      </Button>
                    ) : (
                      <Dropdown.Button
                        type="primary"
                        onClick={() => handleEditForm(false)}
                        icon={<Icon type="down" />}
                        overlay={menuEditButton}
                      >
                        <FormattedMessage id="common.save">
                          {txt => txt.toUpperCase()}
                        </FormattedMessage>
                      </Dropdown.Button>
                    )}
                  </Col>
                  <Col>
                    {checkPath ? (
                      <Button
                        loading={submitSave}
                        className={styles.saveNNewBtn}
                        onClick={() => handleSubmitForm(true)}
                      >
                        <FormattedMessage id="mileage.save-and-new" />
                      </Button>
                    ) : (
                      <Link to="/expense">
                        <Button className={styles.saveNNewBtn}>
                          {formatMessage({ id: 'mileage.cancel' }).toUpperCase()}
                        </Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        )}
      </div>
    </PageLoading>
  );
};

const AddNew = Form.create({ name: 'add_new_mileage_form' })(
  connect(
    ({
      creditCard: { listCard = [] },
      tag: { listGroup: listTag = [] },
      project: { listProject },
      loading,
      currency,
      user: { currentUser },
      appSetting: { mileageTypeRate, paymentOptions = {}, mileage = {} } = {},
      bill: { item } = {},
    }) => ({
      mileage,
      paymentOptions,
      listCard,
      listTag,
      listProject,
      currency,
      currentUser,
      loading: loading.effects['currency/fetch'],
      loadingEdit: loading.effects['bill/save'],
      fetchingAppSettings: loading.effects['appSetting/fetchByLocation'],
      mileageTypeRate,
      item,
      submitSave: loading.effects['bill/submit'],
    })
  )(AddNewFormComponent)
);
export default AddNew;
