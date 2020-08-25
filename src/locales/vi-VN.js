import exception from './vi-VN/exception';
import signin from './vi-VN/signin';
import signup from './vi-VN/signup';
import menu from './vi-VN/menu';
import reimbursement from './vi-VN/reimbursement';
import bill from './vi-VN/bill';
import settings from './vi-VN/settings';
import pwa from './vi-VN/pwa';
import location from './vi-VN/location';
import currency from './vi-VN/currency';
import dashboard from './vi-VN/dashboard';
import common from './vi-VN/common';
import potential from './vi-VN/potential';
import creditCard from './vi-VN/creditCard';
import customer from './vi-VN/customer';
import category from './vi-VN/category';
import filter from './vi-VN/filter';
import image from './vi-VN/image';
import pdf from './vi-VN/pdf';
import project from './vi-VN/project';
import user from './vi-VN/user';
import type from './vi-VN/type';
import excel from './vi-VN/excel';
import globalValidation from './vi-VN/validation/global';
import billValidation from './vi-VN/validation/bill';
import currencyValidation from './en-US/validation/currency';
import customerValidation from './en-US/validation/customer';
import exchangeValidation from './en-US/validation/exchange';
import potentialValidation from './en-US/validation/potential';
import creditCardValidation from './vi-VN/validation/creditCard';
import groupValidation from './vi-VN/validation/group';
import locationValidation from './vi-VN/validation/location';
import projectValidation from './vi-VN/validation/project';
import reimbursementValidation from './vi-VN/validation/reimbursement';
import settingValidation from './vi-VN/validation/setting';
import typeValidation from './vi-VN/validation/type';
import userValidation from './vi-VN/validation/user';
import request from './vi-VN/request';
import customField from './vi-VN/customField';
import feedback from './vi-VN/feedback';
import employee from './vi-VN/employee';
import teamReport from './vi-VN/teamReport';
import corporateCard from './vi-VN/corporateCard';

export default {
  'navBar.lang': 'Ngôn ngữ',
  'exchange.rate': 'Tỷ lệ quy đổi',
  ACTIVE: 'KÍCH HOẠT',
  active: 'Kích hoạt',
  inactive: 'Kích hoạt',
  disabled: 'Vô hiệu hoá',
  ...filter,
  ...user,
  ...excel,
  ...pdf,
  ...type,
  ...project,
  ...exception,
  ...image,
  ...category,
  ...signup,
  ...signin,
  ...menu,
  ...reimbursement,
  ...bill,
  ...settings,
  ...pwa,
  ...location,
  ...currency,
  ...dashboard,
  ...common,
  ...potential,
  ...creditCard,
  ...customer,
  ...globalValidation,
  ...billValidation,
  ...creditCardValidation,
  ...groupValidation,
  ...projectValidation,
  ...locationValidation,
  ...reimbursementValidation,
  ...settingValidation,
  ...typeValidation,
  ...userValidation,
  ...currencyValidation,
  ...customerValidation,
  ...exchangeValidation,
  ...potentialValidation,
  ...request,
  ...customField,
  ...feedback,
  ...employee,
  ...teamReport,
  ...corporateCard,
};

export const vi = {
  filter,
  user,
  excel,
  pdf,
  type,
  project,
  exception,
  image,
  category,
  signup,
  signin,
  menu,
  reimbursement,
  bill,
  settings,
  pwa,
  location,
  currency,
  dashboard,
  common,
  potential,
  creditCard,
  customer,
  employee,
  teamReport,
  corporateCard,
};
