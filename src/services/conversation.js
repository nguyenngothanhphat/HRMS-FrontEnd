import request from '@/utils/request';

// CONVERSATION
export async function addNewConversation(payload) {
  return request('/api/conversation/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getUserConversations(payload) {
  return request('/api/conversation/get-user-conversation', {
    method: 'POST',
    data: payload,
  });
}

export async function getConversation(payload) {
  return request('/api/conversation/get-conversation', {
    method: 'POST',
    data: payload,
  });
}

// MESSAGE
export async function addNewMessage(payload) {
  return request('/api/message/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getConversationMessage(payload) {
  return request('/api/message/get-message', {
    method: 'POST',
    data: payload,
  });
}
