import * as ActionTypes from './ActionTypes';

export const comments = (
  state = {
    isLoading: true,
    errMess: null,
    comments: []
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {
        ...state,
        errMess: null,
        comments: action.payload
      };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload, comments: [] };

    case ActionTypes.ADD_COMMENT:
      return {
        ...state,
        errmess: null,
        comments: state.comments.concat({
          ...action.payload,
          id: state.comments.length
        })
      };

    default:
      return state;
  }
};
