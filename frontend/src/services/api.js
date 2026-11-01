import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token from localStorage on every request (if user signed up)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('debateai_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auto-handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stale token without forcing hard page reloads
      localStorage.removeItem('debateai_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  getMe: () => api.get('/auth/me/'),
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  updateProfile: (data) => api.patch('/auth/me/', data),
  completeOnboarding: (data) => api.patch('/auth/me/', { ...data, onboarding_completed: true }),
};

export const vocabularyAPI = {
  list: (dueOnly = false, lang = 'en') => api.get('/vocabulary/?due=' + dueOnly + '&lang=' + lang),
  create: (data) => api.post('/vocabulary/', data),
  update: (id, data) => api.patch('/vocabulary/' + id + '/', data),
  delete: (id) => api.delete('/vocabulary/' + id + '/'),
  expand: (word, lang = 'en') => api.post('/vocabulary/ai-expand/', { word, lang }),
};

export const debatesAPI = {
  list: () => api.get('/debates/'),
  create: (data) => api.post('/debates/', data),
  getDetail: (id) => api.get(`/debates/${id}/`),
  submitTurn: (id, text, lang = 'en') => api.post(`/debates/${id}/turn/`, { text, lang }),
  finish: (id) => api.post(`/debates/${id}/finish/`),
  reflect: (id, reflection_text, lang = 'en') => api.post('/debates/' + id + '/reflect/', { reflection_text, lang }),
  submitPerspective: (id, opposite_perspective_text, lang = 'en') => api.post('/debates/' + id + '/perspective/', { opposite_perspective_text, lang }),
  manage: (id, data) => api.patch('/debates/' + id + '/manage/', data),
  deleteDebate: (id) => api.delete('/debates/' + id + '/manage/'),
  export: (id) => api.get('/debates/' + id + '/export/'),
  search: (q, persona = '', minScore = 0) => api.get('/debates/search/?q=' + encodeURIComponent(q) + '&persona=' + persona + '&min_score=' + minScore),
};

export const achievementsAPI = {
  list: () => api.get('/achievements/'),
};

export const libraryAPI = {
  getFallacies: (lang = 'en') => api.get(`/library/fallacies/?lang=${lang}`),
  getQuizzes: (lang = 'en') => api.get(`/library/quizzes/?lang=${lang}`),
  submitQuiz: (quiz_id, selected_option, lang = 'en') => api.post('/library/quizzes/', { quiz_id, selected_option, lang }),
  getBookClub: (lang = 'en') => api.get('/library/book-club/?lang=' + lang),
};

export const communityAPI = {
  getFeed: () => api.get('/community/'),
  publish: (debate_id, title, description) => api.post('/community/', { debate_id, title, description }),
  toggleLike: (id) => api.post(`/community/${id}/like/`),
  addComment: (id, content) => api.post(`/community/${id}/comments/`, { content }),
};

export const coachingAPI = {
  getDNA: () => api.get('/coaching/dna/'),
  getReport: () => api.get('/coaching/report/'),
  getTournaments: () => api.get('/coaching/tournaments/'),
  getMissions: () => api.get('/coaching/missions/'),
  claimMission: (id) => api.post('/coaching/missions/' + id + '/claim/'),
  generateSandbox: (exercise_type, lang = 'en') => api.post('/coaching/sandbox/generate/', { exercise_type, lang }),
  evaluateSandbox: (data) => api.post('/coaching/sandbox/evaluate/', data),
  getTimeline: () => api.get('/coaching/timeline/'),
  getCapsule: (lang = 'en') => api.get('/coaching/capsule/?lang=' + lang),
};

export const adminAPI = {
  getTelemetry: () => api.get('/admin/telemetry/'),
  getUsers: () => api.get('/admin/users/'),
  userAction: (id, action) => api.post(`/admin/users/${id}/action/`, { action }),
  getAudit: () => api.get('/admin/audit/'),
};

export default api;
