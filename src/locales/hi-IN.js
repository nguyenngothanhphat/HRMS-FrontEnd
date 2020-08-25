import exception from './hi-IN/exception';
import signin from './hi-IN/signin';
import signup from './hi-IN/signup';
import menu from './hi-IN/menu';
import reimbursement from './hi-IN/reimbursement';
import bill from './hi-IN/bill';
import settings from './hi-IN/settings';
import pwa from './hi-IN/pwa';
import location from './hi-IN/location';
import currency from './hi-IN/currency';
import dashboard from './hi-IN/dashboard';
import common from './hi-IN/common';
import potential from './hi-IN/potential';
import creditCard from './hi-IN/creditCard';
import customer from './hi-IN/customer';
import category from './hi-IN/category';
import filter from './hi-IN/filter';
import image from './hi-IN/image';
import pdf from './hi-IN/pdf';
import project from './hi-IN/project';
import user from './hi-IN/user';
import type from './hi-IN/type';
import excel from './hi-IN/excel';
import globalValidation from './hi-IN/validation/global';
import billValidation from './hi-IN/validation/bill';
import currencyValidation from './en-US/validation/currency';
import customerValidation from './en-US/validation/customer';
import exchangeValidation from './en-US/validation/exchange';
import potentialValidation from './en-US/validation/potential';
import creditCardValidation from './hi-IN/validation/creditCard';
import groupValidation from './hi-IN/validation/group';
import locationValidation from './hi-IN/validation/location';
import projectValidation from './hi-IN/validation/project';
import reimbursementValidation from './hi-IN/validation/reimbursement';
import settingValidation from './hi-IN/validation/setting';
import typeValidation from './hi-IN/validation/type';
import userValidation from './hi-IN/validation/user';
import request from './hi-IN/request';
import customField from './hi-IN/customField';
import feedback from './hi-IN/feedback';
import employee from './hi-IN/employee';
import teamReport from './hi-IN/teamReport';
import corporateCard from './hi-IN/corporateCard';

export default {
  'navBar.lang': 'बोली',
  'exchange.rate': 'विनिमय दरें',
  ACTIVE: 'सक्रिय',
  active: 'सक्रिय',
  inactive: 'निष्क्रिय',
  disabled: 'विकलांग',
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

export const hi = {
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
