import { type Asset, buildImageUrl, getAssets, uploadAsset } from "@/lib/pocketbase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardAction, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Upload, X, Check } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Separator } from "./ui/separator";

interface MediaModelProps {
  open: boolean;
  onClick?: (item: Asset & { src: string}) => void;
  toggleOpen: () => void;
}

export default function MediaModel({ open, onClick, toggleOpen }: MediaModelProps) {
  const [list, setList] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(()=>{
    (async () => {
        const result = await getAssets();

        if (!result.success || !result.value) {
            return ([]);
        }

        setList(result.value);
    })()
  }, [])

  const handleDeletion = (event: MouseEvent<HTMLButtonElement>, item: Asset) => {
    event.stopPropagation();
    event.preventDefault();
    setPendingDelete(item.id);
  };

  const handleConfirmDelete = (event: MouseEvent<HTMLButtonElement>, item: Asset) => {
    event.stopPropagation();
    event.preventDefault();
    setPendingDelete(null);
  };

  const handleCancelDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setPendingDelete(null);
  };

  const handleImageSelected = (item: Asset) => {
    if (pendingDelete) return;
    if (!onClick) return;
    onClick({
      ...item,
      src: buildImageUrl(item.collectionId, item.id, item.file)
    });
    toggleOpen()
  };

  const handleUploadClick = async () => {
    fileInputRef.current?.click();

    const files: FileList | null | undefined = fileInputRef.current?.files
    
    if (!files) {
        // TODO: throw error no files found
        return
    }

    const file: File = files[0]

    const res = await uploadAsset(file, {
        name: "", // TODO: add a name fild
        type: "image", // TODO: add a select for this"image | video | svg" 
        alt: "" // TODO: add a input for this
    })
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Reset input so same file can be re-uploaded if needed
    //   event.target.value = "";
        uploadAsset
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="max-w-sm sm:max-w-5xl lg:max-w-7xl h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Media Gallery</DialogTitle>
          <Button
            size="sm"
            onClick={handleUploadClick}
            className="gap-2 mr-8"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*|video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </DialogHeader>
        <Separator orientation="horizontal" />
        <div className="overflow-y-auto pr-1 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 my-2 mx-2">
            {list.map((item) => (
              <button key={item.id} onClick={() => handleImageSelected(item)}>
                <Card className="relative mx-auto w-full max-w-sm pt-0 hover:scale-105 hover:shadow-2xl duration-300">
                  <div className="relative">
                    <img
                      src={buildImageUrl(item.collectionId, item.id, item.file)}
                      alt="Event cover"
                      className="relative z-20 aspect-video w-full object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                    <div className="absolute right-0 top-0 z-50">
                      {pendingDelete === item.id ? (
                        <ButtonGroup className="m-2">
                          <Button size="xs" variant="destructive" onClick={(e) => handleConfirmDelete(e, item)} title="Confirm delete">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="xs" onClick={handleCancelDelete} title="Cancel">
                            <X className="w-3 h-3" />
                          </Button>
                        </ButtonGroup>
                      ) : (
                        <ButtonGroup className="m-2">
                          <Button size="xs" onClick={(e) => handleDeletion(e, item)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </ButtonGroup>
                      )}
                    </div>

                    {/* Dimming overlay when pending delete */}
                    {pendingDelete === item.id && (
                      <div className="absolute inset-0 z-30 rounded-t-2xl bg-destructive/20" />
                    )}
                  </div>
                  <CardHeader className="px-1.5">
                    <CardAction />
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}