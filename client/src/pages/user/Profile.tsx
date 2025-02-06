import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

const Profile = () => {

    const {user, updateProfile} = useUserStore();
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        address : user?.address || "",
        city : user?.city || "",
        country : user?.country || "",
        profilePicture : user?.profilePicture || ""
    });

    const imageRef = useRef<HTMLInputElement>(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const changeHandler = (e : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProfileData({
            ...profileData,
            [name] : value
        })
    }

    const fileChangeHnadler = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result)
                setProfileData({
                    ...profileData,
                    profilePicture : result
                })
            }
            reader.readAsDataURL(file);
        }
    }

    const updateProfileHnadler = async(e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            await updateProfile(profileData)
        } catch (error) {
            setIsLoading(false)
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <form className="max-w-7xl mx-auto my-5" onSubmit={updateProfileHnadler}>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage src={selectedProfilePicture}/>
            <AvatarFallback>CN</AvatarFallback>
            <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={fileChangeHnadler} />
            <div onClick={() => imageRef.current?.click()} className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-3 bg-black bg-opacity-50 rounded-full cursor-pointer">
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>

          <Input
            type="text"
            name="fullname"
            value={profileData.fullname}
            onChange={changeHandler}
            className= "md:text-5xl sm:text-4xl text-3xl h-auto font-bold outline-none border-none focus-visible:ring-transparent" 
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
        <div className="flex flex-row items-center gap-4 rounded-sm p-2 bg-gray-100 dark:bg-gray-900">
            <Mail className="text-gray-500" />
            <div className="w-full">
                <Label className="">Email</Label>
                <input 
                disabled
                type="text" 
                name="email"
                value={profileData.email}
                onChange={changeHandler}
                aria-disabled
                className="w-full text-gray-600 cursor-not-allowed bg-transparent focus-visible:ring-1 focus-visible:ring-transparent focus-visible:border-transparent outline-none border-none"
                />

            </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-100 dark:bg-gray-900">
            <LocateIcon className="text-gray-500" />
            <div className="w-full">
                <Label className="text-start">Address</Label>
                <input 
                type="text" 
                name="address"
                value={profileData.address}
                onChange={changeHandler}
                className="w-full text-gray-600 bg-transparent focus-visible:ring-1 focus-visible:ring-transparent focus-visible:border-transparent outline-none border-none"
                />

            </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-100 dark:bg-gray-900">
            <MapPin className="text-gray-500" />
            <div className="w-full">
                <Label>City</Label>
                <input 
                type="text" 
                name="city"
                value={profileData.city}
                onChange={changeHandler}
                className="w-full text-gray-600 bg-transparent focus-visible:ring-1 focus-visible:ring-transparent focus-visible:border-transparent outline-none border-none"
                />

            </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-100 dark:bg-gray-900">
            <MapPinnedIcon className="text-gray-500" />
            <div className="w-full">
                <Label>Country</Label>
                <input 
                type="text" 
                name="country"
                value={profileData.country}
                onChange={changeHandler}
                className="w-full text-gray-600 bg-transparent focus-visible:ring-1 focus-visible:ring-transparent focus-visible:border-transparent outline-none border-none"
                />

            </div>
        </div>
      </div>

      <div>
        {
            isLoading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</Button>
            ) : (

                <Button type="submit" className="bg-orange hover:bg-hoverOrange">Update Profile</Button>
            )
        }
      </div>

    </form>
  );
};

export default Profile;
