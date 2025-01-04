import roleSidebarConfig from "../../config/roleSidebarConfig";
import styles from '../../styles/Sidebar.module.css';


const Sidebar = ({ role, setSelectedSection }) => {
    const options = roleSidebarConfig[role.toLowerCase()] || [];
    console.log(options);

    return (
        <aside className={styles.sidebar}>
            <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
            {options.map((option , index) => (
                <button
                key={`${option.section}-${index}`} // Ensure uniqueness
                onClick={() => setSelectedSection(option.section)}
                    className={styles.sidebarButton}
                >
                    {option.label}
                </button>
            ))}
        </aside>
    );
};
export default Sidebar;
