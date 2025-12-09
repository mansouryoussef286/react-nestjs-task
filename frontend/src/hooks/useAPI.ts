import { useAxios } from "./useAxios";
export type UserAPIHook = ReturnType<typeof useAPI>;

export const useAPI = () => {
  let { api } = useAxios();

  async function Get<T>(url: string, params?: object): Promise<T | null> {
    const { data } = await api.get<T>(url, { params });
    return data;
  }

  async function Post<T>(url: string, body?: object): Promise<T | null> {
    const { data } = await api.post<T>(url, body);
    return data;
  }

  return {
    Get,
    Post,
  };
};
