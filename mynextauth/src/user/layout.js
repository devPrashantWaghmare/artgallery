// export default function UserLayout({ children }) {
//     return (
//       <div className="user-container">
//         <nav>User Navigation</nav>
//         <main>{children}</main>
//       </div>
//     );
//   }
import Dashboard from "../components/Common/Dashboard";
export default function UserLayout({ children }) {
    return <Dashboard role="User">{children}</Dashboard>;
}
