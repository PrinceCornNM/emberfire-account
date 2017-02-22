export default function(router) {
  router.route('account', function() {
    this.route('delete');
    this.route('email');
    this.route('password');
<<<<<<< HEAD
    this.route('verify-email');
=======
    this.route('delete');
    this.route('portal', {path: '/'});
>>>>>>> c73d6fc96d78382fb690158b4cf4aeed9ddf4a32
  });
}