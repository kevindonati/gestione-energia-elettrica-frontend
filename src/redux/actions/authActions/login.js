export const LOGIN = "LOGIN"

export const loginAction = (token) => {
  localStorage.setItem("token", token)

  return {
    type: LOGIN,
    payload: token,
  }
}
