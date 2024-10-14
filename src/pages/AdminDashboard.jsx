import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/users', { withCredentials: true });
                setUserStats(response.data);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <h2>Total Users: {userStats.totalUsers}</h2>
            <h2>Referred Users: {userStats.referredUsers}</h2>
            <h2>Users without Referral: {userStats.nonReferredUsers}</h2>

            <h3>User List:</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.header}>Name</th>
                        <th style={styles.header}>Email</th>
                        <th style={styles.header}>Referral Code</th>
                    </tr>
                </thead>
                <tbody>
                    {userStats.users.map((user, index) => (
                        <tr key={index}>
                            <td style={styles.cell}>{user.name}</td>
                            <td style={styles.cell}>{user.email}</td>
                            <td style={styles.cell}>{user.referralCode || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    header: {
        backgroundColor: '#444',
        padding: '10px',
    },
    cell: {
        border: '1px solid #555',
        padding: '10px',
        textAlign: 'left',
    },
};

export default AdminDashboard;
