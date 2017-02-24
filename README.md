# Ember Fire Account

This README outlines the details of collaborating on this Ember addon, Ember Fire Account.

## Features

Ember Fire Account provides an account dashboard where users can modify their information (e.g. phone or address), an authentication helper called `re-authenticate` for selectively rendering content when a user is logged in, and account menu that displays links to all account pages. Links are currently defined in `account-menu.js`, so they can also be modified there.

## Installation

* `git clone <repository-url>` this repository
* `cd emberfire-account`
* `npm install`
* `bower install`

## Running

* `ember server` (or the shortand, `ember s`)
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Fastboot

If you are using fastboot you must add the emberfire-account addon to fastboot dependencies. In package.json of your parent app you must add:
```  "fastbootDependencies": [
    "firebase",
    "emberfire-account"
  ]
```

## Re-Authenticate

For the update password and email components we have implemented a re-authenticate service which checks to see if the user has been logged in for an extended period of time and if so prevents them from making any changes to email ans password until they enter their credentials again when prompted. Every component for which extra security is needed should have this service.

## Config Settings

Can be found in app/instance-initializers. The config initializer specifies default links and messages of the addon. These can be overridden simply by changing their values or adding your customizations to the ENV in the environment.js of your parent application. Account config must be injected as a service everywhere you need to use it, you can see it used in each component of the addon. Settings that can be overridden include:
```javascript
const DEFAULT_CONFIG = {
  hardDelete: false,
  links: {
    'account.delete': 'Delete Account',
    'account.email': 'Update Email',
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
    unsuccessfulCreateAccount: 'We were unable to create your account.'
  },
links: {
      'edit-user': 'Edit User Info',
      'account.email': 'Update Email',
      'account.delete': 'Delete Account',
      'account.password': 'Change Password',
      'account.verify-email': 'Send Email Verification'
    },
    signInLink: {
      signin: 'Log In'
    },
    portalLink: {
      'edit-user': 'Portal'
    }
};
```

## Customization

### Account Info Form

We have removed the account info form from the addon as this form can vary greatly depending on your needs. To make your own create your route and form template in your parent application and add this route to the config settings.

### Ember Notify

We use ember notify to send notifcation messages for cases of success and failure, for example: successfully updating a users email would send the notification "Successfully Updated Email!". Instructions on how to customize these messages and more can be found in the config settings portion of the README. Ember notify is a service that must be added to every page you need it, it is in each addon component and can be found there if needed. For more information visit [ember-notify](https://github.com/aexmachina/ember-notify#custom-animations).

### Routes

If you want the custom routes add the router to your router and it gets mounted.

### Styling

If you need custom styling do the following: write styling for: 
* ef-account 
* ef-account-sidebar
* ef-account-form 
* ef-account-form-title 
* ef-account-form-input
buttons and all types of input you need. Each addon page is wrapped in the ef-account class, which is found in the account template. The side-bar also exists within this template as it is on every page. The other classes are found in each individual account component template. The styling for the app can be found in app.css. 

### Pages

You can create custom pages by adding them to the account menu component. Custom links are specified in the config settings.

#### Account Portal

Creating your own account portal is as easy as changing the key and value of portalLink, found in config settings. 

#### Sign In Link

If you need to change the default sign in link you can do this by removing the default link in signInLink, found in config settings, and adding your own.





