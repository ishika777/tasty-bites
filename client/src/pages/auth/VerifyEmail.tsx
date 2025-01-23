import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/useUserStore"
import { Loader2 } from "lucide-react"
import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"


const VerifyEmail = () => {

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
    const inputRef = useRef<any>([])
    const navigate = useNavigate()
    const {verifyEmail, loading} = useUserStore()

    const handleChange = (index: number, value: string) => {
        if(/^[a-zA-Z0-9]$/.test(value) || value === ""){
            const newOtp = [...otp]
            newOtp[index] = value;
            setOtp(newOtp);
        }
        if(value !== "" && index < 5){
            inputRef.current[index+1].focus()
        }
    }

    const handleKeyDown = (index: number, e:KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index>0){
            inputRef.current[index-1].focus()
        }
    }

    const submitHandler = async(e : FormEvent) => {
        e.preventDefault()
        const verificationCode = otp.join("");
        try {
            await verifyEmail(verificationCode)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="p-8 rounded-md max-w-md flex flex-col gap-10 border border-gray-200">
            <div className="">
                <h1 className="font-extrabold text-2xl">Verify your email</h1>
                <p className="text-sm text-gray-600">Enter the 6 digit code sent to your email address</p>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex justify-between gap-3">
                    {
                        otp.map((letter : string, idx : number) => (
                            <Input 
                                key={idx}
                                type="text"
                                value={letter}
                                maxLength={1}
                                onChange={(e : ChangeEvent<HTMLInputElement>) => handleChange(idx, e.target.value)}
                                ref={(element) => inputRef.current[idx] = element}
                                onKeyDown={(e : KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)}
                                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-500"
                            />
                        ))
                    }
                </div>
                {
                    loading ? (
                        <Button disabled className="w-full bg-orange hover:bg-hoverOrange mt-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
                    ) : (

                        <Button  type="submit" className="bg-orange hover:hoverOrange mt-6 w-full">Verify</Button>
                    )
                }
            </form>
        </div>
    </div>
  )
}

export default VerifyEmail