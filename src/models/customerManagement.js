import { notification } from "antd";
import { getCurrentCompany, getCurrentTenant } from "@/utils/authority";
import {getCustomerList, addCustomer, genCustomerID, getTagList, getCountryList, getStateListByCountry } from '../services/customerManagement';
import { dialog } from "@/utils/utils";

const customerManagement = {
    namespace: 'customerManagement',
    state: {
      listTags: [],
      country: [],
      state: [],
      city: [],
      listCustomer: [],
      customer: {},
      filter: {},
      employeeInfo: {},
      temp: {
        customerID: '',
        status: '',
        tag: []
      }
    },
    effects: {
      *fetchCustomerList(_, {call, put}){
        try {
          const response = yield call(getCustomerList, {tenantId: getCurrentTenant(), company: getCurrentCompany()});
          const {statusCode, data} = response;
          if(statusCode !== 200) throw response;
          yield put({type: 'save', payload: {listCustomer: data}})
        } catch (error) {
          dialog(error);
        }
      },

      *addNewCustomer({payload}, {call}){
        try {
          const response = yield call(addCustomer, payload);
          const {statusCode, message} = response;
          if(statusCode !== 200) throw response;
          notification.success({message});
        } catch (error) {
          dialog(error);
        }
      },

      *genCustomerID(_, {call, put}) {
        try {
          const response = yield call(genCustomerID, {tenantId: getCurrentTenant()});
          const { statusCode, data } = response;
          if(statusCode !== 200) throw response;
          yield put({type: 'saveTemp', payload: {customerID: data}})
        } catch (error) {
          dialog(error);
        }
      },

      *fetchTagList(_, {call, put}){
        try {
          const response = yield call(getTagList);
          const {statusCode, data} = response;
          if(statusCode !== 200) throw response;
          yield put({type: 'save', payload: {listTags: data} });
        } catch (error) {
          dialog(error);
        }
      },

      *fetchCountryList(_, {call, put}){
        try {
          const response = yield call(getCountryList);
          const {statusCode, data} = response;
          if(statusCode !== 200) throw response;
          yield put({type: 'save', payload: {country: data}});
        } catch (error) {
          dialog(error);
        }
      },

      *fetchStateByCountry({payload}, {call, put}) {
        try {
          const response = yield call(getStateListByCountry, {id: payload});
          const {statusCode, data} = response;
          if(statusCode !== 200) throw response;
          yield put({type: 'save', payload: {
            state: data,
          }})
        } catch (error) {
          dialog()
        }
      },

    },
    reducers: {
      save(state, action) {
        return {
          ...state,
          ...action.payload,
        };
      },
      saveTemp(state, action) {
        const { temp } = state;
        return {
          ...state,
          temp: {
            ...temp,
            ...action.payload,
          }
        }
      }
    }
};
export default customerManagement;