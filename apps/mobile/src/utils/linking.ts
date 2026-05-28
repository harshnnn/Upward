export const linking = {
  prefixes: ['upward://', 'https://upward.app', 'https://www.upward.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup'
        }
      },
      Main: {
        screens: {
          Dashboard: 'dashboard',
          Settings: 'settings',
          Profile: 'profile'
        }
      }
    }
  }
};

export default linking;
