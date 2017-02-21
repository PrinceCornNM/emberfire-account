import Ember from 'ember';
import config from '../config/environment';


const DEFAULT_CONFIG = {
    hardDelete: false,
    links: {
      'account.user': 'User',
      'account.email': 'Email',
      'account.password': 'Password',
      'account.delete': 'Delete'
    },
    messages: {
      successful_login: 'You have logged in successfully!',
      unsuccessful_login: 'You were unable to log in.',
      successful_update_account: 'You have successfully updated your account information!',
      unsuccessful_update_account: 'We were unable to update your account information.',
      successful_update_email: 'You have successfully updated your email!',
      unsuccessful_update_email: 'We were unable to update your email.',
      successful_update_password: 'You have successfully updated your password!',
      usuccessful_update_password: 'We were unable to update your password.',
      successful_delete_account: 'You have successfully deleted your account!',
      unsuccessful_delete_account: 'We were unable to delete your account.',
      successful_logout: 'You are now logged out!',
      unsuccessful_logout: 'We were unable to log out of your account.'
    }
};

const { merge, set } = Ember;

export function initialize( appInstance ) {
  let configService = appInstance.lookup('service:account-config');

  let efConfig = {};

  Object.keys(config['emberfire-account']).forEach((key) => {
    if (typeof config['emberfire-account'][key] === 'object') {
      efConfig[key] = merge(DEFAULT_CONFIG[key], config['emberfire-account'][key])
    }
  });

  Object.keys(efConfig).forEach((key) => {
    set(configService, key, efConfig[key]);
  });
}

export default {
  name: 'route-initializer',
  initialize
};

