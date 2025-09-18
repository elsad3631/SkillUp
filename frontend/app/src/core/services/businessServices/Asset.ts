import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

const getAssets = (): Promise<any[] | undefined> => {
  ApiService.setHeader();
  
  return ApiService.get("asset")
    .then(({ data }) => data as any[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createAsset = (formData: any): Promise<any | undefined> => {
  ApiService.setHeader();
  return ApiService.post("asset", formData)
    .then(({ data }) => data as any)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateAsset = (id: number, formData: any): Promise<any | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`asset/${id}`, formData)
    .then(({ data }) => data as any)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteAsset = (id: number): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`asset/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getAssetsByTypeAndCompany = (type: string, company: string): Promise<any[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`asset/type/${type}/company/${company}`)
    .then(({ data }) => data as any[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export { getAssets, createAsset, updateAsset, deleteAsset, getAssetsByTypeAndCompany }; 