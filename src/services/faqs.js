import request from '@/utils/request';

export async function addCategory(payload) {
    return request('/api/faqstenant/add-category', {
        method: 'POST',
        data: payload,
    });
}

export async function getListCategory(payload) {
    return request('/api/faqstenant/get-list-category', {
        method: 'POST',
        data: payload,
    });
}

export async function updateCategory(payload) {
    return request('/api/faqstenant/update-category', {
        method: 'POST', 
        data: payload
    })
}

export async function deleteCategory(payload) {
    return request('/api/faqstenant/delete-category', {
        method: 'POST', 
        data: payload
    })
}