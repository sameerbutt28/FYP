


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

    // Generate the referral link when the referral code is available
    useEffect(() => {
        if (referralCode) {
            setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
        }
    }, [referralCode]);

    // Fetch referred users
    const fetchReferredUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/referred-users?referralCode=${referralCode}`);
            setReferrals(response.data.referredUsers || []);
        } catch (error) {
            console.error("Error fetching referred users:", error);
        }
    };

    // Fetch referred users when the referral code changes
    useEffect(() => {
        if (referralCode) {
            fetchReferredUsers();
        }
    }, [referralCode]);

    // Handle submission of new referral code
    const handleReferralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/referral/link', 
                { referrerCode: newReferralCode }, 
                { withCredentials: true } // Ensure credentials are sent
            );
            alert(response.data); // Handle success message
            setNewReferralCode(''); // Clear input after submission
        } catch (error) {
            console.error("Error linking referral:", error);
            alert("Error linking referral: " + error.response?.data || "Unknown error");
        }
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <h2>Name: {name}</h2>
            <h2>Email: {email}</h2>
            <h2>Referral Code: {referralCode}</h2>
            <h3>Referral Link: <a href={referralLink}>{referralLink}</a></h3>

            <form onSubmit={handleReferralSubmit}>
                <h3>Enter Referral Code</h3>
                <input
                    type="text"
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                    placeholder="Referral Code"
                    required
                />
                <button type="submit">Submit</button>
            </form>

            <div className="referrals-section">
                <h3>Referred Users:</h3>
                {referrals.length > 0 ? (
                    <ul>
                        {referrals.map((user, index) => (
                            <li key={index}>{user.name} ({user.email})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No referred users yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
