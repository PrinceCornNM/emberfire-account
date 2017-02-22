export default function(router) {
  router.route('account', function() {
    this.route('email');
    this.route('password');
    this.route('verify-email');
    this.route('delete');
    this.route('portal', {path: '/'});
  });
}