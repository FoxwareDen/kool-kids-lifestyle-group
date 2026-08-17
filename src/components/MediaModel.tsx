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
  accept?: "image" | "video" | "all";
  onClick?: (item: Asset & { src: string }) => void;
  toggleOpen: () => void;
}

function getAssetType(file: File): "image" | "video" | "svg" {
  if (file.type === "image/svg+xml") return "svg";
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

export default function MediaModel({ open, onClick, toggleOpen, accept = "all" }: MediaModelProps) {
  const [list, setList] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await getAssets();
      if (!result.success || !result.value) return;
      setList(result.value);
    })();
  }, []);

  const handleDeletion = (event: MouseEvent<HTMLButtonElement>, item: Asset) => {
    event.stopPropagation();
    event.preventDefault();
    setPendingDelete(item.id);
  };

  const handleConfirmDelete = (event: MouseEvent<HTMLButtonElement>, item: Asset) => {
    event.stopPropagation();
    event.preventDefault();
    setPendingDelete(null);

    // TODO: check related items tied to this image
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
      src: buildImageUrl(item.collectionId, item.id, item.file),
    });
    toggleOpen();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file: File | null = files.item(files.length - 1);
    
    if (!file) return;
      
    const derivedType = getAssetType(file);

    setIsLoading(true);
    setError(null);  

    try {
      const res = await uploadAsset(file, {
        name: file.name.replace(/\.\w+/, ""),
        type: derivedType,
        alt: "",
      });

      if (res.success && res.value) {
        setList((prev) => [...prev, res.value]);
      }
    } catch (e) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const acceptAttr =
    accept === "image" ? "image/*" :
    accept === "video" ? "video/*" :
    "image/*,video/*";

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="max-w-sm sm:max-w-5xl lg:max-w-7xl h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Media Gallery</DialogTitle>
          <Button
            size="sm"
            onClick={handleUploadClick}
            disabled={isLoading}
            className="gap-2 mr-8"
          >
            <Upload className="w-4 h-4" />
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            onChange={handleFileChange}
          />
        </DialogHeader>

        {error && (
          <p className="text-sm text-destructive px-1">{error}</p>
        )}

        <Separator orientation="horizontal" />

        <div className="overflow-y-auto pr-1 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 my-2 mx-2">
            {list.map((item) => (
                <div key={item.id} onClick={() => handleImageSelected(item)}>
                <Card className="relative mx-auto w-full max-w-sm pt-0 hover:scale-105 hover:shadow-2xl duration-300">
                  <div className="relative">
                    {
                      item.type == "image" || item.type == "svg" ? (
                        <img
                          src={buildImageUrl(item.collectionId, item.id, item.file)}
                          alt={item.alt}
                          className="relative z-20 aspect-video w-full object-cover rounded-t-2xl"
                          loading="lazy"
                        />
                      ) : (
                        <video src={buildImageUrl(item.collectionId, item.id, item.file)} controls className="w-full rounded-xl shadow-lg shadow-[var(--brand-navy)]/10" />
                      )
                    }
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

                    {pendingDelete === item.id && (
                      <div className="absolute inset-0 z-30 rounded-t-2xl bg-destructive/20" />
                    )}
                  </div>
                  <CardHeader className="px-1.5">
                    <CardAction />
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}