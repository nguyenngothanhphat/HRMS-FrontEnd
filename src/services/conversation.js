import request from '@/utils/request';

// CONVERSATION
export async function addNewConversation(payload) {
  return request('/api/conversationtenant/add', {
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
