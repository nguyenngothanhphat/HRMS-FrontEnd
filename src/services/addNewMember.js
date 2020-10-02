import request from '@/utils/request';

export default function SendEmail(payload) {
    return request('api/', {
        method: 'POST',
        data: payload,
    });
}