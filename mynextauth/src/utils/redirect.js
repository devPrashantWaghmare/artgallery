// src/utils/redirect.js
const RedirectUserBasedOnRole = (router, role ="User") => {
  console.log("in redirect : role: ",role);
  console.log("in redirect, router: ",router);
  const roleRoutes = {
      SuperAdmin: '/superadmin/dashboard',
      Admin: '/admin/dashboard',
      SubAdmin: '/subadmin/dashboard',
      Artist: '/artist/dashboard',
      User: '/user/dashboard',
  };

  router.push(roleRoutes[role] || roleRoutes.User);
};

export default RedirectUserBasedOnRole;
