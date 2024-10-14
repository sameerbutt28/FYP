


// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const Profile = () => {
//     const location = useLocation();
//     const query = new URLSearchParams(location.search);

//     const name = query.get('name');
//     const email = query.get('email');
//     const referralCode = query.get('referralCode');

//     const [referrals, setReferrals] = useState([]);
//     const [referralLink, setReferralLink] = useState('');
//     const [newReferralCode, setNewReferralCode] = useState('');

//     // Generate the referral link when the referral code is available
//     useEffect(() => {
//         if (referralCode) {
//             setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
//         }
//     }, [referralCode]);

//     // Fetch referred users
//     const fetchReferredUsers = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/api/referred-users?referralCode=${referralCode}`);
//             setReferrals(response.data.referredUsers || []);
//         } catch (error) {
//             console.error("Error fetching referred users:", error);
//         }
//     };

//     // Fetch referred users when the referral code changes
//     useEffect(() => {
//         if (referralCode) {
//             fetchReferredUsers();
//         }
//     }, [referralCode]);

//     // Handle submission of new referral code
//     const handleReferralSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:3000/referral/link', 
//                 { referrerCode: newReferralCode }, 
//                 { withCredentials: true } // Ensure credentials are sent
//             );
//             alert(response.data); // Handle success message
//             setNewReferralCode(''); // Clear input after submission
//         } catch (error) {
//             console.error("Error linking referral:", error);
//             alert("Error linking referral: " + error.response?.data || "Unknown error");
//         }
//     };

//     return (
//         <div className="profile-container">
//             <h1>User Profile</h1>
//             <h2>Name: {name}</h2>
//             <h2>Email: {email}</h2>
//             <h2>Referral Code: {referralCode}</h2>
//             <h3>Referral Link: <a href={referralLink}>{referralLink}</a></h3>

//             <form onSubmit={handleReferralSubmit}>
//                 <h3>Enter Referral Code</h3>
//                 <input
//                     type="text"
//                     value={newReferralCode}
//                     onChange={(e) => setNewReferralCode(e.target.value)}
//                     placeholder="Referral Code"
//                     required
//                 />
//                 <button type="submit">Submit</button>
//             </form>

//             <div className="referrals-section">
//                 <h3>Referred Users:</h3>
//                 {referrals.length > 0 ? (
//                     <ul>
//                         {referrals.map((user, index) => (
//                             <li key={index}>{user.name} ({user.email})</li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No referred users yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Profile;











import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const name = query.get('name');
    const email = query.get('email');
    const referralCode = query.get('referralCode');

    const [referrals, setReferrals] = useState([]);
    const [referralLink, setReferralLink] = useState('');
    const [newReferralCode, setNewReferralCode] = useState('');

    useEffect(() => {
        if (referralCode) {
            // Enclose the URL in quotes
            setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
        }
    }, [referralCode]);

    const fetchReferredUsers = async () => {
        try {
            // Enclose the URL in quotes
            const response = await axios.get(`http://localhost:3000/api/referred-users?referralCode=${referralCode}`);
            setReferrals(response.data.referredUsers || []);
        } catch (error) {
            console.error("Error fetching referred users:", error);
        }
    };

    useEffect(() => {
        if (referralCode) {
            fetchReferredUsers();
        }
    }, [referralCode]);

    const handleReferralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/referral/link', 
                { referrerCode: newReferralCode }, 
                { withCredentials: true } 
            );
            alert(response.data);
            setNewReferralCode('');
        } catch (error) {
            console.error("Error linking referral:", error);
            alert("Error linking referral: " + error.response?.data || "Unknown error");
        }
    };

    return (
        <div style={styles.profileContainer}>
            <h1 style={styles.title}>User Profile</h1>
            <div style={styles.profileInfo}>
                <h2 style={styles.infoText}>Name: <span>{name}</span></h2>
                <h2 style={styles.infoText}>Email: <span>{email}</span></h2>
                <h2 style={styles.infoText}>Referral Code: <span>{referralCode}</span></h2>
                <h3 style={styles.linkText}>Referral Link: <a href={referralLink} style={styles.link}>{referralLink}</a></h3>
            </div>

            <form style={styles.referralForm} onSubmit={handleReferralSubmit}>
                <h3 style={styles.subtitle}>Enter Referral Code</h3>
                <input
                    type="text"
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                    placeholder="Referral Code"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Submit</button>
            </form>

            <div style={styles.referralsSection}>
                <h3 style={styles.subtitle}>Referred Users:</h3>
                {referrals.length > 0 ? (
                    <table style={styles.referralsTable}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.tableCell}>Name</th>
                                <th style={styles.tableCell}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map((user, index) => (
                                <tr key={index} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{user.name}</td>
                                    <td style={styles.tableCell}>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={styles.noReferrals}>No referred users yet.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    profileContainer: {
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        background: '#333',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profileInfo: {
        marginBottom: '20px',
    },
    infoText: {
        fontSize: '20px',
        margin: '10px 0',
    },
    linkText: {
        fontSize: '18px',
    },
    link: {
        color: '#1e90ff',
        textDecoration: 'underline',
    },
    referralForm: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '24px',
        margin: '15px 0',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '16px',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    referralsSection: {
        marginTop: '20px',
    },
    referralsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    tableCell: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
        textAlign: 'left',
    },
    tableRow: {
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
    },
    noReferrals: {
        color: '#ccc',
        fontStyle: 'italic',
    },
};

export default Profile; 