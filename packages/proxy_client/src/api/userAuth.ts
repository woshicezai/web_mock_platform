import { get, post } from 'utils/request'
import { encrypt } from 'utils/crypto'
import { tokenService } from 'utils/tokenStorage'

interface LoginRequest {
  name: string
  password: string
}

interface RegisterRequest {
  phone: string
  name: string
  password: string
}

interface AuthResponse {
  message: string
  userId?: string
}

function getPublicKey() {
  return get<LoginRequest>('/getPublicKey').then((res) => res.data)
}

export async function login(data: UserAuthData) {
  const res = await getPublicKey()
  const { key } = res
  const encryptedPassword = await encrypt(data.password, key)
  return post<LoginRequest, AuthResponse>('/login', {
    ...data,
    password: encryptedPassword
  }).then((res) => {
    tokenService.setToken(res.token)
    return res
  })
}

export async function register(data: RegisterRequest) {
  const res = await getPublicKey()
  const { key } = res
  const encryptedPassword = await encrypt(data.password, key)
  return post<RegisterRequest, AuthResponse>('/register', {
    ...data,
    password: encryptedPassword
  })
}

export async function logout() {
  return post<null, AuthResponse>('/logout').then(() => {
    tokenService.removeToken()
    window.location.href = '/login'
  })
}
