// import React, { useEffect, useState } from "react";
// import { SectionTitle } from "../components";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [id, setId] = useState(localStorage.getItem("id"));
//   const [userData, setUserData] = useState({});
//   const loginState = useSelector((state) => state.auth.isLoggedIn);
//   const wishItems = useSelector((state) => state.wishlist.wishItems);
//   const [userFormData, setUserFormData] = useState({
//     id: "",
//     name: "",
//     lastname: "",
//     email: "",
//     phone: "",
//     adress: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const getUserData = async () => {
//     try {
//       const response = await axios(`http://localhost:8080/user/${id}`);
//       const data = response.data;
//       setUserFormData({
//         name: data.name,
//         lastname: data.lastname,
//         email: data.email,
//         phone: data.phone,
//         adress: data.adress,
//         password: data.password,
//       });
//     } catch (error) {
//       toast.error("Error: ", error.response);
//     }
//   };

//   useEffect(() => {
//     if (loginState) {
//       getUserData();
//     } else {
//       toast.error("You must be logged in to access this page");
//       navigate("/");
//     }
//   }, []);

//   const updateProfile = async (e) => {
//     e.preventDefault();
//     try{

//       const getResponse = await axios(`http://localhost:8080/user/${id}`);
//       const userObj = getResponse.data;

//       // saljemo get(default) request
//       const putResponse = await axios.put(`http://localhost:8080/user/${id}`, {
//         id: id,
//         name: userFormData.name,
//         lastname: userFormData.lastname,
//         email: userFormData.email,
//         phone: userFormData.phone,
//         adress: userFormData.adress,
//         password: userFormData.password,
//         userWishlist: await userObj.userWishlist
//         //userWishlist treba da stoji ovde kako bi sacuvao stanje liste zelja
//       });
//       const putData = putResponse.data;
//     }catch(error){
//       console.log(error.response);
//     }
//   }

//   return (
//     <>
//       <SectionTitle title="User Profile" path="Home | User Profile" />
//       <form className="max-w-7xl mx-auto text-center px-10" onSubmit={updateProfile}>
//         <div className="grid grid-cols-3 max-lg:grid-cols-1">
//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Name</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.name}
//               onChange={(e) => {setUserFormData({...userFormData, name: e.target.value})}}
//             />
//           </div>

//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Lastname</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.lastname}
//               onChange={(e) => {setUserFormData({...userFormData, lastname: e.target.value})}}
//             />
//           </div>

//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Email</span>
//             </label>
//             <input
//               type="email"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.email}
//               onChange={(e) => {setUserFormData({...userFormData, email: e.target.value})}}
//             />
//           </div>

//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Phone</span>
//             </label>
//             <input
//               type="tel"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.phone}
//               onChange={(e) => {setUserFormData({...userFormData, phone: e.target.value})}}
//             />
//           </div>

//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Adress</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.adress}
//               onChange={(e) => {setUserFormData({...userFormData, adress: e.target.value})}}
//             />
//           </div>

//           <div className="form-control w-full lg:max-w-xs">
//             <label className="label">
//               <span className="label-text">Your Password</span>
//             </label>
//             <input
//               type="password"
//               placeholder="Type here"
//               className="input input-bordered w-full lg:max-w-xs"
//               value={userFormData.password}
//               onChange={(e) => {setUserFormData({...userFormData, password: e.target.value})}}
//             />
//           </div>
//         </div>
//         <button
//           className="btn btn-lg bg-blue-600 hover:bg-blue-500 text-white mt-10"
//           type="submit"
//         >
//           Update Profile
//         </button>
//       </form>
//     </>
//   );
// };

// export default Profile;
// Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const Profile = () => {
//     const location = useLocation();
//     const query = new URLSearchParams(location.search);

//     // Extract user data from URL parameters
//     const name = query.get('name') || "Anonymous";
//     const email = query.get('email') || "No email provided";
//     const referralCode = query.get('referralCode') || null;

//     const [referrals, setReferrals] = useState([]);
//     const [referralLink, setReferralLink] = useState('');

//     // Generate referral link using referral code
//     useEffect(() => {
//         if (referralCode) {
//             setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
//         }
//     }, [referralCode]);

//     // Fetch referred users from the backend
//     const fetchReferredUsers = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/referred-users?referralCode=${referralCode}`);
//             setReferrals(response.data.referredUsers || []);
//         } catch (error) {
//             console.error("Error fetching referred users:", error);
//         }
//     };

//     // Fetch referrals when the component mounts
//     useEffect(() => {
//         if (referralCode) {
//             fetchReferredUsers();
//         }
//     }, [referralCode]);

//     return (
//         <div className="profile-container">
//             <h1>User Profile</h1>
//             <h2>Name: {name}</h2>
//             <h2>Email: {email}</h2>
//             <h2>Referral Code: {referralCode || "No referral code available"}</h2>
//             <h3>Referral Link: {referralLink ? <a href={referralLink}>{referralLink}</a> : "No referral link available"}</h3>

//             {/* Display referred users */}
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
            setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
        }
    }, [referralCode]);

    const fetchReferredUsers = async () => {
        try {
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

