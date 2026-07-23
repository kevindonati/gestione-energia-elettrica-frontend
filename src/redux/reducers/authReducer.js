const initialState = {
  token: localStorage.getItem("token"),
  isLogged: !!localStorage.getItem("token"),
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload,
        isLogged: true,
      }
    case "LOGOUT":
      return {
        token: null,
        isLogged: null,
      }
    default:
      return state
  }
}

export default authReducer
