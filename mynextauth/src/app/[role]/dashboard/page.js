/* // frontend/src/app/[role]/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import Dashboard from '../../../components/Common/Dashboard';

const RoleDashboard = ({ params }) => {
  console.log("in RoleDashboard, params : ",params) ;
  const role = params.role || ''; // Fetch the dynamic role from the URL
  const [capitalizedRole, setCapitalizedRole] = useState(null);

  useEffect(() => {
    if (role) {
      setCapitalizedRole(role.charAt(0).toUpperCase() + role.slice(1)); // Capitalize the role
    }
  }, [role]);

  if (!capitalizedRole) {
    return <div>Loading...</div>;
  }

  return <Dashboard role={capitalizedRole} />;
};

export default RoleDashboard;
 */

/* 'use client';

import { useEffect, useState } from 'react';
import Dashboard from '../../../components/Common/Dashboard';
import { use } from 'react';

const RoleDashboard = ({ params }) => {
  const resolvedParams = use(params); // Unwrap the promise using use()
  console.log("in RoleDashboard, resolvedParams : ", resolvedParams);

  const role = resolvedParams.role || ''; // Fetch the dynamic role from the URL
  const [capitalizedRole, setCapitalizedRole] = useState(null);

  useEffect(() => {
    if (role) {
      setCapitalizedRole(role.charAt(0).toUpperCase() + role.slice(1)); // Capitalize the role
    }
  }, [role]);

  if (!capitalizedRole) {
    return <div>Loading...</div>;
  }

  return <Dashboard role={capitalizedRole} />;
};

export default RoleDashboard; */


// 'use client';

// import Dashboard from '../../../components/Common/Dashboard';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const RoleDashboard = ({ params: asyncParams }) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [role, setRole] = useState(null);

//   // Unwrap params and set the role state
//   useEffect(() => {
//     asyncParams.role
//       .then(setRole)
//       .catch(() => {
//         router.push('/auth/login');
//       });
//   }, [asyncParams, router]);

//   // Handle redirection when session or role is loaded
//   useEffect(() => {
//     if (status === 'authenticated' && session && role) {
//       if (session.user.role !== role) {
//         router.push(`/${session.user.role}/dashboard`);
//       }
//     }
//   }, [status, session, role, router]);

//   // Loading states
//   if (status === 'loading' || !role) {
//     return <div>Loading...</div>;
//   }

//   // Render the dashboard only if everything is valid
//   return <Dashboard role={role} permissions={session?.user?.permissions || {}} />;
// };

// export default RoleDashboard;

'use client';

import Dashboard from '../../../components/Common/Dashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { use } from 'react'; // Importing use hook for unwrapping promises

const RoleDashboard = ({ params: asyncParams }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Use the `use` hook to unwrap the promise directly
  const params = use(asyncParams); 
  const role = params?.role; // Now `params` is resolved and can be accessed safely

  // Handle redirection when session or role is loaded
  useEffect(() => {
    if (status === 'authenticated' && session && role) {
      if (session.user.role !== role) {
        router.push(`/${session.user.role}/dashboard`);
      }
    }
  }, [status, session, role, router]);

  // Loading states
  if (status === 'loading' || !role) {
    return <div>Loading...</div>;
  }

  // Render the dashboard only if everything is valid
  return <Dashboard role={role} permissions={session?.user?.permissions || {}} />;
};

export default RoleDashboard;
