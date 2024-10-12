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
