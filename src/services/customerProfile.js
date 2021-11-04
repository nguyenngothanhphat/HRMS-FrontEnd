import {request} from '@/utils/request';

const BASE_URL = 'https://stghrms.paxanimi.ai';

export default async function getCustomerInfo(payload) {
    return request(`${BASE_URL}/api-customer/customertenant/get-customer-info`, {
        type: 'POST',
        data: payload,
    })
}

export async function getAuditTrail(payload) {
    return request(`${BASE_URL}/api-customer/audittrailtenant/list`, {
        type: 'POST',
        data: payload,
    })
}

export async function getDocument(payload) {
    return request(`${BASE_URL}/api-customer/documenttenant/list`, {
        type: 'POST',
        data: payload,
    })
}

export async function uploadDocument(payload) {
    return request(`${BASE_URL}/api/attachments/upload`, {
        type: 'POST',
        data: payload,
    })
}

export async function addDocument(payload) {
    return request(`${BASE_URL}/api-customer/documenttenant/add`, {
        type: 'POST',
        data: payload,
    })
}

export async function filterDocument(payload) {
    return request(`${BASE_URL}/api-customer/documenttenant/filter`, {
        type: 'POST',
        data: payload,
    })
}

export async function removeDocument(payload) {
    return request(`${BASE_URL}/api-customer/documenttenant/remove`, {
        type: 'POST',
        data: payload,
    })
}

export async function getDocumentType() {
    return request(`${BASE_URL}/api-customer/documenttenant/list-doc-types`, {
        method: 'GET',
    })
}

export async function getDivisions(payload) {
    return request(`${BASE_URL}/api-customer/divisiontenant/list`, {
        method: 'POST',
        data: payload,
    })
}

export async function getDivisionsId(payload) {
    return request(`${BASE_URL}/api-customer/divisiontenant/gen-division-id`, {
        method: 'POST',
        data: payload
    })
}

export async function addDivision(payload) {
    return request(`${BASE_URL}/api-customer/divisiontenant/add`, {
        method: 'POST',
        data: payload,
    })
}

export async function updateDivision(payload) {
    return request(`${BASE_URL}/api-customer/divisiontenant/update`, {
        method: 'POST',
        data: payload,
    })
}


export async function getNotes(payload) {
    return request(`${BASE_URL}/api-customer/notetenant/list`, {
        method: 'POST',
        data: payload,
    })
}

export async function addNotes(payload) {
    return request(`${BASE_URL}/api-customer/notetenant/add`, {
        method: 'POST',
        data: payload,
    })
}

export async function getTagList(payload) {
    return request(`${BASE_URL}/api-customer/tagtenant/list`, {
        method: 'POST',
        data: payload,
    })
}