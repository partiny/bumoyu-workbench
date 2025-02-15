// 权限相关Api

const PREFIX = `${import.meta.env.VITE_BASE_URL}/auth`

export const ApiAuth = {
  /**获取新的token */
  refreshToken: `${PREFIX}/refresh-token`,
  /**注册账号 */
  signIn: `${PREFIX}/sign-in`,
  /**登录 */
  signUp: `${PREFIX}/sign-up`,
  /**校验用户是否登录（通过header中的token校验） */
  check: `${PREFIX}/check`,
  /**代理跨域的域名 */
  proxy: `${PREFIX}/proxy`,
  /**注册账号时发送邮箱验证码 */
  sendEmailCodeOfRegistAccount: `${PREFIX}/send-email-code-of-regist-account`,
  /**重置密码时发送邮箱验证码 */
  sendEmailCodeOfResetPassword: `${PREFIX}/send-email-code-of-reset-password`,
  /**重置密码 */
  resetPassword: `${PREFIX}/reset-password`
}