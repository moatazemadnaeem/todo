import axios from "axios";
const getToken = () => {
  return sessionStorage.getItem("jwt");
};
const AxiosInstance = axios.create({
  baseURL: "https://todo-production-0dc6.up.railway.app/api/v1/",
  headers: {
    authentication: getToken(),
  },
});
const protectedUrls = [
  "users/current_user",
  "tasks/full_text_content",
  "tasks/autocomplete_content",
  "tasks/create_task",
  "tasks/update_content_task",
  "tasks/status_filter_task",
  "tasks/delete_task",
];
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const url = config.url!;
    if (protectedUrls.includes(url)) {
      if (!token) {
        return Promise.reject();
      }
      if (token) {
        config.headers["authentication"] = `${token}`;
      }
    }

    return config;
  },
  () => {
    return Promise.reject();
  }
);
export { AxiosInstance };
