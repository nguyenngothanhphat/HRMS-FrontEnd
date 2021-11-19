import { request } from '@/utils/request';

export async function getResources(payload) {
    return request('/api-project/resourcetenant/list', {
        method: 'POST',
        data: payload,
    });
}

export async function addTicket(payload) {
    return request(`/api-ticket/tickettenant/add`, {
        method: 'POST',
        data: payload,
    });
}
export async function getOffToTalList(payload) {
    return request(`/api-ticket/tickettenant/summary-priority`, {
        method: 'POST',
        data: payload,
    });
}

export async function getListEmployee(payload) {
    return request('/api/employeetenant/list-by-single-company', {
        method: 'POST',
        data: payload,
    });
}
export async function getDepartmentList(payload) {
    return request('/api/departmenttenant/list', {
        method: 'POST',
        data: payload,
    });
}
export async function postAssignToProject(payload) {
    return request('/api-project/resourcetenant/add', {
        method: 'POST',
        data: payload,
    });
}

export async function updateProjectDetail(payload) {
    return request('/api-project/resourcetenant/update', {
        method: 'POST',
        data: payload,
    });
}

export async function getProjectList(payload) {
    return request('/api-project/projecttenant/list', {
        method: 'POST',
        data: payload,
    });
}

export async function updateComment(payload) {
    return request('/api/employeetenant/update', {
        method: 'POST',
        data: payload,
    });
}