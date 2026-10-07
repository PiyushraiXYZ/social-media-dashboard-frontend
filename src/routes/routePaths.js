export const PATHS = {
  // Auth
  login: '/login',
  register: '/register',
  confirmEmail: '/confirm-email',
  confirmEmailSuccess: '/confirm-email/success',

  // Workspace
  overview: '/overview',
  firstUse: '/overview/first-use',

  // Posts
  posts: '/posts',
  createPost: '/posts/new',
  generation: (id = ':postId') => `/posts/${id}/generation`,
  postEditor: (id = ':postId') => `/posts/${id}/edit`,
  branding: (id = ':postId') => `/posts/${id}/branding`,

  // Approval
  approval: '/approval-center',
  approvalRequest: (id = ':postId') => `/approval-center/${id}/request`,
  approvalDecision: (id = ':postId') => `/approval-center/${id}/decision`,
  approvalExpired: (id = ':postId') => `/approval-center/${id}/expired`,

  // Scheduling
  calendar: '/calendar',
  scheduleDateTime: (id = ':postId') => `/calendar/schedule/${id}`,
  scheduleConfirm: (id = ':postId') => `/calendar/schedule/${id}/confirm`,

  // Publication
  publishConfirm: (id = ':postId') => `/publish/${id}/confirm`,
  publishProgress: (id = ':postId') => `/publish/${id}/progress`,
  publishResult: (id = ':postId') => `/publish/${id}/result`,
  publishActivity: (id = ':postId') => `/publish/${id}/activity`,

  // Accounts
  accounts: '/social-accounts',
  facebookSelect: '/social-accounts/facebook/select-page',
  instagramSelect: '/social-accounts/instagram/select-account',
  linkedinConnect: '/social-accounts/linkedin/connect',
  accountRecovery: '/social-accounts/recovery',

  // Misc
  notifications: '/notifications',
  brandSettings: '/brand-settings',
};