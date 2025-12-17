import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
// Ensure your validation schema is updated to include 'username'
import { artistRegistrationSchema, type ArtistRegistrationFormData } from "~/validators/auth.schema";

// --- Color Logic (Red, Gray, Black, White) ---
const BG_COLOR = "bg-black";
const CARD_BG = "bg-neutral-900";
const TEXT_COLOR = "text-white";
const PRIMARY_COLOR = "red"; // Main Action Color
const ERROR_COLOR = "red";   // Error Color

// Input styling with your dark theme and red focus
const InputStyle = (isError: boolean) =>
    `w-full p-4 ${CARD_BG} border ${isError ? 'border-red-600' : 'border-neutral-800'} rounded-xl 
    ${TEXT_COLOR} placeholder-neutral-500 transition duration-300 
    focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600`;

// Button styling (Red/Black/White)
const ButtonStyle = (disabled: boolean) =>
    `w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl 
    ${disabled
        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        : `bg-red-600 hover:bg-red-500 text-white shadow-red-900/20`}`;

const ArtistRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<ArtistRegistrationFormData>({
        username: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors(prevErrors => prevErrors.filter(err => err.path[0] !== e.target.name));
        setMessage(null);
    };

    const getErrorForField = (fieldName: keyof ArtistRegistrationFormData) =>
        errors.find(err => err.path[0] === fieldName)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus("loading");
        setErrors([]);
        setMessage(null);

        try {
            // 1. Client-side Validation (Ensuring username is present)
            artistRegistrationSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.issues);
                setSubmissionStatus("error");
                setMessage("Please fix the validation errors.");
                return;
            }
        }

        // 2. Submission to updated /register/artist endpoint
        try {
            const response = await axios.post("http://localhost:3001/register/artist", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.data.token) {
                setSubmissionStatus("success");
                setMessage("Artist account created! Redirecting...");
                localStorage.setItem('token', response.data.token);

                localStorage.setItem('user', JSON.stringify({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email
                }));
                setTimeout(() => {
                    window.location.href = "/artists";
                }, 1500);
            }
        } catch (error) {
            setSubmissionStatus("error");
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message || "Registration failed.");
            } else {
                setMessage("Server connection error.");
            }
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center`}>
            <div className={`w-full max-w-md p-6 ${CARD_BG} rounded-2xl shadow-2xl border border-neutral-800`}>
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${TEXT_COLOR}`}>
                        Artist Registration
                    </h2>
                    <p className="text-neutral-400 text-sm">
                        Create your profile and manage your releases.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username Field - NEW */}
                    <div>
                        <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500`}>
                            Artist Username
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><FiUser /></span>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Unique artist handle"
                                className={`${InputStyle(!!getErrorForField("username"))} pl-11`}
                            />
                        </div>
                        {getErrorForField("username") && <p className="mt-1 text-xs text-red-500">{getErrorForField("username")}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><FiMail /></span>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="artist@example.com"
                                className={`${InputStyle(!!getErrorForField("email"))} pl-11`}
                            />
                        </div>
                        {getErrorForField("email") && <p className="mt-1 text-xs text-red-500">{getErrorForField("email")}</p>}
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><FiLock /></span>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`${InputStyle(!!getErrorForField("password"))} pl-11`}
                                />
                            </div>
                        </div>
                        {getErrorForField("password") && <p className="mt-1 text-xs text-red-500">{getErrorForField("password")}</p>}
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${submissionStatus === "error" ? "bg-red-900/20 text-red-500 border border-red-900/50" : "bg-neutral-800 text-white"
                            }`}>
                            {submissionStatus === "success" && <FiCheckCircle className="text-red-500" />}
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={ButtonStyle(submissionStatus === "loading")}
                        disabled={submissionStatus === "loading"}
                    >
                        {submissionStatus === "loading" ? "Processing..." : "Create Artist Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ArtistRegistrationForm;