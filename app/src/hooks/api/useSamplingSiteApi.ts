import { AxiosInstance } from 'axios';
import { ICreateSamplingSiteRequest } from 'features/surveys/observations/sampling-sites/SamplingSitePage';

/**
 * Returns a set of supported api methods for working with search functionality
 *
 * @param {AxiosInstance} axios
 * @return {*} object whose properties are supported api methods.
 */
const useSamplingSiteApi = (axios: AxiosInstance) => {
  /**
   * Get search results (spatial)
   *
   * @return {*}  {Promise<IGetSearchResultsResponse[]>}
   */
  const createSamplingSites = async (
    projectId: number,
    surveyId: number,
    samplingSite: ICreateSamplingSiteRequest
  ): Promise<void> => {
    await axios.post(`/api/project/${projectId}/survey/${surveyId}/sample-site`, samplingSite);
  };

  return {
    createSamplingSites
  };
};

export default useSamplingSiteApi;