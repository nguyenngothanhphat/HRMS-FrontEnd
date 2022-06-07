import request from '@/utils/request';

// CONVERSATION
export async function addNewConversation(payload) {
  return request('/api/conversationtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getConversationUnSeen(params) {
  return request('/api/messagetenant/notify-message', {
    method: 'GET',
    params,
  });
}

export async function seenMessage(payload) {
  return request('/api/messagetenant/seen-messages', {
    method: 'POST',
    data: payload,
  });
}

export async function getUserConversations(payload) {
  return request('/api/conversationtenant/get-user-conversation', {
    method: 'POST',
    data: payload,
  });
}

export async function getConversation(payload) {
  return request('/api/conversationtenant/get-conversation', {
    method: 'POST',
    data: payload,
  });
}

export async function getNumberUnseenConversation(payload) {
  return request('/api/conversationtenant/get-list-unseen', {
    method: 'POST',
    data: payload,
  });
}
export async function setStatusSeenConversation(payload) {
  return request('/api/conversationtenant/set-status-seen', {
    method: 'POST',
    data: payload,
  });
}

// MESSAGE
export async function addNewMessage(payload) {
  return request('/api/messagetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getConversationMessage(payload) {
  return request('/api/messagetenant/get-message', {
    method: 'POST',
    data: payload,
  });
}

export async function getListLastMessage(payload) {
  return request('/api/messagetenant/get-list-last-message', {
    method: 'POST',
    data: payload,
  });
}

export async function getLastMessage(payload) {
  return request('/api/messagetenant/get-last-message', {
    method: 'POST',
    data: payload,
  });
}
