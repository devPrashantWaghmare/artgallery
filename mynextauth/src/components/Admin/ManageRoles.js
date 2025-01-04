// import React, { useState, useEffect } from 'react';
// import axios from '../../services/api';
// import '../../styles/ManageRoles.css';

// const ManageRoles = () => {
//     const [contentCreators, setContentCreators] = useState([]);
//     const [subadmins, setSubadmins] = useState([]);
//     const [selectedSubadmin, setSelectedSubadmin] = useState('');
//     const [selectedCreators, setSelectedCreators] = useState([]);
//     const [subadminCreators, setSubadminCreators] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Fetch roles (content creators and subadmins)
//     const fetchRoles = async () => {
//         try {
//             setLoading(true);
//             const [creatorsResponse, subadminsResponse] = await Promise.all([
//                 axios.get('/api/admin/roles/filter?role=artist', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 }),
//                 axios.get('/api/admin/roles/filter?role=subadmin', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 }),
//             ]);
//             setContentCreators(creatorsResponse.data);
//             setSubadmins(subadminsResponse.data);
//         } catch (err) {
//             console.error('Error fetching roles:', err);
//             setError('Failed to fetch roles. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Assign selected content creators to subadmin
//     const handleAssignSubadmin = async () => {
//         if (!selectedSubadmin) {
//             setError('Please select a subadmin.');
//             return;
//         }
//         if (selectedCreators.length === 0) {
//             setError('Please select at least one content creator.');
//             return;
//         }
//         try {
//             await axios.post(
//                 '/api/admin/roles/assign-subadmin',
//                 {
//                     subadminId: selectedSubadmin,
//                     contentCreatorIds: selectedCreators,
//                 },
//                 { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//             );
//             setSelectedCreators([]);
//             fetchRoles(); // Refresh the roles
//         } catch (err) {
//             console.error('Error assigning subadmin:', err);
//             setError('Failed to assign content creators. Please try again.');
//         }
//     };

//     // Fetch creators assigned to a selected subadmin
//     const fetchSubadminCreators = async (subadminId) => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/api/admin/roles/subadmin-creators/${subadminId}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//             setSubadminCreators(response.data);
//         } catch (err) {
//             console.error('Error fetching subadmin creators:', err);
//             setError('Failed to fetch creators for this subadmin.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRoles();
//     }, []);

//     const filteredContentCreators = contentCreators.filter((creator) =>
//         creator.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="manage-roles-container">
//             <h1>Manage Roles</h1>
//             {error && <div className="error-message">{error}</div>}

//             {/* Assign Content Creators to Subadmin */}
//             <div className="assign-section">
//                 <h2>Assign Content Creators to Subadmin</h2>
//                 <div className="form-group">
//                     <label>Select Subadmin:</label>
//                     <select
//                         value={selectedSubadmin}
//                         onChange={(e) => setSelectedSubadmin(e.target.value)}
//                     >
//                         <option value="">-- Select Subadmin --</option>
//                         {subadmins.map((subadmin) => (
//                             <option key={subadmin._id} value={subadmin._id}>
//                                 {subadmin.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="search-bar">
//                     <input
//                         type="text"
//                         placeholder="Search Content Creators"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//                 <div className="content-creators-list">
//                     {filteredContentCreators.map((creator) => (
//                         <label key={creator._id} className="creator-checkbox">
//                             <input
//                                 type="checkbox"
//                                 value={creator._id}
//                                 checked={selectedCreators.includes(creator._id)}
//                                 onChange={(e) => {
//                                     const id = e.target.value;
//                                     setSelectedCreators((prev) =>
//                                         prev.includes(id)
//                                             ? prev.filter((creatorId) => creatorId !== id)
//                                             : [...prev, id]
//                                     );
//                                 }}
//                             />
//                             {creator.name}
//                         </label>
//                     ))}
//                 </div>
//                 <button className="assign-btn" onClick={handleAssignSubadmin}>
//                     Assign
//                 </button>
//             </div>

//             {/* View Subadmin's Assigned Creators */}
//             <div className="view-section">
//                 <h2>View Assigned Creators</h2>
//                 <div className="form-group">
//                     <label>Select Subadmin:</label>
//                     <select
//                         onChange={(e) => fetchSubadminCreators(e.target.value)}
//                     >
//                         <option value="">-- Select Subadmin --</option>
//                         {subadmins.map((subadmin) => (
//                             <option key={subadmin._id} value={subadmin._id}>
//                                 {subadmin.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <table className="creators-table">
//                         <thead>
//                             <tr>
//                                 <th>Creator Name</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {subadminCreators.map((creator) => (
//                                 <tr key={creator._id}>
//                                     <td>{creator.name}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ManageRoles;
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import '../../styles/ManageRoles.css';
import { debounce } from 'lodash'; // lodash debounce for search optimization

