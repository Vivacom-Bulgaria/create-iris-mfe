import Axios, { type AxiosRequestConfig } from "axios"

export const apiInstance = Axios.create()

/** The mutator orval calls. Unwraps `data`, which is what every hook wants. */
export const apiMutator = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const { data } = await apiInstance({ ...config, ...options })
  return data
}
