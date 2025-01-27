import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, PhoneCallIcon, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";

const Signup = () => {

    const { signup, loading } = useUserStore()
    const naviagte = useNavigate()
    const [errors, setErrors] = useState<Partial<SignupInputState>>({})
    const [seePassword, setSeePassword] = useState(false);
    const [input, setInput] = useState<SignupInputState>({
        fullname: "",
        email: "",
        password: "",
        contact: ""
    });

    

    const changEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const signupSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();

        //form validation
        const result = userSignupSchema.safeParse(input)
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            console.log(fieldErrors)
            setErrors(fieldErrors as Partial<SignupInputState>)
            return;
        }
        try {
            await signup(input)
            naviagte("/verify-email")
        } catch (err) {
            console.log(err);
        }
        setInput({
            fullname: "",
            email: "",
            password: "",
            contact: ""
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={signupSubmitHandler}
                className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
            >
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">TastyBites</h1>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Full name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <User2 className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.fullname}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            name="email"
                            value={input.email}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.email}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        <Input
                            type={seePassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1 pr-11"
                        />
                        {
                            seePassword ? (
                                    <Eye size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            ) : (
                                
                                    <EyeOff size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            )
                        }
                        {
                            errors && <span className="text-xs text-red-500">{errors.password}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={input.contact}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
                        <PhoneCallIcon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.contact}</span>
                        }
                    </div>
                </div>

                <div>
                    {loading ? (
                        <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-orange hover:bg-hoverOrange"
                        >
                            Signup
                        </Button>
                    )}
                </div>
                <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
