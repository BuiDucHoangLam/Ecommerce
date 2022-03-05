export const drawerReducer = (state = {text: ''},action) => {
  switch(action.type) {
    case 'SET_VISIBLE':
      return action.payload;
    default:
      return state
  }
}

