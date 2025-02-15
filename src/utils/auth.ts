import { jwtDecode } from 'jwt-decode'
import router from '@/router';

const TOKEN_KEY = 'access_token'
const RESFRESH_TOKEN_KEY = 'refresh_token'

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) as string
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(RESFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(RESFRESH_TOKEN_KEY, token)
}
export function getRefreshToken(): string {
  return localStorage.getItem(RESFRESH_TOKEN_KEY) as string
}
export function removeRefreshToken() {
  localStorage.removeItem(RESFRESH_TOKEN_KEY)
}

/**
 * 获取用户信息
 */
export interface UserInfoDto {
  avatar: string | null;
  email: string;
  lastLogin: string | null;
  userId: string;
  userName: string;
  nickName: string | null;
}
export function getUserInfo(): UserInfoDto | null {
  const token = getToken()

  if (!token) {
    router.replace('/login')
    return null
  }
  return jwtDecode(token)
}