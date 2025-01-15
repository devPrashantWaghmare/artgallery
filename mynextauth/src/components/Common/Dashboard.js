/*  'use client';
//frontend/src/components/Common/Dashboard.js
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../../styles/Dashboard.module.css';
import roleSidebarConfig from '../../config/roleSidebarConfig';
import sectionComponents from './sectionComponents';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const { data: session } = useSession();
  const [selectedSection, setSelectedSection] = useState('');

  if (!session) {
    return (
      <div className={styles.authPrompt}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()} className={styles.signInButton}>
          Sign in
        </button>
      </div>
    );
  }

  const role = session.user.role || 'user'; // Assuming `role` is part of session data
  const renderContent = () => {
    if (!selectedSection) {
      return <div>Welcome to the {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</div>;
    }

    const SectionComponent = sectionComponents[selectedSection];
    return SectionComponent ? <SectionComponent /> : <div>Section not found</div>;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar role={role} setSelectedSection={setSelectedSection} />
      <main className={styles.dashboardContent}>
        <div className={styles.welcome}>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign out
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; */



'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../../styles/Dashboard.module.css';
import roleSidebarConfig from '../../config/roleSidebarConfig';
import sectionComponents from './sectionComponents';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');


  useEffect(() => {
    if (session) {
      setUserData(session.user);
    } else {
      // Fallback: Load from localStorage if session is unavailable
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (name && role && token) {
        setUserData({ name, role, token });
      }
    }
  }, [session]);

  if (!userData) {
    return (
      <div className={styles.authPrompt}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()} className={styles.signInButton}>
          Sign in
        </button>
      </div>
    );
  }

  const role = userData.role || 'User';
  const renderContent = () => {
    if (!selectedSection) {
      return <div>Welcome to the {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</div>;
    }

    const SectionComponent = sectionComponents[selectedSection];
    return SectionComponent ? <SectionComponent /> : <div>Section not found</div>;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar role={role} setSelectedSection={setSelectedSection} />
      <main className={styles.dashboardContent}>
        <div className={styles.welcome}>
          <p>Welcome, {userData.name}</p>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign out
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;

/* 
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../../styles/Dashboard.module.css';
import sectionComponents from './sectionComponents';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(''); // Initialize state here

  useEffect(() => {
    if (session) {
      setUserData(session.user);
    } else {
      // Fallback: Load from localStorage if session is unavailable
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (name && role && token) {
        setUserData({ name, role, token });
      }
    }
  }, [session]);

  if (!userData) {
    return (
      <div className={styles.authPrompt}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()} className={styles.signInButton}>
          Sign in
        </button>
      </div>
    );
  }

  const role = userData.role || 'user';
  const renderContent = () => {
    if (!selectedSection) {
      return <div>Welcome to the {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</div>;
    }

    const SectionComponent = sectionComponents[selectedSection];
    return SectionComponent ? <SectionComponent /> : <div>Section not found</div>;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar role={role} setSelectedSection={setSelectedSection} />
      <main className={styles.dashboardContent}>
        <div className={styles.welcome}>
          <p>Welcome, {userData.name}</p>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign out
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;


 */
/* 
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from '../../styles/Dashboard.module.css';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      setUserData(session.user);
    } else if (status === 'unauthenticated') {
      signIn(); // Redirect unauthenticated users
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return (
      <div className={styles.authPrompt}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()} className={styles.signInButton}>
          Sign in
        </button>
      </div>
    );
  }
console.log("In Dashboard : userData: ",userData);
  const renderContent = () => {
    return <div>Welcome to the {userData.role} Dashboard</div>;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar role={userData.role} />
      <main className={styles.dashboardContent}>
        <div>
          <p>Welcome, {userData.name}</p>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            Sign out
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
 */