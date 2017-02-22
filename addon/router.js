export default function(router) {
  router.route('account', function() {
    this.route('delete');
    this.route('email');
    this.route('password');
    this.route('verify-email');
  });
}