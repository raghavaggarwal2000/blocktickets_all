export const _get_user_info = () => {
  return JSON.parse(sessionStorage.getItem("user-data"))
}

export const _is_event_creator = () => {
  return JSON.parse(sessionStorage.getItem("user-data"))?.isVerifiedCreator
}