export const LOGOUT = "LOGOUT"

export const logoutAction = () => {
  localStorage.removeItem("token")

  return {
    type: LOGOUT,
  }
}
