const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  age: number;
  occupation: string;
  interests: string[];
  caste?: string;
  rationCard?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  occupation: string;
  interests: string[];
  caste?: string;
  rationCard?: string;
  createdAt: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  applicationUrl?: string;
}

export interface Application {
  id: string;
  userId: string;
  schemeId: string;
  status: 'applied' | 'approved' | 'rejected' | 'pending';
  appliedAt: string;
  approvedAt?: string;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(): Promise<User> {
    return this.request('/user/profile');
  }

  // Schemes endpoints
  async getSchemes(): Promise<Scheme[]> {
    return this.request('/schemes');
  }

  async getScheme(id: string): Promise<Scheme> {
    return this.request(`/schemes/${id}`);
  }

  async getRecommendations(): Promise<Scheme[]> {
    return this.request('/recommendations');
  }

  // Applications endpoints
  async applyForScheme(schemeId: string): Promise<Application> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ schemeId }),
    });
  }

  async getApplications(): Promise<Application[]> {
    return this.request('/applications');
  }

  async getApplication(id: string): Promise<Application> {
    return this.request(`/applications/${id}`);
  }

  // Chat endpoint
  async chat(message: string, schemeId?: string): Promise<{ response: string }> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, schemeId }),
    });
  }
}

export const api = new APIClient(API_URL);
