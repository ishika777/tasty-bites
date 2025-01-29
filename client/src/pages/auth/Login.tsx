import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";



const Login = () => {

    const { login, loading } = useUserStore()
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Partial<LoginInputState>>({})
    const [seePassword, setSeePassword] = useState(false);

    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",
        admin: "false"
    });

    const handleRadioChange = (value: "true" | "false") => {
        setInput((prev) => ({ ...prev, admin: value }));
    };

    const changEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();

        //form validation
        const result = userLoginSchema.safeParse(input)
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>)
            return;
        }
        //api call
        try {
            const success = await login(input);
            if(success){
                navigate("/")
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={loginSubmitHandler}
                className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
            >
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">TastyBites</h1>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            name="email"
                            value={input.email}
                            onChange={changEventHandler}
                            className="pl-11 focus-visible:ring-1"
                        />
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

                <RadioGroup defaultValue={input.admin} name="admin" onValueChange={handleRadioChange}>
                    <div className="flex items-center mb-6 gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="r1"  />
                            <Label htmlFor="r1">User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="r2" />
                            <Label htmlFor="r2">Admin</Label>
                        </div>
                    </div>
                </RadioGroup>

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
                            Login
                        </Button>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot Password
                    </Link>
                </div>
                <Separator className="my-4" />
                <p className="mt-2 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
