import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users data from the backend when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/api/admin/dashboard', { withCredentials: true })
            .then(response => {
                setUsers(response.data.users);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching admin dashboard data:', error);
                setLoading(false);
            });
    }, []);

    // Render a loading state while data is being fetched
    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
    }

    // Inline styles for dark theme
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#1e1e2f', // Dark background
            color: '#ffffff', // White text
            minHeight: '100vh',
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',
            color: '#ffffff',
            marginBottom: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            margin: '0 auto',
            backgroundColor: '#2a2a40', // Darker table background
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        th: {
            textAlign: 'left',
            padding: '12px 15px',
            backgroundColor: '#3e3e5e', // Header row background
            color: '#ffffff', // White text
            fontWeight: 'bold',
            border: '1px solid #444',
        },
        td: {
            textAlign: 'left',
            padding: '12px 15px',
            border: '1px solid #444',
            color: '#cccccc', // Light gray text for better readability
        },
        rowEven: {
            backgroundColor: '#242438', // Slightly lighter row background
        },
        downlineUser: {
            margin: '5px 0',
            fontSize: '0.9rem',
            color: '#bbbbbb', // Slightly lighter gray for downline users
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Admin Dashboard</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Referral Code</th>
                        <th style={styles.th}>Upline (Referred By)</th>
                        <th style={styles.th}>Downline (Referred Users)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} style={index % 2 === 0 ? styles.rowEven : {}}>
                            <td style={styles.td}>{user.name}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>{user.referralCode}</td>
                            <td style={styles.td}>{user.referredBy || 'None'}</td>
                            <td style={styles.td}>
                                {user.referredUsersList.length > 0
                                    ? user.referredUsersList.map((downline, idx) => (
                                        <div key={idx} style={styles.downlineUser}>
                                            {downline.name} ({downline.email})
                                        </div>
                                    ))
                                    : 'No downline'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
