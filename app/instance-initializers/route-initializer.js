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

