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

'use client';

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

export default RoleDashboard;
