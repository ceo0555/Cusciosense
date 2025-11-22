import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (data: { emailOrPhone: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/me'),
};

export const schoolsAPI = {
  getAll: (params?: any) => api.get('/schools', { params }),
  getOne: (id: string) => api.get(`/schools/${id}`),
  create: (data: any) => api.post('/schools', data),
  update: (id: string, data: any) => api.put(`/schools/${id}`, data),
  delete: (id: string) => api.delete(`/schools/${id}`),
};

export const classesAPI = {
  getAll: (params?: any) => api.get('/classes', { params }),
  getOne: (id: string) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: string, data: any) => api.put(`/classes/${id}`, data),
  enrollStudent: (classId: string, data: any) =>
    api.post(`/classes/${classId}/students`, data),
};

export const homeworkAPI = {
  getAll: (classSubjectId: string) =>
    api.get('/homework', { params: { classSubjectId } }),
  getOne: (id: string) => api.get(`/homework/${id}`),
  create: (data: any) => api.post('/homework', data),
  submit: (id: string, data: any) => api.post(`/homework/${id}/submit`, data),
  getMySubmission: (id: string) => api.get(`/homework/${id}/my-submission`),
  gradeSubmission: (submissionId: string, data: any) =>
    api.put(`/homework/submissions/${submissionId}/grade`, data),
};

export const attendanceAPI = {
  mark: (classId: string, data: any) => api.post(`/attendance/${classId}`, data),
  get: (classId: string, params: any) =>
    api.get(`/attendance/${classId}`, { params }),
  getStudent: (studentId: string, params: any) =>
    api.get(`/attendance/student/${studentId}`, { params }),
};

export const examsAPI = {
  getAll: (schoolId: string) => api.get('/exams', { params: { schoolId } }),
  getOne: (id: string) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams', data),
};

export const feesAPI = {
  getStructures: (schoolId: string) =>
    api.get('/fees/structures', { params: { schoolId } }),
  getStudentFees: (studentId: string) =>
    api.get(`/fees/student/${studentId}`),
  createPayment: (data: any) => api.post('/fees/payments', data),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};
