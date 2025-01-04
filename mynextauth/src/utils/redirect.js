// src/utils/redirect.js
const RedirectUserBasedOnRole = (router, role) => {
  console.log("in redirect : role: ",role);
  console.log("in redirect, router: ",router);
  const roleRoutes = {
      SuperAdmin: '/superadmin/dashboard',
      Admin: '/admin/dashboard',
      SubAdmin: '/subadmin/dashboard',
      Artist: '/artist/dashboard',
      User: '/user/dashboard',
  };

  router.push(roleRoutes[role] || "/user/dashboard");
};

export default RedirectUserBasedOnRole;
