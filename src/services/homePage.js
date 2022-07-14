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

export async function getPostsByType(params) {
  return request('/api/posttenant', {
    method: 'GET',
    params,
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
export async function getCelebrationList(params) {
  return request('/api/employeetenant/list-celebration', {
    method: 'GET',
    params,
  });
}

export async function updateBannerPosition(data) {
  return request('/api/posttenant/update-banner-position', {
    method: 'POST',
    data,
  });
}

// BIRTHDAY LIKE & COMMENT
export async function upsertCelebrationConversation(data) {
  return request('/api/birthdayconversationtenant/upsert', {
    method: 'POST',
    data,
  });
}

export async function getQuickLinkList(params) {
  return request('/api/quicklinktenant/list', {
    method: 'GET',
    params,
  });
}

export async function getTotalQuickLink(params) {
  return request('/api/quicklinktenant/get-total-by-type', {
    method: 'GET',
    params,
  });
}

export async function addQuickLink(data) {
  return request('/api/quicklinktenant/add', {
    method: 'POST',
    data,
  });
}
export async function updateQuickLink(data) {
  return request('/api/quicklinktenant/update', {
    method: 'POST',
    data,
  });
}
export async function deleteQuickLink(data) {
  return request('/api/quicklinktenant/delete', {
    method: 'POST',
    data,
  });
}

// SOCIAL ACTIVITIES
export async function getPostComments(params) {
  return request('/api/commenttenant', {
    method: 'GET',
    params,
  });
}

export async function addComment(data) {
  return request('/api/commenttenant', {
    method: 'POST',
    data,
  });
}

export async function editComment(data, params) {
  return request('/api/commenttenant', {
    method: 'PUT',
    data,
    params,
  });
}

export async function removeComment(params) {
  return request('/api/commenttenant', {
    method: 'DELETE',
    params,
  });
}

export async function reactPost(data) {
  return request('/api/reactposttenant/', {
    method: 'POST',
    data,
  });
}

export async function getPostReactionList(params) {
  return request('/api/reactposttenant/', {
    method: 'GET',
    params,
  });
}
