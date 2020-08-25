import request from '@/utils/request';

export async function query(option) {
  return request('/server/api/api/bill/list-by-current-user', {
    method: 'POST',
    data: option,
  });
}

export async function queryBillById(option) {
  return request('/server/api/api/bill/get-by-id', {
    method: 'POST',
    data: option,
  });
}

export async function submitBill(data) {
  return request('/server/api/api/bill/submit', {
    method: 'POST',
    data,
  });
}

export async function queryEditBill(option) {
  option.append('method', 'update');
  return request('/server/api/api/bill/update', {
    method: 'POST',
    data: option,
  });
}

export async function queryDeleteBill(data) {
  return request('/server/api/api/bill/list-delete', {
    method: 'POST',
    data,
  });
}

export async function fetchSummaryApi(data) {
  return request('/server/api/api/bill/summary', {
    method: 'POST',
    data,
  });
}

export async function fetchSummaryByTag(data) {
  return request('/server/api/api/bill/summary-by-tag', {
    method: 'POST',
    data,
  });
}

export async function fetchSummaryByProject(data) {
  return request('/server/api/api/bill/summary-by-project', {
    method: 'POST',
    data,
  });
}

export async function queryDeleteExpense(data) {
  return request('/server/api/api/bill/delete', {
    method: 'POST',
    data,
  });
}

export async function queryUpdateExpense(data) {
  return request('/server/api/api/bill/update', {
    method: 'POST',
    data,
  });
}
