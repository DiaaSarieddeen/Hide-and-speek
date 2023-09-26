import React, { useState, useEffect } from "react";
import './Profile.css';
import { db, storage,auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Description');
  const [field, setField] = useState('Field');
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [newProfilePic, setNewProfilePic] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', name);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData) {
            setTitle(userData.title);
            setDescription(userData.description);
            setField(userData.field);
            setProfilePic(userData.profilePic || '');
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [name]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      // Save all the profile data to Firestore
      const userDocRef = doc(db, 'users',name);
      const updateData = {
        username:name,
        email: localStorage.getItem('email'),
        title,
        description,
        field,
        profilePic: newProfilePic || profilePic,
        status:"Online"
      };
      await setDoc(userDocRef, updateData); // Use setDoc to set/replace the entire document

      // If a new profile picture is selected, upload it to Firebase Storage
      if (newProfilePic) {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`${name}-profile-pic.jpg`);
        await imageRef.put(newProfilePic);
        const imageUrl = await imageRef.getDownloadURL();

        // Update the profile picture URL in Firestore
        await setDoc(userDocRef, { profilePic: imageUrl }, { merge: true });

        // Update the local state with the new profile picture URL
        setProfilePic(imageUrl);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);
  };

  const handleSignOut = async () => {
    try {
      const userDocRef = doc(db, 'users',name);
      const updateData = {
        username:name,
        email: localStorage.getItem('email'),
        title,
        description,
        field,
        profilePic: newProfilePic || profilePic,
        status:"Last seen at " + new Date().toLocaleString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      };

      await setDoc(userDocRef, updateData);
      localStorage.clear() 
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="card">
      <img src={profilePic} alt="John" style={{ width: "100%" }} />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicChange}
        disabled={!isEditing}
      />
      <h1>{isEditing ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> : name}</h1>
      <p className="title">{isEditing ? <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> : title}</p>

      {isEditing ? (
        <input type="text" value={field} onChange={(e) => setField(e.target.value)} />
      ) : (
        <p>Field: {field}</p>
      )}

      {isEditing ? (
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      ) : (
        <p>Description: {description}</p>
      )}

      <a href="#"><i className="fa fa-instagram"></i></a>
      <a href="#"><i className="fa fa-twitter"></i></a>
      <a href="#"><i className="fa fa-linkedin"></i></a>
      <a href="#"><i className="fa fa-facebook"></i></a>

      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      <div>
      <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

