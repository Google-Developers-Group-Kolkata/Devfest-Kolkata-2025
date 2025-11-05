"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Github,
  Linkedin,
  Edit2,
  Save,
  X,
  Ticket,
} from "lucide-react";
export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Editable form data
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    institution: "",
    tshirtSize: "",
    isVeg: false,
    githubProfile: "",
    linkedinProfile: "",
  });

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      setIsFetchingUserData(true);

      const token = await user.getIdToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserData(response.data);

        // Initialize form data
        setFormData({
          name: response.data.name || "",
          dob: response.data.dob
            ? new Date(response.data.dob).toISOString().split("T")[0]
            : "",
          gender: response.data.gender || "",
          institution: response.data.institution || "",
          tshirtSize: response.data.tshirtSize || "",
          isVeg: response.data.isVeg || false,
          githubProfile: response.data.githubProfile || "",
          linkedinProfile: response.data.linkedinProfile || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 404) {
        toast.error("Please register first");
        router.push("/register");
      } else {
        toast.error("Failed to load user data");
      }
    } finally {
      setIsFetchingUserData(false);
    }
  };

  // Update user data
  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      const token = await user.getIdToken();

      // Format date to YYYY-MM-DD if it exists and prepare data (exclude email and phoneNo)
      const dataToSend = {
        name: formData.name,
        dob: formData.dob
          ? new Date(formData.dob).toISOString().split("T")[0]
          : null,
        gender: formData.gender,
        institution: formData.institution,
        tshirtSize: formData.tshirtSize,
        isVeg: formData.isVeg,
        githubProfile: formData.githubProfile,
        linkedinProfile: formData.linkedinProfile,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserData({ ...userData, ...formData });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userData.name || "",
      email: userData.email,
      phoneNo: userData.phoneNo,
      dob: userData.dob
        ? new Date(userData.dob).toISOString().split("T")[0]
        : "",
      gender: userData.gender || "",
      institution: userData.institution || "",
      tshirtSize: userData.tshirtSize || "",
      isVeg: userData.isVeg || false,
      githubProfile: userData.githubProfile || "",
      linkedinProfile: userData.linkedinProfile || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      fetchUserData();
    }
  }, [loading, user]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || isFetchingUserData) {
    return (
      <div className="bg-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Failed to load profile</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-[#FF5733] hover:bg-[#E64A2E] text-white px-6 py-2 rounded-md"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen py-12 px-4 md:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold product_sans mb-2">
            My Profile
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            DevFest Kolkata 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchased Tickets Card */}
            {userData.userTickets && userData.userTickets.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 product_sans">
                  <Ticket className="w-6 h-6 text-[#FF5733]" />
                  Purchased Tickets
                </h2>
                {userData.userTickets.map((userTicket, index) => (
                  <div
                    key={index}
                    className="mb-3 last:mb-0 p-4 bg-gray-50 rounded-lg border-l-4 border-[#FF5733]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {userTicket.ticket?.name || `Ticket #${index + 1}`}
                        </p>
                        {userTicket.ticket?.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {userTicket.ticket.description}
                          </p>
                        )}
                        {userTicket.ticket?.priceInPaise && (
                          <p className="text-sm text-gray-700 mt-2 font-medium">
                            ₹{(userTicket.ticket.priceInPaise / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Registration Status */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 product_sans">
                Registration Status
              </h2>
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  userData.registrationStatus === "CONFIRMED"
                    ? "bg-green-100 text-green-800"
                    : userData.registrationStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {userData.registrationStatus}
              </div>
            </div>
          </div>

          {/* Right Column - User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 product_sans">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#FF5733] hover:text-[#E64A2E] flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {userData.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email - Not Editable */}
                <div className="flex items-start gap-3 pt-3 border-t">
                  <Mail className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Email (Cannot be changed)
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* Phone - Not Editable */}
                <div className="flex items-start gap-3 pt-3 border-t">
                  <Phone className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Phone Number (Cannot be changed)
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {userData.phoneNo || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3 pt-3 border-t">
                  <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.dob || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatDate(userData.dob)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Institution */}
                <div className="flex items-start gap-3 pt-3 border-t">
                  <Building className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Institution</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            institution: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                        placeholder="Your institution name"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {userData.institution || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 product_sans">
                Additional Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Gender</p>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {userData.gender || "Not specified"}
                    </p>
                  )}
                </div>

                {/* T-Shirt Size */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">T-Shirt Size</p>
                  {isEditing ? (
                    <select
                      value={formData.tshirtSize}
                      onChange={(e) =>
                        setFormData({ ...formData, tshirtSize: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {userData.tshirtSize || "Not specified"}
                    </p>
                  )}
                </div>

                {/* Food Preference */}
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Food Preference</p>
                  {isEditing ? (
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isVeg === true}
                          onChange={() =>
                            setFormData({ ...formData, isVeg: true })
                          }
                          className="w-4 h-4 text-[#FF5733] focus:ring-[#FF5733]"
                        />
                        <span className="text-sm text-gray-900">
                          Vegetarian
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isVeg === false}
                          onChange={() =>
                            setFormData({ ...formData, isVeg: false })
                          }
                          className="w-4 h-4 text-[#FF5733] focus:ring-[#FF5733]"
                        />
                        <span className="text-sm text-gray-900">
                          Non-Vegetarian
                        </span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {userData.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 space-y-3">
                {/* GitHub Profile */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-gray-700" />
                    <p className="text-sm text-gray-600">GitHub Profile</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.githubProfile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          githubProfile: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                      placeholder="https://github.com/username"
                    />
                  ) : userData.githubProfile ? (
                    <a
                      href={userData.githubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-gray-900 font-medium break-all">
                        {userData.githubProfile}
                      </span>
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">Not provided</p>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">LinkedIn Profile</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linkedinProfile: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5733]"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : userData.linkedinProfile ? (
                    <a
                      href={userData.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-gray-900 font-medium break-all">
                        {userData.linkedinProfile}
                      </span>
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push("/ticket")}
                className="flex-1 bg-[#FF5733] hover:bg-[#E64A2E] text-white py-3 rounded-lg font-bold transition-colors"
              >
                View Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
