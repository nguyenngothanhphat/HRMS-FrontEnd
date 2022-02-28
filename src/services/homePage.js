import request from '@/utils/request';

export async function getPostTypeList(payload) {
  return request('/api/posttenant/list-post-type', {
    method: 'GET',
    data: payload,
  });
}

export async function addPost(payload) {
  return request('/api/posttenant/add', {
    method: 'POST',
    data: payload,
  });
}
export async function updatePost(payload) {
  return request('/api/posttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function deletePost(payload) {
  return request('/api/posttenant/delete', {
    method: 'POST',
    data: payload,
  });
}

export async function getPostsByType(payload) {
  return request('/api/posttenant/get-by-type', {
    method: 'POST',
    data: payload,
  });
}

export async function getTotalPostsOfType(payload) {
  return request('/api/posttenant/get-status-summary', {
    method: 'POST',
    data: payload,
  });
}

export async function votePoll(payload) {
  return request('/api/polltenant/vote', {
    method: 'POST',
    data: payload,
  });
}

export async function getSelectedPollOptionByEmployee(payload) {
  return request('/api/polltenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getPollResult(payload) {
  return request('/api/polltenant/get-status-summary', {
    method: 'POST',
    data: payload,
  });
}

// HOME PAGE
export async function getBirthdayInWeek(data) {
  return request('/api/employeetenant/list-celebration', {
    method: 'POST',
    data,
  });
}

export async function updateBannerPosition(data) {
  return request('/api/posttenant/update-banner-position', {
    method: 'POST',
    data,
  });
}

// BIRTHDAY LIKE & COMMENT
export async function upsertBirthdayConversation(data) {
  return request('/api/birthdayconversationtenant/upsert', {
    method: 'POST',
    data,
});
}
