export default function(router) {
  router.route('account', function() {
    this.route('email');
    this.route('password');
    this.route('delete');
  });
}