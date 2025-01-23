import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMenuStore } from "@/store/useMenuStore"
import { MneuItem } from "@/types/restaurantType"
import { Loader2 } from "lucide-react"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"


const EditMenu = ({ selectedMenu, editOpen, setEditOpen }: { selectedMenu: MneuItem, editOpen: boolean, setEditOpen: Dispatch<SetStateAction<boolean>> }) => {

    const { loading, editMenu } = useMenuStore()
    const [input, setInput] = useState<any>({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    })

    useEffect(() => {
        setInput({
            name: selectedMenu?.name || "",
            description: selectedMenu?.description || "",
            price: selectedMenu?.price || 0,
            image: undefined,
        })
    }, [selectedMenu])

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("name", input.name)
            formData.append("description", input.description)
            formData.append("price", input.price)

            if (input.image) {
                formData.append("image", input.image)
            }
            await editMenu(selectedMenu._id, formData);
            setEditOpen(false);
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Menu</DialogTitle>
                        <DialogDescription>
                            Make changes to the menu details below and click submit to save.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input type="text" value={input.name} onChange={changeEventHandler} name="name" placeholder="Enter menu name" />
                        </div>
                        <div>
                            <Label>Descriptiom</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Enter menu description"
                            />
                        </div>
                        <div>
                            <Label>Price (Rupees)</Label>
                            <Input
                                type="number"
                                name="price"
                                value={input.price}
                                onChange={changeEventHandler}
                                placeholder="Enter menu price"
                            />
                        </div>
                        <div>
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
                                    className="w-full bg-orange hover:bg-hoverOrange"
                                >
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                                    wait
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
    )
}

export default EditMenu