import Ember from 'ember';
import config from '../config/environment';

const DEFAULT_CONFIG = {
  hardDelete: false,
  links: {
    'account.delete': 'Delete Account',
    'account.email': 'Change Email',
    'account.password': 'Change Password',
    'account.verify-email': 'Send Email Verification'
  },
  messages: {
    successfulLogin: 'You have logged in successfully!',
    unsuccessfulLogin: 'You were unable to log in.',
    successfulUpdateAccount: 'You have successfully updated your account information!',
    unsuccessfulUpdateAccount: 'We were unable to update your account information.',
    successfulUpdateEmail: 'You have successfully updated your email!',
    unsuccessfulUpdateEmail: 'We were unable to update your email.',
    successfulUpdatePassword: 'You have successfully updated your password!',
    unsuccessfulUpdatePassword: 'We were unable to update your password.',
    successfulDeleteAccount: 'You have successfully deleted your account!',
    unsuccessfulDeleteAccount: 'We were unable to delete your account.',
    successfulLogout: 'You are now logged out!',
    unsuccessfulLogout: 'We were unable to log out of your account.',
    successfulCreateAccount: 'You have created an account successfully!',
    unsuccessfulCreateAccount: 'We were unable to create your account.',
    currentEmailPrompt: 'Your current account email adress is: ',
    incorrectPassword: 'That is an incorrect password.'
  }
};

const { merge, set } = Ember;

export function initialize(appInstance) {
  let configService = appInstance.lookup('service:account-config');
  let efConfig = {};

  Object.keys(DEFAULT_CONFIG).forEach(() => {
    efConfig = merge(DEFAULT_CONFIG, config['emberfire-account']);
  });

  Object.keys(efConfig).forEach((key) => {
    set(configService, key, efConfig[key]);
  });
}

export default {
  name: 'route-initializer',
  initialize
};