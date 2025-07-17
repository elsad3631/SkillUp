import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

const getAssets = (): Promise<any[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get("assets")
    .then(({ data }) => data as any[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createAsset = (formData: any): Promise<any | undefined> => {
  ApiService.setHeader();
  return ApiService.post("assets", formData)
    .then(({ data }) => data as any)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateAsset = (id: number, formData: any): Promise<any | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`assets/${id}`, formData)
    .then(({ data }) => data as any)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteAsset = (id: number): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`assets/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

export { getAssets, createAsset, updateAsset, deleteAsset }; 