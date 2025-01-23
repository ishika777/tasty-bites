import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import EditMenu from "./EditMenu";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { MneuItem } from "@/types/restaurantType";

const AddMenu = () => {
    const { loading, createMenu } = useMenuStore()
    const { restaurant } = useRestaurantStore();
    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedMenu, setSelectedMenu] = useState<any>();
    const [input, setInput] = useState<any>({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    });

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    }

    const submiFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", input.name)
            formData.append("description", input.description)
            formData.append("price", input.price)

            if (input.image) {
                formData.append("image", input.image)
            }
            await createMenu(formData);
            setOpen(false);
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    Available Menus
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-orange hover:bg-hoverOrange">
                            <Plus className="mr-1" /> Add Menus
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a new Menu</DialogTitle>
                            <DialogDescription>
                                Create a menu that will make your customers happy.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submiFormHandler} className="space-y-4">
                            <div className="">
                                <Label>Title</Label>
                                <Input type="text" value={input.name} onChange={changeEventHandler} name="name" placeholder="Enter menu name" />
                            </div>
                            <div className="">
                                <Label>Descriptiom</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Enter menu description"
                                />
                            </div>
                            <div className="">
                                <Label>Price (Rupees)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={input.price}
                                    onChange={changeEventHandler}
                                    placeholder="Enter menu price"
                                />
                            </div>
                            <div className="">
                                <Label>Upload menu image</Label>
                                <Input type="file" name="iamge" accept="image/*" onChange={(e) => setInput({
                                    ...input,
                                    image: e.target.files?.[0] || undefined
                                })} />
                            </div>
                            <DialogFooter className="mt-5">
                                {loading ? (
                                    <Button
                                        disabled
                                        className="w-full bg-orange hover:bg-hoverOrange flex items-center justify-center"
                                    >
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="w-full bg-orange hover:bg-hoverOrange"
                                    >
                                        Submit
                                    </Button>
                                )}

                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
            {
                restaurant?.menus.map((menu: MneuItem, idx: number) => (
                    <div key={idx} className="mt-6 space-y-4 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center p-2 md:p-4 shadow-md rounded-lg">
                            <img
                                className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
                                src={menu.image}
                                alt=""
                            />
                            <div className="flex-1 ml-4">
                                <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1>
                                <p className="text-sm text-gray-600">
                                    {menu.description}
                                </p>
                                <h2 className="text-md font-semibold mt-2">
                                    Price : <span className="text-[#D19254]">{menu.price}</span>
                                </h2>
                            </div>
                            <Button onClick={() => {
                                setSelectedMenu(menu)
                                setEditOpen(true)
                            }} size={"sm"} className="bg-orange hover:bg-hoverOrange mt-3">Edit</Button>
                        </div>
                    </div>
                ))
            }
            <EditMenu selectedMenu={selectedMenu} editOpen={editOpen} setEditOpen={setEditOpen} />
        </div>
    );
};

export default AddMenu;
