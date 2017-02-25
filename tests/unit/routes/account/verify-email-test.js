import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const firebaseStub = Ember.Service.extend({
  auth(){
    let email = this.get('emailVerified');
    let shouldFail = this.get('shouldFail');
    return  {
      currentUser: {
        emailVerified: email,
        sendEmailVerification(){
          return new Ember.RSVP.Promise(function(resolve, reject){
            if(shouldFail){
              reject({code: "ERROR"});
            }else{
              resolve();
            }
          });
        }
      }
    };
  },
  emailVerified: false,
  shouldFail: false
});

// const notifyStub = Ember.Service.extend({
//   lastMessage: "",
//   alert(message){
//     this.set("lastMessage", message);
//   },
//   info(message){
//     this.set("lastMessage", message);
//   }
// });

moduleFor('route:account/verify-email', 'Unit | Route | account/verify email', {
  unit: true,
  beforeEach: function(){
    this.register('service:firebaseApp', firebaseStub);
    // this.register('service:notify', notifyStub);
  },
  needs: ['service:notify', 'service:firebaseApp', 'service:account-config']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});

test('Should send e-mail', function(assert){
  let route = this.subject();
  let promise = route.send("sendEmailVerification");

  promise.then(() => {
    assert.ok(true);
  }, () =>{
    assert.ok(false);
  });
  // assert.equal(route.get('notify.lastMessage'), 'Email verification was sent, please check your inbox');
});