const ManageRoles = () => {
    const [contentCreators, setContentCreators] = useState([]);
    const [subadmins, setSubadmins] = useState([]);
    const [selectedSubadmin, setSelectedSubadmin] = useState('');
    const [selectedCreators, setSelectedCreators] = useState([]);
    const [subadminCreators, setSubadminCreators] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch roles (content creators and subadmins)
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const [creatorsResponse, subadminsResponse] = await Promise.all([
                axios.get('/api/admin/roles/filter?role=artist', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }),
                axios.get('/api/admin/roles/filter?role=subadmin', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }),
            ]);
            setContentCreators(creatorsResponse.data);
            setSubadmins(subadminsResponse.data);
        } catch (err) {
            console.error('Error fetching roles:', err);
            setError('Failed to fetch roles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Assign selected content creators to subadmin
    const handleAssignSubadmin = async () => {
        if (!selectedSubadmin) {
            setError('Please select a subadmin.');
            return;
        }
        if (selectedCreators.length === 0) {
            setError('Please select at least one content creator.');
            return;
        }
        try {
            await axios.post(
                '/api/admin/roles/assign-subadmin',
                {
                    subadminId: selectedSubadmin,
                    contentCreatorIds: selectedCreators,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSelectedCreators([]); // Clear selected creators
            setError(null); // Clear previous error
            fetchRoles(); // Refresh the roles
        } catch (err) {
            console.error('Error assigning subadmin:', err);
            setError('Failed to assign content creators. Please try again.');
        }
    };

    // Fetch creators assigned to a selected subadmin
    const fetchSubadminCreators = async (subadminId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/roles/subadmin-creators/${subadminId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSubadminCreators(response.data);
        } catch (err) {
            console.error('Error fetching subadmin creators:', err);
            setError('Failed to fetch creators for this subadmin.');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search function to optimize search input
    const debouncedSearch = debounce((term) => {
        setSearchTerm(term);
    }, 300);

    useEffect(() => {
        fetchRoles();
    }, []);

    const filteredContentCreators = contentCreators.filter((creator) =>
        creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-roles-container">
            <h1>Manage Roles</h1>
            {error && <div className="error-message">{error}</div>}

            {/* Assign Content Creators to Subadmin */}
            <div className="assign-section">
                <h2>Assign Content Creators to Subadmin</h2>
                <div className="form-group">
                    <label htmlFor="subadmin-select">Select Subadmin:</label>
                    <select
                        id="subadmin-select"
                        value={selectedSubadmin}
                        onChange={(e) => setSelectedSubadmin(e.target.value)}
                    >
                        <option value="">-- Select Subadmin --</option>
                        {subadmins.map((subadmin) => (
                            <option key={subadmin._id} value={subadmin._id}>
                                {subadmin.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search Content Creators"
                        onChange={(e) => debouncedSearch(e.target.value)}
                    />
                </div>
                <div className="content-creators-list">
                    {filteredContentCreators.map((creator) => (
                        <label key={creator._id} className="creator-checkbox">
                            <input
                                type="checkbox"
                                value={creator._id}
                                checked={selectedCreators.includes(creator._id)}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setSelectedCreators((prev) =>
                                        prev.includes(id)
                                            ? prev.filter((creatorId) => creatorId !== id)
                                            : [...prev, id]
                                    );
                                }}
                            />
                            {creator.name}
                        </label>
                    ))}
                </div>
                <button className="assign-btn" onClick={handleAssignSubadmin}>
                    {loading ? 'Assigning...' : 'Assign'}
                </button>
            </div>

            {/* View Subadmin's Assigned Creators */}
            <div className="view-section">
                <h2>View Assigned Creators</h2>
                <div className="form-group">
                    <label htmlFor="subadmin-select-view">Select Subadmin:</label>
                    <select
                        id="subadmin-select-view"
                        onChange={(e) => fetchSubadminCreators(e.target.value)}
                    >
                        <option value="">-- Select Subadmin --</option>
                        {subadmins.map((subadmin) => (
                            <option key={subadmin._id} value={subadmin._id}>
                                {subadmin.name}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="creators-table">
                        <thead>
                            <tr>
                                <th>Creator Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subadminCreators.map((creator) => (
                                <tr key={creator._id}>
                                    <td>{creator.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageRoles;
