export default function(router) {
  router.route('account', function() {
    this.route('portal', {path: '/'});
    this.route('email');
    this.route('delete');
    this.route('password');
    this.route('verify-email');
  });
}