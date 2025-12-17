import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { Link } from "react-router";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext"; // Integrated Auth Hook

// --- Zod Schema for Login ---
const loginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// --- Updated Color Palette (Red, Black, White, Gray) ---
const CARD_BG = "bg-neutral-900";
const INPUT_BG = "bg-black";
const TEXT_COLOR = "text-white";
const PRIMARY_RED = "red-600";
const HOVER_RED = "red-500";

const InputStyle = (isError: boolean) =>
    `w-full p-4 ${INPUT_BG} border ${isError ? 'border-red-600' : 'border-neutral-800'} rounded-xl 
    ${TEXT_COLOR} placeholder-neutral-500 transition duration-300 
    focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600`;

const ButtonStyle = (disabled: boolean) =>
    `w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2
    ${disabled
        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        : `bg-red-600 hover:bg-red-500 text-white shadow-red-900/20`}`;

// --- Component Start ---

const ArtistLoginForm: React.FC = () => {
    const { login } = useAuth(); // Access login function from context
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prevErrors => prevErrors.filter(err => err.path[0] !== e.target.name));
        setMessage(null);
    };

    const getErrorForField = (fieldName: keyof LoginFormData) =>
        errors.find(err => err.path[0] === fieldName)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus("loading");
        setErrors([]);
        setMessage(null);

        try {
            loginSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.issues);
                setSubmissionStatus("error");
                setMessage("Please enter valid credentials.");
                return;
            }
        }


        try {
            const response = await axios.post("http://localhost:3001/login", formData);

            if (response.data.token && response.data.user) {
                setSubmissionStatus("success");
                setMessage("Login successful! Redirecting...");

                const user = {
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                }
                // This call MUST match the User interface in AuthContext
                // It handles the localStorage.setItem for you!
                login(response.data.token, user);

                window.location.href = "/artists";
            }
        } catch (error) {
            setSubmissionStatus("error");
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.error || "Login failed. Check your email and password.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto p-8 ${CARD_BG} rounded-2xl shadow-2xl border border-neutral-800`}>
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${TEXT_COLOR}`}>
                    Artist Login
                </h2>
                <p className="text-neutral-400 text-sm">
                    Access your dashboard and manage releases.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className={`block mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500`}>
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><FiMail /></span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="artist@example.com"
                            className={`${InputStyle(!!getErrorForField("email"))} pl-11`}
                        />
                    </div>
                    {getErrorForField("email") && (
                        <p className="mt-2 text-xs text-red-500">
                            {getErrorForField("email")}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className={`block mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500`}>
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><FiLock /></span>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`${InputStyle(!!getErrorForField("password"))} pl-11`}
                        />
                    </div>
                    {getErrorForField("password") && (
                        <p className="mt-2 text-xs text-red-500">
                            {getErrorForField("password")}
                        </p>
                    )}
                </div>

                {/* Submission Status Message */}
                {message && (
                    <div
                        className={`p-4 rounded-xl text-sm font-medium text-center ${submissionStatus === "error"
                            ? "bg-red-900/20 text-red-500 border border-red-900/50"
                            : "bg-neutral-800 text-white"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={ButtonStyle(submissionStatus === "loading")}
                    disabled={submissionStatus === "loading"}
                >
                    {submissionStatus === "loading" ? (
                        "Authenticating..."
                    ) : (
                        <>
                            Sign In <FiArrowRight />
                        </>
                    )}
                </button>
            </form>

            {/* Footer Link */}
            <p className="text-neutral-500 text-center mt-8 pt-6 border-t border-neutral-800 text-sm">
                Don't have an account?
                <Link to="/signup" className="text-red-500 hover:text-red-400 font-bold ml-2 transition-colors">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default ArtistLoginForm;