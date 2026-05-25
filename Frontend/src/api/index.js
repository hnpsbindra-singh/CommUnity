import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {

    if (err.response?.status === 401) {

      localStorage.removeItem('token')

      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const sendOtp = (username) => api.post(`/auth/send-otp?username=${encodeURIComponent(username)}`)
export const verifyOtp = (username, otp) => api.post(`/auth/verify-otp?username=${encodeURIComponent(username)}&Otp=${encodeURIComponent(otp)}`)
export const sendResetOtp = (username) => api.post(`/auth/send-reset-otp?username=${encodeURIComponent(username)}`)
export const resetPassword = (data) => api.post('/auth/reset-password', data)

// Community
export const createCommunity = (communityName) => api.post(`/user/community/create?communityName=${encodeURIComponent(communityName)}`)
export const joinCommunity = (joinCode) => api.post(`/user/community/join/${joinCode}`)
export const leaveCommunity = (communityId) => api.delete(`/user/community/leave/${communityId}`)
export const getAllCommunities = () => api.get('/user/community/all')
export const getMyCommunities = () => api.get('/user/community/my')
export const getCommunityDetails = (communityId) => api.get(`/user/community/${communityId}`)

// Posts
export const createPost = (communityId, data) => api.post(`/user/post/create/${communityId}`, data)
export const getCommunityPosts = (communityId) => api.get(`/user/post/community/${communityId}`)
export const getPost = (postId) => api.get(`/user/post/${postId}`)
export const deletePost = (postId) => api.delete(`/user/post/${postId}`)
export const feelGood = (postId) => api.patch(`/user/post/feel-good/${postId}`)

// Comments
export const createComment = (postId, data) => api.post(`/user/comment/create/${postId}`, data)
export const getComments = (postId) => api.get(`/user/comment/${postId}`)
export const deleteComment = (commentId) => api.delete(`/user/comment/${commentId}`)

// Profile
export const getProfile = () => api.get('/user/me')
export const updateProfile = (data) => api.patch('/user/update-profile', data)

export default api
