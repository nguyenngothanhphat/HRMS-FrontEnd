import { notification } from 'antd';
import getCustomerInfo, { getDivisions, addDivision, updateDivision, getDocumentType, filterDocument, addDocument, uploadDocument, getDocument, getAuditTrail, getNotes, addNotes, getDivisionsId, getTagList } from '../services/customerProfile';
import { dialog } from '@/utils/utils';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const customerProfile = {
    namespace: 'customerProfile',
    state: {
        info:{},
        divisions: [],
        auditTrail: [],
        notes: [],
        listTags: [],
        documents: [],
        documentType: [],
        fileURL: '',
        divisionId: '', 
        temp: {
            selectedTab: '',
        },
    },
    effects: {
        *fetchCustomerInfo({payload}, {call, put}) {
            try {
              const response = yield call(getCustomerInfo, 
                {
                    tenantId: getCurrentTenant(),
                    company: getCurrentCompany(),
                    customerId: payload.id
                });
              const {statusCode, data} = response;
              if(statusCode !== 200) throw response;
              yield put({type: 'save', payload: {info: data}})
            } catch (error) {
                dialog(error);
            }
        },

        *generateDivisionId({payload}, {call, put}){
            try {
                const response = yield call(getDivisionsId, {
                    tenantId: getCurrentTenant(),
                    customerId: payload.id,
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {divisionId: data}})
              } catch (error) {
                  dialog(error);
              }
        },

        *fetchDivision({payload}, {call, put}){
            try {
                const response = yield call(getDivisions, {
                    tenantId: getCurrentTenant(),
                    customerId: payload.id
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {divisions: data}});
            } catch (error) {
                dialog(error);
            }
        },

        *addDivision({payload}, {call, put}){
            try {
                const response = yield call(addDivision, {
                    tenantId: getCurrentTenant(),
                    ...payload,
                });
                const {statusCode, message, data} = response;
                if(statusCode !== 200) throw response;
                notification.success({message})


                yield put({type: 'fetchDivision', payload: {tenantId: getCurrentTenant(), customerId: data.customerId}});
            } catch (error) {
                dialog(error);
            }
        },

        *updateDivision({payload}, {call, put}){
            try {
                const response = yield call(updateDivision, {
                    // tenantId: getCurrentTenant(),
                    // customerId: payload.id
                });
                const {statusCode, message, data} = response;
                if(statusCode !== 200) throw response;
                notification.success({message})


                yield put({type: 'fetchDivision', payload: {tenantId: getCurrentTenant(), customerId: data.customerId}});
            } catch (error) {
                dialog(error);
            }
        },

        *fetchAuditTrail({payload}, {call, put}) {
            try {
                const response = yield call(getAuditTrail, {
                    tenantId: getCurrentTenant(),
                    customerId: payload.id
                });
                const {statusCode, data, message} = response;
                if(statusCode !== 200) throw response;
                notification.success({message});
                yield put({type: 'save', payload: {auditTrail: data}});
            } catch (error) {
                dialog(error);
            }
        },

        *fetchNotes({payload}, {call, put}){
            try {
                const response = yield call(getNotes, {
                    tenantId: getCurrentTenant(),
                    customerId: payload.id
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {notes: data}});
            } catch (error) {
                dialog(error);
            }
        },

        *addNote({payload}, {call, put}){
            try {
                const response = yield call(addNotes, {
                    tenantId: getCurrentTenant(),
                    ...payload,
                });
                const {statusCode, message,} = response;
                if(statusCode !== 200) throw response;
                notification.success({message})

                yield put({
                    type: 'fetchNotes', 
                    payload: {
                        tenantId: getCurrentTenant(), 
                        id: payload.customerIdv
                    }
                });
            } catch (error) {
                dialog(error);
            }
        },

        *fetchDocumentsTypes(_, {call, put}){
            try {
                const response = yield call(getDocumentType);
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {documentType: data}})
            } catch (error) {
                dialog(error);
            }
        },

        *fetchDocuments({payload}, {call, put}){
            try {
                const response = yield call(getDocument, {
                    tenantId: getCurrentTenant(),
                    customerId: payload.id
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {documents: data}})
            } catch (error) {
                dialog(error);
            }
        },

        *uploadDoc({payload}, {call, put}){
            let response = {};
            try {
                response = yield call(uploadDocument, payload);
                const { statusCode, data } = response;
                if (statusCode !== 200) throw response;
                  notification.success({
                    message: 'Upload Successfully',
                  });
                yield put({
                  type: 'save',
                  payload: { fileURL: data[0].url },
                });
              } catch (errors) {
                dialog(errors);
              }
            return response;
        },

        *addDoc({payload}, {call}){
            try {
                const response = yield call(addDocument, {
                    tenantId: getCurrentTenant(),
                    ...payload
                });
                const {statusCode, message} = response;
                if(statusCode !== 200) throw response;
                notification.success({message})

            } catch (error) {
                dialog(error);
            }
        },

        *filterDoc({payload} , {call, put}){
            try {
                const response = yield call(filterDocument, {
                    tenantId: getCurrentTenant(),
                    ...payload
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {
                    documents: data
                }})
            } catch (error) {
                dialog(error);
            }
        },

        *fetchTagList({payload}, {call, put}) {
            try {
                const response = yield call(getTagList, {
                    tenantId: getCurrentTenant(),
                    company: getCurrentCompany(),
                    ...payload
                });
                const {statusCode, data} = response;
                if(statusCode !== 200) throw response;
                yield put({type: 'save', payload: {
                    listTag: data
                }})
            } catch (error) {
                dialog(error);
            }
        }
    },
    reducers: {
        save(state, action) {
            return{
                ...state,
                ...action.payload,
            }
        },
        saveTemp(state, action) {
            const {temp} = state;
            return {
                ...state,
                temp: {
                    ...temp,
                    ...action.payload,
                }
            }
        }
    }
}

export default customerProfile;