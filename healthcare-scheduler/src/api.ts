import axios, { AxiosResponse } from 'axios';
import { RawUser, RawPost, ApiResponse } from './types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const TIMEOUT = 10000; // 10 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class HealthcareAPI {
  /**
   * Fetch all users (healthcare workers)
   */
  static async fetchUsers(): Promise<ApiResponse<RawUser[]>> {
    try {
      console.log('🔄 Fetching healthcare workers...');
      const response: AxiosResponse<RawUser[]> = await apiClient.get('/users');
      
      console.log(`✅ Fetched ${response.data.length} workers`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch all posts (certifications)
   */
  static async fetchPosts(): Promise<ApiResponse<RawPost[]>> {
    try {
      console.log('🔄 Fetching certifications...');
      const response: AxiosResponse<RawPost[]> = await apiClient.get('/posts');
      
      console.log(`✅ Fetched ${response.data.length} certifications`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch both users and posts concurrently
   */
  static async fetchAllData(): Promise<{
    users: ApiResponse<RawUser[]>;
    posts: ApiResponse<RawPost[]>;
  }> {
    console.log('🚀 Starting data fetch...');
    
    const [users, posts] = await Promise.all([
      this.fetchUsers(),
      this.fetchPosts(),
    ]);

    return { users, posts };
  }
}