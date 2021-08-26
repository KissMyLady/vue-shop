import { get, post, del ,put, } from '@/request/request'

/**
 * 参考: https://juejin.cn/post/6844903652881072141
 *
 */

export const apiAddress = (p) => {
	post('api/v1/users/my_address/address_edit_before', p)
};
