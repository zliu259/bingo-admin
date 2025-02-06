import { request } from '@/utils'
import { get } from 'lodash-es'

export default {
  login: (data) => request.post('/base/access_token', data, { noNeedToken: true }),
  getUserInfo: () => request.get('/base/userinfo'),
  getUserMenu: () => request.get('/base/usermenu'),
  getUserApi: () => request.get('/base/userapi'),
  // profile
  updatePassword: (data = {}) => request.post('/base/update_password', data),
  // users
  getUserList: (params = {}) => request.get('/user/list', { params }),
  getUserById: (params = {}) => request.get('/user/get', { params }),
  createUser: (data = {}) => request.post('/user/create', data),
  updateUser: (data = {}) => request.post('/user/update', data),
  deleteUser: (params = {}) => request.delete(`/user/delete`, { params }),
  resetPassword: (data = {}) => request.post(`/user/reset_password`, data),
  // role
  getRoleList: (params = {}) => request.get('/role/list', { params }),
  createRole: (data = {}) => request.post('/role/create', data),
  updateRole: (data = {}) => request.post('/role/update', data),
  deleteRole: (params = {}) => request.delete('/role/delete', { params }),
  updateRoleAuthorized: (data = {}) => request.post('/role/authorized', data),
  getRoleAuthorized: (params = {}) => request.get('/role/authorized', { params }),
  // menus
  getMenus: (params = {}) => request.get('/menu/list', { params }),
  createMenu: (data = {}) => request.post('/menu/create', data),
  updateMenu: (data = {}) => request.post('/menu/update', data),
  deleteMenu: (params = {}) => request.delete('/menu/delete', { params }),
  // apis
  getApis: (params = {}) => request.get('/api/list', { params }),
  createApi: (data = {}) => request.post('/api/create', data),
  updateApi: (data = {}) => request.post('/api/update', data),
  deleteApi: (params = {}) => request.delete('/api/delete', { params }),
  refreshApi: (data = {}) => request.post('/api/refresh', data),
  // depts
  getDepts: (params = {}) => request.get('/dept/list', { params }),
  createDept: (data = {}) => request.post('/dept/create', data),
  updateDept: (data = {}) => request.post('/dept/update', data),
  deleteDept: (params = {}) => request.delete('/dept/delete', { params }),
  // auditlog
  getAuditLogList: (params = {}) => request.get('/auditlog/list', { params }),

  // management
  // client
  getClientList: (params = {}) => request.get('/management/getClientList', { params }),
  getClientById: (clientId) => request.get(`/management/getClientById/${clientId}`),
  createClient: (data = {}) => request.post('/management/addClient', data),
  updateClient: (data = {}) => request.post('/management/updateClient', data),
  deleteClient: (clientId) => request.delete(`/management/deleteClient/${clientId}`),
  // provider
  getProviderList: (params = {}) => request.get('/management/getProviderList', { params }),
  getProviderById: (providerId) =>  request.get(`/management/getProviderById/${providerId}`),
  createProvider: (data = {}) => request.post('/management/addProvider', data),
  updateProvider: (data = {}) => request.post('/management/updateProvider', data),
  deleteProvider: (providerId) => request.delete(`/management/deleteProvider/${providerId}`),
  // quotation
  getQuotationList: (params = {}) => request.get('/management/getQuotationList', { params }),
  getQuotationById: (quotationId) => request.get(`/management/getQuotationById/${quotationId}`),
  createQuotation: (data = {}) => request.post('/management/addQuotation', data),
  updateQuotation: (data = {}) => request.post('/management/updateQuotation', data),
}
