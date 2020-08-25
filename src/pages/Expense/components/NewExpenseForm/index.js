/* eslint-disable no-param-reassign */
import React, { Component, Fragment } from 'react';
import numeral from 'numeral';
import {
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  DatePicker,
  Checkbox,
  Icon,
  Spin,
  Dropdown,
  Menu,
  Modal,
  Skeleton,
  notification,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import moment from 'moment';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Debounce } from 'lodash-decorators/debounce';
import ImagesUpload from '@/components/ImagesUpload';
import InputNumber from '@/components/InputNumber';
import styles from './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const noneProject = { name: 'None', _id: -1, status: 'ACTIVE' };
const formatDate = 'MMM D, YYYY';
const creditCardType = require('credit-card-type');

@Form.create()
@connect(
  ({
    project: { listProject },
    exchangeRate = {},
    currency = {},
    loading,
    user: { currentUser },
    creditCard: { listCard = [] },
    googleMap: { list: listLocation = [], detail = {} },
    appSetting: {
      expenseType: { dynamic: listCategory = [] } = {},
      expense = {},
      paymentOptions = {},
    } = {},
    tag: { listGroup: listTag = [] },
    bill: { item: itemBill = {} },
  }) => ({
    listProject,
    currency,
    exchangeRate,
    currentUser,
    listCategory,
    expense,
    paymentOptions,
    listLocation,
    detail,
    listTag,
    fetchingAppSettings: loading.effects['appSetting/fetchByLocation'],
    fetchingRate: loading.effects['exchangeRate/fetchRateByDate'],
    submitSave: loading.effects['bill/submit'],
    loadingTag: loading.effects['tag/createGroup'],
    loadingEdit: loading.effects['bill/updateExpense'],
    fetchingItemBill: loading.effects['bill/fetchItem'],
    listCard,
    itemBill,
  })
)
class NewExpense extends Component {
  constructor(props) {
    const {
      currentUser: {
        location: { currency: { _id: myCurrency = '' } = {}, _id: myLocationID = '' } = {},
      } = {},
    } = props;
    super(props);
    this.state = {
      searchType: '',
      listRecently: [],
      searchProject: '',
      searchTag: '',
      listProjectRecently: [],
      total: 0,
      myCurrency,
      myLocationID,
      typeSelected: {},
      validitionProject: false,
      validationCategory: false,
      validationAmount: false,
      validationPaymentOption: false,
      validationTag: false,
      projectSelected: {},
      visibleDelete: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { reId } = {} },
    } = this.props;
    const { myCurrency, myLocationID } = this.state;
    const list = localStorage.getItem('recentlyTypes');
    const listProjectRecently = localStorage.getItem('recentlyProject');
    if (list !== null) {
      this.setState({
        listRecently: JSON.parse(list),
        listProjectRecently: JSON.parse(listProjectRecently),
      });
    }
    dispatch({ type: 'bill/fetchItem', payload: reId });
    dispatch({ type: 'tag/fetchGroup' });
    dispatch({ type: 'creditCard/fetchForEmployee' });
    dispatch({ type: 'appSetting/fetchByLocation', payload: { location: myLocationID } });
    dispatch({ type: 'project/fetch', payload: { location: myLocationID } });
    dispatch({
      type: 'exchangeRate/fetchRateByDate',
      payload: {
        date: moment(Date.now()).format('YYYY-MM-DD'),
        fr: myCurrency,
        to: myCurrency,
      },
    });
    dispatch({ type: 'currency/fetch' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'exchangeRate/save', payload: { rate: {} } });
    dispatch({ type: 'bill/save', payload: { item: {} } });
  }

  createValueByCategory = value => {
    const {
      expense: { busAndTrain = [], flightOneWay = [], flightRoundTrip = [], hotel = [] },
    } = this.props;
    switch (value) {
      case 'Bus or Train':
        return this.handleSubmitFormChildren(busAndTrain);
      case 'Airfare one way':
        return this.handleSubmitFormChildren(flightOneWay);
      case 'Airfare roundtrip':
        return this.handleSubmitFormChildren(flightRoundTrip);
      case 'Hotel':
        return this.handleSubmitFormChildren(hotel);
      default:
        return null;
    }
  };

  handleSubmitCustomField = list => {
    let newValue = {};
    const { form } = this.props;
    const listObjectIsText = list.filter(item => item.fieldType === 'text');
    const listFieldIsText = listObjectIsText.map(i => i.key);
    const listObjectIsLocation = list.filter(item => item.fieldType === 'location');
    const listFieldIsLocation = listObjectIsLocation.map(i => i.key);
    const listObjectIsDate = list.filter(item => item.fieldType === 'date');
    const listFieldIsDate = listObjectIsDate.map(i => i.key);
    const listObjectIsNumber = list.filter(item => item.fieldType === 'number');
    const listFieldIsNumber = listObjectIsNumber.map(i => i.key);
    const listObjectIsBoolean = list.filter(item => item.fieldType === 'boolean');
    const listFieldIsBoolean = listObjectIsBoolean.map(i => i.key);
    let valuesIsDate = [];
    let valuesIsText = [];
    let valuesIsLocation = [];
    let valuesIsNumber = [];
    let valuesIsBoolean = [];
    form.validateFields(listFieldIsDate, (err, values) => {
      if (!err) {
        listFieldIsDate.forEach(e => {
          valuesIsDate = [
            {
              key: e,
              value: moment(values[e]).format('YYYY-MM-DD[T]HH:mm:ss'),
            },
            ...valuesIsDate,
          ];
        });
      }
    });
    form.validateFields(listFieldIsNumber, (err, values) => {
      if (!err) {
        listFieldIsNumber.forEach(n => {
          valuesIsNumber = [{ key: n, value: numeral(values[n])._value }, ...valuesIsNumber];
        });
      }
    });
    form.validateFields(listFieldIsText, (err, values) => {
      if (!err) {
        listFieldIsText.forEach(n => {
          valuesIsText = [{ key: n, value: values[n] }, ...valuesIsText];
        });
      }
    });
    form.validateFields(listFieldIsBoolean, (err, values) => {
      if (!err) {
        listFieldIsBoolean.forEach(n => {
          valuesIsBoolean = [{ key: n, value: values[n] }, ...valuesIsBoolean];
        });
      }
    });
    listFieldIsLocation.forEach(e => {
      valuesIsLocation = [
        {
          key: e,
          // eslint-disable-next-line react/destructuring-assignment
          value: this.state[e],
        },
        ...valuesIsLocation,
      ];
    });
    newValue = [
      ...valuesIsLocation,
      ...valuesIsText,
      ...valuesIsDate,
      ...valuesIsNumber,
      ...valuesIsBoolean,
    ];
    return newValue;
  };

  handleSubmitFormChildren = list => {
    let newValue = {};
    const { form } = this.props;
    const listObjectIsText = list.filter(item => item.fieldType === 'text');
    const listFieldIsText = listObjectIsText.map(i => i.key);
    const listObjectIsLocation = list.filter(item => item.fieldType === 'location');
    const listFieldIsLocation = listObjectIsLocation.map(i => i.key);
    const listObjectIsDate = list.filter(item => item.fieldType === 'date');
    const listFieldIsDate = listObjectIsDate.map(i => i.key);
    const listObjectIsNumber = list.filter(item => item.fieldType === 'number');
    const listFieldIsNumber = listObjectIsNumber.map(i => i.key);
    const listObjectIsBoolean = list.filter(item => item.fieldType === 'boolean');
    const listFieldIsBoolean = listObjectIsBoolean.map(i => i.key);
    let valuesIsDate = {};
    let valuesIsText = {};
    let valuesIsLocation = {};
    let valuesIsNumber = {};
    let valuesIsBoolean = {};
    form.validateFields(listFieldIsDate, (err, values) => {
      if (!err) {
        listFieldIsDate.forEach(e => {
          valuesIsDate = {
            [e]: moment(values[e]).format('YYYY-MM-DD[T]HH:mm:ss'),
            ...valuesIsDate,
          };
        });
      }
    });
    form.validateFields(listFieldIsNumber, (err, values) => {
      if (!err) {
        listFieldIsNumber.forEach(n => {
          valuesIsNumber = {
            [n]: numeral(values[n])._value,
            ...valuesIsNumber,
          };
        });
      }
    });
    form.validateFields(listFieldIsText, (err, values) => {
      if (!err) {
        valuesIsText = { ...values };
      }
    });
    form.validateFields(listFieldIsBoolean, (err, values) => {
      if (!err) {
        valuesIsBoolean = { ...values };
      }
    });
    listFieldIsLocation.forEach(e => {
      valuesIsLocation = {
        // eslint-disable-next-line react/destructuring-assignment
        [e]: this.state[e],
        ...valuesIsLocation,
      };
    });
    newValue = {
      ...valuesIsLocation,
      ...valuesIsText,
      ...valuesIsDate,
      ...valuesIsNumber,
      ...valuesIsBoolean,
    };
    return newValue;
  };

  handleSubmitForm = (saveAndNew, listType) => {
    const {
      form,
      dispatch,
      expense: { custom = [] },
    } = this.props;
    const {
      listRecently = [],
      listProjectRecently = [],
      myCurrency,
      typeSelected,
      projectSelected,
    } = this.state;
    const { getFieldValue } = form;
    const category = typeSelected.type;
    const valueCategory = getFieldValue('category');
    const objectCategoryOfCustomField =
      valueCategory && listType.find(item => item.name === valueCategory);
    const listCustomFieldByCategory =
      objectCategoryOfCustomField &&
      custom.filter(i => i.category === objectCategoryOfCustomField.name);
    const valuesCustomField =
      valueCategory && this.handleSubmitCustomField(listCustomFieldByCategory);
    const valueByCategory = this.createValueByCategory(valueCategory);
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        originCurrency,
        originAmount,
        exchangeRate = 1,
        amount = originAmount,
        description,
        date,
        merchant,
        billable,
        paymentOptions,
        creditCard,
        tag,
        images,
        reimbursable,
        distance,
        distanceUnit,
      } = values;
      const valueTaxi = { distance: numeral(distance)._value, distanceUnit };
      const formData = {
        images,
        category,
        date: date.toDate().toString(),
        amount: numeral(amount)._value,
        description,
        reimbursable,
        originAmount: numeral(originAmount)._value,
        originCurrency,
        exchangeRate,
        currency: myCurrency,
        merchant,
        type: !typeSelected.name ? undefined : typeSelected,
        project: projectSelected.isSubProject ? projectSelected._idParent : projectSelected._id,
        billable,
        tag: !tag ? undefined : tag,
        paymentOption: paymentOptions,
        creditCard,
        taxi: valueCategory === 'Cab or Taxi' ? { ...valueTaxi } : undefined,
        hotel: valueCategory === 'Hotel' ? { ...valueByCategory } : undefined,
        flightOneWay: valueCategory === 'Airfare one way' ? { ...valueByCategory } : undefined,
        flightRoundTrip: valueCategory === 'Airfare roundtrip' ? { ...valueByCategory } : undefined,
        bus: valueCategory === 'Bus or Train' ? { ...valueByCategory } : undefined,
        customField: [...valuesCustomField],
        subProjectName: projectSelected.subProjectName,
        subProject: projectSelected.isSubProject,
      };
      // Add type selected to local storage
      const newListRecently = [values.category, ...listRecently];
      const listFilter = newListRecently.filter(
        (value, index, self) => self.findIndex(s => s === value) === index
      );
      if (listFilter.length > 3) {
        listFilter.pop();
      }
      localStorage.setItem('recentlyTypes', JSON.stringify(listFilter));
      const checkData = true;
      // Add project selected to local storage
      let listFilterProject = [];
      if (values.project !== -1) {
        const newListprojectRecently = [values.project, ...listProjectRecently];
        listFilterProject = newListprojectRecently.filter(
          (value, index, self) => self.findIndex(s => s === value) === index
        );
        if (listFilterProject.length > 3) {
          listFilterProject.pop();
        }
      } else {
        listFilterProject = [...listProjectRecently];
      }
      localStorage.setItem('recentlyProject', JSON.stringify(listFilterProject));
      if (images.length === 0) {
        this.openNotification();
      } else {
        dispatch({ type: 'bill/submit', payload: { formData, saveAndNew, checkData } });
      }
    });
  };

  compareObjectByCategory = (objectValueEdit, objectValueFromItemBill) => {
    const listKeyObjectValueEdit = Object.keys(objectValueEdit);
    let valueAfterCompare = { ...objectValueEdit };
    listKeyObjectValueEdit.forEach(item => {
      if (!objectValueEdit[item]) {
        objectValueEdit[item] = objectValueFromItemBill[item];
        valueAfterCompare = { ...objectValueEdit };
      }
    });
    return valueAfterCompare;
  };

  createCompareValue = (valueByCategory, valueCategory) => {
    const { itemBill } = this.props;
    const { flightRoundTrip = {}, flightOneWay = {}, bus = {}, hotel = {} } = itemBill;
    switch (valueCategory) {
      case 'Bus or Train':
        return this.compareObjectByCategory(valueByCategory, bus);
      case 'Airfare one way':
        return this.compareObjectByCategory(valueByCategory, flightOneWay);
      case 'Airfare roundtrip':
        return this.compareObjectByCategory(valueByCategory, flightRoundTrip);
      case 'Hotel':
        return this.compareObjectByCategory(valueByCategory, hotel);
      default:
        return null;
    }
  };

  compareValueCustomField = (customFieldEdit, customFieldItemBill) => {
    customFieldEdit.forEach(item => {
      customFieldItemBill.forEach(e => {
        if (item.value === undefined) {
          item.value = e.value;
        }
      });
      return customFieldEdit;
    });
  };

  handleEditForm = (saveAndNew, listType) => {
    const {
      form,
      dispatch,
      itemBill: { customField: customFieldItemBill = [], type: typeItemBill = {} },
      expense: { custom = [] },
      match: { params: { reId } = {} },
    } = this.props;
    const {
      listRecently = [],
      listProjectRecently = [],
      myCurrency,
      typeSelected,
      projectSelected,
    } = this.state;
    const { getFieldValue } = form;
    const category = typeSelected.type;
    const valueCategory = getFieldValue('category');
    const objectCategoryOfCustomField =
      valueCategory && listType.find(item => item.name === valueCategory);
    const listCustomFieldByCategory =
      objectCategoryOfCustomField &&
      custom.filter(i => i.category === objectCategoryOfCustomField.name);
    const valuesCustomField =
      valueCategory && this.handleSubmitCustomField(listCustomFieldByCategory);
    const valueByCategory = this.createValueByCategory(valueCategory);
    const compareValue = this.createCompareValue(valueByCategory, valueCategory);
    this.compareValueCustomField(valuesCustomField, customFieldItemBill);
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        originCurrency,
        originAmount,
        exchangeRate = 1,
        amount = originAmount,
        description,
        date,
        merchant,
        billable,
        paymentOptions,
        creditCard,
        tag,
        images,
        reimbursable,
        distance,
        distanceUnit,
      } = values;
      const valueTaxi = { distance: numeral(distance)._value, distanceUnit };
      const formData = {
        expenseID: reId,
        images,
        category,
        date: date.toDate().toString(),
        amount: numeral(amount)._value,
        description,
        reimbursable,
        originAmount: numeral(originAmount)._value,
        originCurrency,
        exchangeRate,
        currency: myCurrency,
        merchant,
        type: !typeSelected.name ? typeItemBill : typeSelected,
        project: projectSelected.isSubProject ? projectSelected._idParent : projectSelected._id,
        billable,
        tag: !tag ? undefined : tag,
        paymentOption: paymentOptions,
        creditCard,
        taxi: valueCategory === 'Cab or Taxi' ? { ...valueTaxi } : undefined,
        hotel: valueCategory === 'Hotel' ? { ...compareValue } : undefined,
        flightOneWay: valueCategory === 'Airfare one way' ? { ...compareValue } : undefined,
        flightRoundTrip: valueCategory === 'Airfare roundtrip' ? { ...compareValue } : undefined,
        bus: valueCategory === 'Bus or Train' ? { ...compareValue } : undefined,
        customField: [...valuesCustomField],
        subProjectName: projectSelected.subProjectName,
        subProject: projectSelected.isSubProject,
      };
      // Add type selected to local storage
      const newListRecently = [values.category, ...listRecently];
      const listFilter = newListRecently.filter(
        (value, index, self) => self.findIndex(s => s === value) === index
      );
      if (listFilter.length > 3) {
        listFilter.pop();
      }
      localStorage.setItem('recentlyTypes', JSON.stringify(listFilter));

      // Add project selected to local storage
      let listFilterProject = [];
      if (values.project !== -1) {
        const newListprojectRecently = [values.project, ...listProjectRecently];
        listFilterProject = newListprojectRecently.filter(
          (value, index, self) => self.findIndex(s => s === value) === index
        );
        if (listFilterProject.length > 3) {
          listFilterProject.pop();
        }
      } else {
        listFilterProject = [...listProjectRecently];
      }
      localStorage.setItem('recentlyProject', JSON.stringify(listFilterProject));
      const data = _.pickBy(formData, _.identity);
      const newData = { ...data, billable, reimbursable };
      if (images.length === 0) {
        this.openNotification();
      } else {
        dispatch({ type: 'bill/updateExpense', payload: { newData } });
      }
    });
  };

  closeDelete = () => {
    this.setState({ visibleDelete: false });
  };

  openDelete = () => {
    this.setState({ visibleDelete: true });
  };

  handleDelete = () => {
    const {
      dispatch,
      match: { params: { reId } = {} },
    } = this.props;
    dispatch({ type: 'bill/deleteExpense', payload: { expenseID: reId } });
  };

  checkAmount = (rule, amount, callback) => {
    let msg;
    const filter = [
      v => ({
        check: !v,
        message: formatMessage({ id: 'bill.required.amount' }),
      }),
      () => ({
        check: amount < 0.0001,
        message: formatMessage({ id: 'bill.min.amount' }),
      }),
      () => ({
        check: !amount || amount < 0,
        message: formatMessage({ id: 'bill.required.originalAmount' }),
      }),
      () => ({
        check: amount > 100000000000,
        message: formatMessage({ id: 'bill.max.amount' }, { max: 10000000000 }),
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(amount);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      this.setState({
        validationAmount: false,
      });
    } else {
      this.setState({
        validationAmount: true,
      });
    }
    callback(msg);
  };

  checkProject = (rule, itemProject, callback) => {
    let msg;
    const filter = [
      () => ({
        check: itemProject === -1,
        message: 'Project must be provide',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(itemProject);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      this.setState({
        validitionProject: false,
      });
    } else {
      this.setState({
        validitionProject: true,
      });
    }
    callback(msg);
  };

  checkTag = (rule, item, callback) => {
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: 'Tag must be provide',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      this.setState({
        validationTag: false,
      });
    } else {
      this.setState({
        validationTag: true,
      });
    }
    callback(msg);
  };

  checkCategory = (rule, item, callback) => {
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: 'Catgory must be provide',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      this.setState({
        validationCategory: false,
      });
    } else {
      this.setState({
        validationCategory: true,
      });
    }
    callback(msg);
  };

  checkPaymentOption = (rule, item, callback) => {
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: 'Payment option must be provide',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      this.setState({
        validationPaymentOption: false,
      });
    } else {
      this.setState({
        validationPaymentOption: true,
      });
    }
    callback(msg);
  };

  // checkTextField = (rule, item, name, text, callback) => {
  //   let msg;
  //   const filter = [
  //     () => ({
  //       check: !item,
  //       message: `${name} must be provide`,
  //     }),
  //   ];
  //   const result = filter.some(fc => {
  //     const { check, message } = fc(item);
  //     msg = message;
  //     return check;
  //   });
  //   if (!result) {
  //     msg = undefined;
  //     this.setState({
  //       [text]: false,
  //     });
  //   } else {
  //     this.setState({
  //       [text]: true,
  //     });
  //   }
  //   callback(msg);
  // };

  fetchRate = async () => {
    const { dispatch, form } = this.props;
    const { myCurrency } = this.state;
    const selectedCurrency = await form.getFieldValue('originCurrency');
    const selectedDate = await form.getFieldValue('date');
    const originAmount = await form.getFieldValue('originAmount');
    await dispatch({
      type: 'exchangeRate/fetchRateByDate',
      payload: {
        date: moment(selectedDate).format('YYYY-MM-DD'),
        fr: selectedCurrency,
        to: myCurrency,
      },
    }).then(val => {
      form.setFieldsValue({ exchangeRate: val });
      this.setState({
        total: numeral(originAmount * val).format('0,0[.]00'),
      });
    });
  };

  changeInputAmount = value => {
    const { form } = this.props;
    const exRate = form.getFieldValue('exchangeRate');
    this.setState({
      total: numeral(value * exRate).format('0,0[.]00'),
    });
  };

  onSearchType = value => {
    this.setState({ searchType: value });
  };

  onSelectType = (value, listType) => {
    const { dispatch, form } = this.props;
    const itemTypeSelected = listType.find(item => item.name === value);
    const { setFieldsValue } = form;
    setFieldsValue({ from: undefined });
    setFieldsValue({ to: undefined });
    dispatch({ type: 'googleMap/save', payload: { list: [], detail: {} } });
    this.setState({ searchType: '', typeSelected: itemTypeSelected });
  };

  onSearchProject = value => {
    this.setState({ searchProject: value });
  };

  onSelectProject = (value, list) => {
    const { form } = this.props;
    if (value !== -1) {
      form.setFieldsValue({ billable: true });
    }
    const projectSelected = (value !== -1 && list.find(item => item._id === value)) || {};
    this.setState({
      searchProject: '',
      projectSelected,
    });
  };

  getTypeName = (list, name) => {
    const result = list.find(i => i.name === name);
    return result && result.name;
  };

  getProjectName = (list, id) => {
    const result = list.find(i => i._id === id);
    return result && result.name;
  };

  handleChangeLocation = (value, nameField) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'googleMap/fetchDetail',
      payload: { placeid: value },
    }).then(detail =>
      this.setState({
        [nameField]: detail,
      })
    );
  };

  createListType = listCategory => {
    let newList = [];
    listCategory.forEach(item => {
      const subList = item.children.map(subItem => ({
        ...subItem,
        name: `${item.name} / ${subItem.name}`,
        type: item.type,
      }));
      newList = [...newList, item, ...subList];
      newList = newList.sort((first, next) => first.name.localeCompare(next.name));
    });
    return newList;
  };

  createListAllProject = list => {
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

  onSearchTag = value => {
    this.setState({
      searchTag: value,
    });
  };

  addNewTag = () => {
    const { dispatch, form } = this.props;
    const { searchTag } = this.state;
    dispatch({
      type: 'tag/createGroup',
      payload: { groupName: searchTag },
    }).then(data => {
      form.setFieldsValue({ tag: data._id });
      this.setState({
        searchTag: '',
      });
    });
  };

  renderLabel = (name, check, required) => {
    return (
      <Fragment>
        <span className={!check ? styles.label : styles.labelFail}>{name}</span>
        <span
          style={!required ? { display: 'none' } : undefined}
          className={!check ? styles.required : styles.requiredFail}
        >
          *
        </span>
      </Fragment>
    );
  };

  getInitialValue = (value, key) => {
    let initialValue = value;
    if (typeof value === 'object') {
      initialValue = value[key];
    }
    if (value instanceof Array) {
      const a = value.find(item => item.key === key);
      initialValue = a && a.value;
    }
    return initialValue;
  };

  renderLocationField = (item, widthCol, valueForm) => {
    const { form, listLocation } = this.props;
    const { key, name, placeholder, required } = item;
    const initialValue = this.getInitialValue(valueForm, key);
    const { getFieldDecorator } = form;
    return (
      <Col span={widthCol || 12}>
        <FormItem label={this.renderLabel(name, false, required)}>
          {getFieldDecorator(key, {
            initialValue: initialValue && initialValue.address,
            rules: [
              {
                required,
                message: `${name} must be provide`,
              },
            ],
          })(
            <Select
              placeholder={placeholder}
              className={styles.select}
              showSearch
              notFoundContent={null}
              showArrow={false}
              onSearch={value => this.searchLocation(value)}
              onChange={value => this.handleChangeLocation(value, key)}
              defaultActiveFirstOption={false}
              filterOption={false}
            >
              {listLocation.map(t => (
                <Option key={t.id} value={t.place_id}>
                  {t.description}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  renderTextField = (item, widthCol, value) => {
    const { form } = this.props;
    const { key, name, placeholder, required } = item;
    const { getFieldDecorator } = form;
    const initialValue = this.getInitialValue(value, key);
    return (
      <Col span={widthCol || 12}>
        <FormItem label={this.renderLabel(name, false, required)}>
          {getFieldDecorator(key, {
            initialValue,
            rules: [
              {
                required,
                message: `${name} must be provide`,
              },
            ],
          })(<Input placeholder={placeholder} className={styles.input} />)}
        </FormItem>
      </Col>
    );
  };

  renderBooleanField = (item, widthCol, value) => {
    const { form } = this.props;
    const { key, name } = item;
    const { getFieldDecorator } = form;
    const initialValue = this.getInitialValue(value, key);
    return (
      <Col span={widthCol || 12}>
        <FormItem>
          {getFieldDecorator(key, {
            initialValue,
            valuePropName: 'checked',
          })(<Checkbox className={styles.viewCheckbox}>{name}</Checkbox>)}
        </FormItem>
      </Col>
    );
  };

  renderNumberField = (item, widthCol, value) => {
    const { form } = this.props;
    const { key, name, placeholder, required } = item;
    const initialValue = this.getInitialValue(value, key);
    const { getFieldDecorator } = form;
    return (
      <Col span={widthCol || 12}>
        <FormItem label={this.renderLabel(name, false, required)}>
          {getFieldDecorator(key, {
            initialValue,
            rules: [
              {
                required,
                message: `${name} must be provide`,
              },
            ],
          })(<InputNumber className={styles.input} placeholder={placeholder} />)}
        </FormItem>
      </Col>
    );
  };

  renderDateField = (item, widthCol, value) => {
    const { form } = this.props;
    const { key, name, placeholder, required } = item;
    const { getFieldDecorator } = form;
    const initialValue = this.getInitialValue(value, key);
    return (
      <Col span={widthCol || 12}>
        <FormItem label={this.renderLabel(name, false, required)}>
          {getFieldDecorator(key, {
            initialValue: initialValue && moment(new Date(`${initialValue}`)),
            rules: [
              {
                required,
                message: `${name} must be provide`,
              },
            ],
          })(
            <DatePicker
              placeholder={placeholder}
              className={styles.date}
              style={{ width: '100%' }}
              format={formatDate}
            />
          )}
        </FormItem>
      </Col>
    );
  };

  renderComponent = (list, widthCol, value) => {
    return list.map(i => {
      switch (i.fieldType) {
        case 'boolean':
          return this.renderBooleanField(i, widthCol, value);
        case 'date':
          return this.renderDateField(i, widthCol, value);
        case 'text':
          return this.renderTextField(i, widthCol, value);
        case 'number':
          return this.renderNumberField(i, widthCol, value);
        case 'location':
          return this.renderLocationField(i, widthCol, value);
        default:
          return null;
      }
    });
  };

  renderDefaultField = key => {
    const {
      expense: { default: defaultField = [] },
    } = this.props;
    let fieldByKey = {};
    if (defaultField.length > 0) {
      fieldByKey = defaultField.find(i => i.key === key);
    }
    return fieldByKey;
  };

  openNotification = () => {
    notification.error({
      message: formatMessage({ id: 'common.policyViolation' }),
      description: formatMessage({ id: 'common.contentPolicyViolation' }),
    });
  };

  getCardType = number => {
    const cardType = creditCardType(number);
    let nameType = number;
    if (cardType.length > 0) {
      nameType = `${cardType[0].niceType} - ${number}`;
    }
    return nameType;
  };

  @Debounce(600)
  searchLocation = input => {
    if (typeof input === 'string' && input.length < 2) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'googleMap/searchLocation',
      payload: { input },
    });
  };

  render() {
    const {
      match: { path },
      form,
      currency: { list: listCurrency = [] },
      exchangeRate: { val = '' },
      listProject = [],
      listCard,
      fetchingRate,
      listCategory,
      listTag,
      submitSave,
      expense: {
        custom = [],
        busAndTrain = [],
        flightOneWay = [],
        flightRoundTrip = [],
        taxi = [],
        hotel = [],
      },
      paymentOptions: { personal = [], company = [] },
      fetchingAppSettings,
      loadingTag,
      itemBill,
      fetchingItemBill,
      loadingEdit,
    } = this.props;
    const checkPath = path === '/expense/newexpense';
    const {
      searchType,
      listRecently = [],
      searchProject,
      listProjectRecently = [],
      total,
      myCurrency,
      searchTag,
      validitionProject,
      validationCategory,
      validationAmount,
      validationPaymentOption,
      validationTag,
      visibleDelete,
    } = this.state;
    const listPaymentOptionsPersonal = personal.filter(i => i.name !== 'Personal');
    const listPaymentOptionsCompany = company.filter(i => i.name !== 'company');
    const purposeField = this.renderDefaultField('purpose');
    const changeKeyPurpose = [{ ...purposeField, key: 'description' }];
    const merchantField = [this.renderDefaultField('merchant')];
    const projectField = this.renderDefaultField('project');
    const {
      key: keyProjectField = 'project',
      name: nameProjectField = '',
      placeholder: placeholderProjectField = '',
      required: requiredProjectField,
    } = projectField;
    const categoryField = this.renderDefaultField('category');
    const {
      key: keyCategoryField = 'category',
      name: nameCategoryField = '',
      placeholder: placeholderCategoryField = '',
      required: requiredCategoryField,
    } = categoryField;
    const paymentOptionsField = this.renderDefaultField('paymentOptions');
    const {
      key: keyPaymentOptionsField = 'paymentOptions',
      name: namePaymentOptionsField = '',
      placeholder: placeholderPaymentOptionsField = '',
      required: requiredPaymentOptionsField,
    } = paymentOptionsField;
    const tagField = this.renderDefaultField('tag');
    const {
      key: keyTagField = 'tag',
      name: nameTagField = '',
      placeholder: placeholderTagField = '',
      required: requiredTagField,
    } = tagField;

    const listTagDisplay = searchTag
      ? listTag.filter(
          item =>
            item.groupName && item.groupName.toLowerCase().indexOf(searchTag.toLowerCase()) > -1
        )
      : listTag;

    const {
      originCurrency,
      originAmount = 0,
      exchangeRate,
      amount,
      description,
      merchant,
      type: typeItemBill = {},
      paymentOption,
      tag,
      images = [],
      taxi: { distance = 0, distanceUnit = 'km' } = {},
      reimbursable = true,
      billable = true,
      creditCard,
      project = noneProject,
      flightRoundTrip: flightRoundTripItemBill = {},
      flightOneWay: flightOneWayItemBill = {},
      bus: busItemBill = {},
      hotel: hotelItemBill = {},
      customField: customFieldItemBill = [],
      subProjectName: subProjectNameItemBill,
      date,
    } = itemBill || {};

    const idProjectItemBill = subProjectNameItemBill && `${project._id}${subProjectNameItemBill}`;
    const checkIdProject = subProjectNameItemBill ? idProjectItemBill : project._id;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const paymentType = getFieldValue('paymentOptions');
    const projectItem = getFieldValue('project');
    const valueCategory = getFieldValue('category');
    const currencyItem = getFieldValue('originCurrency');
    const listType = this.createListType(listCategory);
    const categoryItemBill = listType.find(item => item.name === typeItemBill.name);
    const idCategoryItemBill = categoryItemBill && categoryItemBill.name;
    const objectCategoryOfCustomField =
      valueCategory && listType.find(item => item.name === valueCategory);
    const listCustomFieldByCategoryItemBill =
      objectCategoryOfCustomField &&
      custom.filter(i => i.category === objectCategoryOfCustomField.name);
    const listAllProject = this.createListAllProject(listProject);
    const newListProject = [noneProject, ...listAllProject];
    const listProjectActive = newListProject.filter(item => item.status === 'ACTIVE');
    const iconAddTag =
      listTagDisplay.length === 0 ? (
        <Icon type="plus" className={styles.btnAddTag} onClick={this.addNewTag} />
      ) : null;
    const listDistanceUnit = [{ value: 'km', name: 'Km' }, { value: 'mi', name: 'Mile' }];
    const renderTaxi = taxi.length > 0 && (
      <Row gutter={24}>
        <Col span={12}>
          <FormItem label={this.renderLabel(`${taxi[0].name}`, false, taxi[0].required)}>
            {getFieldDecorator('distance', {
              initialValue: distance,
              rules: [
                {
                  required: taxi[0].required,
                  message: `${taxi[0].name} must be provide`,
                },
              ],
            })(<InputNumber placeholder={taxi[0].placeholder} className={styles.input} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={this.renderLabel(`${taxi[1].name}`, false, taxi[1].required)}>
            {getFieldDecorator('distanceUnit', {
              initialValue: distanceUnit,
              rules: [
                {
                  required: taxi[1].required,
                  message: `${taxi[1].name} must be provide`,
                },
              ],
            })(
              <Select placeholder={taxi[1].placeholder} className={styles.select}>
                {listDistanceUnit.map(p => (
                  <Option key={p.value} value={p.value}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    );
    const menu = (
      <Menu className={styles.menu} onClick={this.openDelete}>
        <Menu.Item key="1">Delete Expense</Menu.Item>
      </Menu>
    );

    const isShowDelButton = () => {
      if (path === '/expense/newexpense') {
        return false;
      }
      if (itemBill && itemBill.report && itemBill.report._id) {
        return false;
      }

      return true;
    };

    const isEditExpenseReport = () => {
      if (itemBill && itemBill.report && itemBill.report._id) {
        return true;
      }
      return false;
    };
    return (
      <Fragment>
        <Row
          gutter={55}
          style={{
            backgroundColor: '#fff',
            padding: '30px 30px 25px',
            minHeight: '90vh',
            boxShadow: '0 2px 4px 0 rgba(180, 180, 180, 0.5)',
            borderRadius: '4px',
          }}
        >
          <Row style={{ paddingLeft: '27.5px' }}>
            <Link to={isEditExpenseReport() ? `/report/view/${itemBill.report._id}` : '/expense'}>
              <p className={styles.mainTitle}>
                <Icon type="left" className={styles.icon} />
                {checkPath ? 'Add Expense' : 'Edit Expense'}
              </p>
            </Link>
          </Row>
          <Form className={styles.root} layout="horizontal">
            <Skeleton loading={checkPath ? fetchingAppSettings : fetchingItemBill} active>
              {itemBill && (
                <Fragment>
                  <Col
                    sm={14}
                    xs={24}
                    className={styles.form1}
                    style={{ minWidth: '630px', marginTop: '40px' }}
                  >
                    <Row gutter={24}>
                      <Col span={5}>
                        <FormItem label={this.renderLabel('Currency', false, true)}>
                          {getFieldDecorator('originCurrency', {
                            initialValue: originCurrency || myCurrency,
                            rules: [
                              {
                                required: true,
                              },
                            ],
                          })(
                            <Select className={styles.select} showSearch onSelect={this.fetchRate}>
                              {listCurrency.length > 0 &&
                                listCurrency.map(p => (
                                  <Option key={p._id} value={p._id}>
                                    {p._id}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={currencyItem === myCurrency ? 19 : 5}>
                        <FormItem label={this.renderLabel('Amount', validationAmount, true)}>
                          {getFieldDecorator('originAmount', {
                            initialValue: originAmount,
                            rules: [
                              {
                                validator: this.checkAmount,
                              },
                            ],
                          })(
                            <InputNumber
                              className={validationAmount ? styles.inputFail : styles.input}
                              onChange={value => this.changeInputAmount(value)}
                            />
                          )}
                        </FormItem>
                      </Col>
                      {currencyItem !== myCurrency && (
                        <Fragment>
                          <Col style={{ marginTop: '55px' }} span={1}>
                            X
                          </Col>
                          <Col span={5}>
                            <FormItem label={this.renderLabel('Ex Rate', false, true)}>
                              {getFieldDecorator('exchangeRate', {
                                initialValue: exchangeRate || val,
                              })(
                                fetchingRate ? (
                                  <Spin size="small" style={{ marginLeft: '50px' }} />
                                ) : (
                                  <Input className={styles.input} readOnly />
                                )
                              )}
                            </FormItem>
                          </Col>
                          <Col style={{ marginTop: '55px', textAlign: 'center' }} span={3}>
                            = {myCurrency}
                          </Col>
                          <Col span={5}>
                            <FormItem label={this.renderLabel('Total', false, true)}>
                              {getFieldDecorator('amount', {
                                initialValue: total || amount,
                              })(
                                fetchingRate && total !== 0 ? (
                                  <Spin size="small" style={{ marginLeft: '50px' }} />
                                ) : (
                                  <Input className={styles.input} readOnly />
                                )
                              )}
                            </FormItem>
                          </Col>
                        </Fragment>
                      )}
                    </Row>
                    <Row gutter={24}>
                      {changeKeyPurpose.length > 0 &&
                        this.renderComponent(changeKeyPurpose, 16, description)}
                      <Col span={8}>
                        <FormItem label={this.renderLabel('Date of Spend', false, true)}>
                          {getFieldDecorator('date', {
                            initialValue: (date && moment(date)) || moment(`${new Date()}`),
                            // initialValue: moment(`${new Date()}`),
                            rules: [
                              {
                                required: true,
                                message: formatMessage({ id: 'bill.required.date' }),
                              },
                            ],
                          })(
                            <DatePicker
                              className={styles.date}
                              style={{ width: '100%' }}
                              onChange={this.fetchRate}
                              format={formatDate}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      {merchantField.length > 0 &&
                        this.renderComponent(merchantField, 24, merchant)}
                    </Row>
                    <Row gutter={24}>
                      <Col span={projectItem === -1 ? 24 : 16}>
                        <FormItem
                          label={this.renderLabel(
                            nameProjectField,
                            validitionProject,
                            requiredProjectField
                          )}
                        >
                          {getFieldDecorator(keyProjectField, {
                            initialValue: checkIdProject || -1,
                            rules: [
                              {
                                validator: requiredProjectField ? this.checkProject : () => true,
                              },
                            ],
                          })(
                            <Select
                              placeholder={placeholderProjectField}
                              className={validitionProject ? styles.selectFail : styles.select}
                              showSearch
                              filterOption={(input, option) =>
                                typeof option.props.children === 'string' &&
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >
                                  -1
                              }
                              onSearch={this.onSearchProject}
                              onSelect={value => this.onSelectProject(value, listAllProject)}
                            >
                              {listProjectActive
                                .filter(item => item._id === -1)
                                .map(p => (
                                  <Option key={p._id} value={p._id}>
                                    {p.name}
                                  </Option>
                                ))}

                              {!searchProject && listProjectRecently.length > 0 && (
                                <OptGroup label={formatMessage({ id: 'common.recently' })}>
                                  {listProjectRecently.map(t => (
                                    <Option key={t} value={t}>
                                      {this.getProjectName(listProjectActive, t)}
                                    </Option>
                                  ))}
                                </OptGroup>
                              )}
                              <OptGroup label="All Project">
                                {listProjectActive
                                  .filter(item => item._id !== -1)
                                  .map(p => (
                                    <Option key={p._id} value={p._id}>
                                      {p.name}
                                    </Option>
                                  ))}
                              </OptGroup>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        {projectItem !== -1 && (
                          <FormItem colon={false} label=" ">
                            {getFieldDecorator('billable', {
                              initialValue: billable,
                              valuePropName: 'checked',
                            })(
                              <Checkbox className={styles.viewCheckbox}>
                                <span className={styles.textCheckBox}>Client Billable</span>
                              </Checkbox>
                            )}
                          </FormItem>
                        )}
                      </Col>
                    </Row>
                    <FormItem
                      label={this.renderLabel(
                        nameCategoryField,
                        validationCategory,
                        requiredCategoryField
                      )}
                    >
                      {getFieldDecorator(keyCategoryField, {
                        initialValue: idCategoryItemBill,
                        rules: [
                          {
                            validator: requiredCategoryField ? this.checkCategory : () => true,
                          },
                        ],
                      })(
                        <Select
                          placeholder={placeholderCategoryField}
                          className={validationCategory ? styles.selectFail : styles.select}
                          onSearch={this.onSearchType}
                          onSelect={value => this.onSelectType(value, listType)}
                          showSearch
                          filterOption={(input, option) =>
                            typeof option.props.children === 'string' &&
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                          }
                        >
                          {!searchType && (
                            <OptGroup label={formatMessage({ id: 'common.recently' })}>
                              {listRecently.map(t => (
                                <Option key={t} value={t}>
                                  {this.getTypeName(listType, t)}
                                </Option>
                              ))}
                            </OptGroup>
                          )}
                          <OptGroup label="All Categories">
                            {listType.map(t => (
                              <Option key={t._id} value={t.name}>
                                {t.name}
                              </Option>
                            ))}
                          </OptGroup>
                        </Select>
                      )}
                    </FormItem>
                    {/* Bus Train */}
                    {valueCategory === 'Bus or Train' && (
                      <Row gutter={24}>
                        {this.renderComponent(busAndTrain, undefined, busItemBill)}
                      </Row>
                    )}
                    {/* Flight one way */}
                    {valueCategory === 'Airfare one way' && (
                      <Row gutter={24}>
                        {this.renderComponent(flightOneWay, undefined, flightOneWayItemBill)}
                      </Row>
                    )}
                    {/* Flight roundtrip */}
                    {valueCategory === 'Airfare roundtrip' && (
                      <Row gutter={24}>
                        {this.renderComponent(flightRoundTrip, undefined, flightRoundTripItemBill)}
                      </Row>
                    )}
                    {/* Hotel */}
                    {valueCategory === 'Hotel' && (
                      <Row gutter={24}>{this.renderComponent(hotel, undefined, hotelItemBill)}</Row>
                    )}
                    {/* Taxi */}
                    {valueCategory === 'Cab or Taxi' && renderTaxi}
                    {valueCategory && (
                      <Row gutter={24}>
                        {this.renderComponent(
                          listCustomFieldByCategoryItemBill,
                          undefined,
                          customFieldItemBill
                        )}
                      </Row>
                    )}

                    <Row>
                      <FormItem
                        label={this.renderLabel(
                          namePaymentOptionsField,
                          validationPaymentOption,
                          requiredPaymentOptionsField
                        )}
                      >
                        {getFieldDecorator(keyPaymentOptionsField, {
                          initialValue: paymentOption,
                          rules: [
                            {
                              validator: requiredPaymentOptionsField
                                ? this.checkPaymentOption
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
                                [
                                  'personal cash',
                                  'personal debit card',
                                  'personal digital wallet',
                                  'personal credit card',
                                ].indexOf(value) > -1
                              ) {
                                setFieldsValue({ reimbursable: true });
                              } else {
                                setFieldsValue({ reimbursable: false });
                              }
                            }}
                          >
                            <OptGroup label="Personal">
                              {listPaymentOptionsPersonal.map(item => (
                                <Option key={item.key} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </OptGroup>
                            <OptGroup label="Company">
                              {listPaymentOptionsCompany.map(item => (
                                <Option key={item.key} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </OptGroup>
                          </Select>
                        )}
                      </FormItem>
                      {paymentType === 'company credit card' && (
                        <FormItem label={this.renderLabel('Card Number', false, true)}>
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
                                    {this.getCardType(item.lastFourDigits)}
                                  </Option>
                                ))}
                              </OptGroup>
                            </Select>
                          )}
                        </FormItem>
                      )}
                    </Row>
                    <Row>
                      <FormItem
                        label={this.renderLabel(nameTagField, validationTag, requiredTagField)}
                      >
                        {getFieldDecorator(keyTagField, {
                          initialValue: tag && tag._id,
                          rules: [
                            {
                              validator: requiredTagField ? this.checkTag : () => true,
                            },
                          ],
                        })(
                          <Select
                            placeholder={placeholderTagField}
                            className={validationTag ? styles.selectFail : styles.select}
                            showSearch
                            loading={loadingTag}
                            onSearch={value => this.onSearchTag(value)}
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
                      </FormItem>
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
                  </Col>
                  <Col sm={10} xs={24} className={styles.form2} style={{ minWidth: '360px' }}>
                    <div>
                      <p className={styles.textTitleForm2}>Attach Receipts</p>
                      {getFieldDecorator('images', {
                        initialValue: images,
                      })(<ImagesUpload />)}
                    </div>
                    <div>
                      <FormItem>
                        <Row
                          gutter={12}
                          type="flex"
                          align="middle"
                          justify="center"
                          style={{ marginTop: '30px' }}
                        >
                          <Col>
                            {checkPath ? (
                              <Button
                                loading={submitSave}
                                onClick={() => this.handleSubmitForm(true, listType)}
                                className={styles.btnNew}
                              >
                                <FormattedMessage id="common.save-and-new" />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => router.push('/expense')}
                                className={styles.btnNew}
                              >
                                Cancel
                              </Button>
                            )}
                          </Col>
                          <Col className={styles.viewBtn}>
                            {!isShowDelButton() ? (
                              <Button
                                type="primary"
                                loading={submitSave}
                                onClick={() => {
                                  if (checkPath) {
                                    this.handleSubmitForm(false, listType);
                                  } else {
                                    this.handleEditForm(false, listType);
                                  }
                                }}
                                className={styles.btnAdd}
                              >
                                <FormattedMessage id="common.save">
                                  {txt => txt.toUpperCase()}
                                </FormattedMessage>
                              </Button>
                            ) : (
                              <Dropdown.Button
                                type="primary"
                                onClick={() => this.handleEditForm(false, listType)}
                                icon={<Icon type="down" />}
                                overlay={menu}
                              >
                                {loadingEdit && <Icon style={{ marginRight: 10 }} type="loading" />}
                                <FormattedMessage id="common.save">
                                  {txt => txt.toUpperCase()}
                                </FormattedMessage>
                              </Dropdown.Button>
                            )}
                          </Col>
                        </Row>
                      </FormItem>
                    </div>
                  </Col>
                </Fragment>
              )}
            </Skeleton>
          </Form>
        </Row>
        <Modal
          className={styles.deleteModal}
          visible={visibleDelete}
          onOk={this.handleDelete}
          onCancel={this.closeDelete}
          cancelText={formatMessage({ id: 'bill.cancel' })}
          okText={formatMessage({ id: 'bill.delete' })}
          closable={false}
        >
          <div className={styles.deleteTitle}>
            {`${formatMessage({
              id: 'bill.delete-expense',
            })}?`}
          </div>
          <div>{formatMessage({ id: 'bill.delete.line1' })}</div>
          <div>{`${formatMessage({ id: 'bill.delete.line3' })}?`}</div>
        </Modal>
      </Fragment>
    );
  }
}

export default NewExpense;
