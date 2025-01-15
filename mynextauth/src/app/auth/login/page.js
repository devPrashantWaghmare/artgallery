/* /* // src/app/auth/page.js

import ErrorBoundary from "../../../components/Error/ErrorBoundry";
import AuthPage from "../../../components/Auth/AuthPage";

export default function Authpage() {
  return (
    <ErrorBoundary>
      
      <AuthPage />
    </ErrorBoundary>
  );
}
 */

//src/app/auth/login/page.js

/* 
"use client";
import RedirectUserBasedOnRole from "../../../utils/redirect";
import AuthPage from "../../../components/Auth/AuthPage";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "../../../services/api";
import { useState, useEffect, useCallback } from 'react';
import { getProviders, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 


export default function Component() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getProviders()
      .then((res) => setProviders(Object.values(res || {})))
      .catch((error) => console.error("Failed to fetch providers:", error));
  }, []);

  const { data: session } = useSession();
  if (session) {
    const response = axios.post(
      "/api/auth/social-login",
      {
        token: session.user.token,
        provider: providerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to process social login");
    const data = response.json();
    const role = data.user?.role || "User"; // Use role directly from session
    RedirectUserBasedOnRole(router, role);

    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <AuthPage />
    </>
  );
}
 */

/* 
// src/app/auth/login/page.js
"use client";
import RedirectUserBasedOnRole from "../../../utils/redirect";
import AuthPage from "../../../components/Auth/AuthPage";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "../../../services/api";
import { useState, useEffect } from "react";
import { getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import ErrorBoundary from "../../../components/Error/ErrorBoundry";

export default function Component() {
  const [providers, setProviders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getProviders()
      .then((res) => setProviders(Object.values(res || {})))
      .catch((error) => console.error("Failed to fetch providers:", error));
  }, []);

  const { data: session } = useSession();

  useEffect(() => {
    console.log("LoginPage : Session Data:", session);  // Add this line for debugging

    if (session) {
      axios
        .post("/api/auth/social-login", {
          token: session.user.token,
          provider: "google",
       })   //response from backend api:
        //  res.status(200).json({ token: customToken, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });

        .then((response) => {
          const role = response.data.user?.role || "User";
          RedirectUserBasedOnRole(router, role);
        })
        .catch((error) =>
          console.error("Failed to process social login", error)
        );
      
    }
  }, [session, router]);


  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <ErrorBoundary>
        <AuthPage />
      </ErrorBoundary>
    </>
  );
}
 

 */

// src/app/auth/login/page.js

// 
// "use client";
// import RedirectUserBasedOnRole from "../../../utils/redirect";
// import AuthPage from "../../../components/Auth/AuthPage";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { getProviders } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import ErrorBoundary from "../../../components/Error/ErrorBoundry";

// export default function Component() {
//   debug: true;
//   const [providers, setProviders] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     getProviders()
//       .then((res) => setProviders(Object.values(res || {})))
//       .catch((error) => console.error("Failed to fetch providers:", error));
//   }, []);

//   const { data: session } = useSession();

//   useEffect(() => {
//     console.log("LoginPage : Session Data:", session);  // Add this line for debugging

//     if (session) {
//       // Extract the role from the session and redirect accordingly
//       const role = session.user.role || "User";
//       RedirectUserBasedOnRole(router, role);
//     }
//   }, [session, router]);

//   return (
//     <>
//       Not signed in <br />
//       <ErrorBoundary>
//         <AuthPage />
//       </ErrorBoundary>
//       {/* <AuthPage /> */}
//     </>
//   );
// }

"use client";
import { useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RedirectUserBasedOnRole from "../../../utils/redirect";
import AuthPage from "../../../components/Auth/AuthPage";
import ErrorBoundary from "../../../components/Error/ErrorBoundry";

export default function LoginPage() {
  const [providers, setProviders] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    getProviders()
      .then((res) => setProviders(Object.values(res || [])))
      .catch((error) => console.error("Failed to fetch providers:", error));
  }, []);

  useEffect(() => {
    if (status === "loading") return; 
    if (session) {
      const role = session?.user?.role || "User"; 
      RedirectUserBasedOnRole(router, role); // Pass role
    }
  }, [session, status, router]);

  return (
    <div>
      {!session ? (
        <>
          <p>Not signed in</p>
          <ErrorBoundary>
            <AuthPage providers={providers} />
          </ErrorBoundary>
        </>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}
