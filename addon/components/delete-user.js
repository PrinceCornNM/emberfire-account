import Ember from 'ember';
import layout from '../templates/components/delete-user';

export default Ember.Component.extend({
  layout,
  className: ['delete-user-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  actions: {
    deleteUser(form){
      const scope = this;
      var user = this.get('firebaseApp').auth().currentUser;
      if(user && user.email === form.email){
        var userId = user.uid;
        user.delete().then(function(){
          Ember.Logger.log('User deleted');
          if(true){ //if hardDelete
            this.get('store').findRecord("user", userId).then(function(rec){
              // console.log(rec.get('f'));
              Ember.Logger.log("User data deleted too!");
              rec.remove();
              scope.get('router').transitionTo('index');
            });
          }
        }, (error)=>{
          if(error.code === 'auth/requires-recent-login')
            this.sendAction('reauthenticateUser');
        });
      }
    }
  },
  init() {
    this._super(...arguments);
    this.delete_form = {email: ''};
    // var user = this.get('firebaseApp').auth().currentUser;
    // if(user){
    //   this.get('store').findRecord("user", user.uid).then(function(rec){
    //     console.log(rec.get('f'));
    //   });
    // }else{
    //   console.log("No user friend");
    // }
  }
});
