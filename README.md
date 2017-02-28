# Emberfire Account

Ember Fire Account provides an account dashboard where users can modify their information (e.g. phone or address), an authentication helper called `re-authenticate` for selectively rendering content when a user is logged in, and account menu that displays links to all account pages. Links are currently defined in `account-menu.js`, so they can also be modified there.

## Installation

`ember install emberfire-account`

## Customization

### Account Info Form

We have removed the account info form from the addon as this form can vary greatly depending on your needs. In order to make your own create the route and form template in your application and add this route to the config settings.

Any page you need can be aded this way.

### Ember Notify

We use ember notify to send notifcation messages for cases of success and failure, for example: successfully updating a users email would send the notification "Successfully Updated Email!". Instructions on how to customize these messages and more can be found in the config settings portion of the README. Ember notify is a service that must be added to every page you need it, it is in each addon component and can be found there if needed. For more information visit [ember-notify](https://github.com/aexmachina/ember-notify#custom-animations).

### Routes

If you want to add custom routes add the emberfire account router to your applications router and it gets mounted. You can also place your applications routes into the account router.

```javascript
import accountRouter from 'emberfire-account/router';
import config from './config/environment';

Router.map(function() {

  accountRouter(this);
  this.route('edit-user', { path: 'account/user' });
  this.route('application-route');
});
```

### Styling

If you need custom styling do the following: write styling for: 
* ef-account 
* ef-account-sidebar
* ef-account-form 
* ef-account-form-title 
* ef-account-form-input
* buttons and all types of input you need. 

Each addon page is wrapped in the ef-account class, which is found in the account template. The side-bar also exists within this template as it is on every page. The other classes are found in each individual account component template. The styling for the app can be found in app.css in the styles folder. 

### Validations

Password has a minimum length of 8 and must be present, email must be present and its type must be email. Create your own validations by updating the files in the validations folder.

### Routes

Add your own links by declaring them in the account configuration below. You can also specify routes that link back to your application this way. 

## Config Settings

Can be found in app/instance-initializers. The config initializer specifies default links and messages of the addon. These can be overridden simply by changing their values or adding your customizations to the ENV in the environment.js of your application. Account config must be injected as a service everywhere you need to use it, you can see it used in each component of the addon. Settings that can be overridden include:
```javascript
const EMBERFIRE_ACCOUNT_CONFIGURATION = {
  hardDelete: false,
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
    'account.link': 'Link', *You can provide custom routes here*
    'account.email': 'Update Email',
    'account.delete': 'Delete Account',
    'account.password': 'Change Password',
    'account.verify-email': 'Send Email Verification'
  },
  signInLink: {
    application.signin: 'Log In'
  },
  portalLink: {
    'account.portal': 'Portal'
  }
};
```
## Re-Authenticate

For the update password and email components we have implemented a re-authenticate service which checks to see if the user has been logged in for an extended period of time and if so prevents them from making any changes to email ans password until they enter their credentials again when prompted. Every component for which extra security is needed should have this service.

## Fastboot

If you are using fastboot you must add the emberfire-account addon to fastboot dependencies. In package.json of your app you must add:
```json  
"fastbootDependencies": [
    "firebase",
    "emberfire-account"
  ]
```
## Ember Form For 

We use ember-form-for to create our forms, read more about it [here](https://github.com/martndemus/ember-form-for).

## Ember Changeset Validations

We use ember-changeset-validations to validate our models before saving, read more about it [here](https://github.com/DockYard/ember-changeset-validations).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)








