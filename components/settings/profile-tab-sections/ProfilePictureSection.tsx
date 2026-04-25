import React from "react";
import { User as UserIcon, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePictureSectionProps {
  photo: string;
  getPhotoUrl: (val: string) => string;
  handlePhotoClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePictureSection({
  photo, getPhotoUrl, handlePhotoClick, fileInputRef, handleFileChange
}: ProfilePictureSectionProps) {
  return (
    <Card className="rounded-xl border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-card/50 sticky top-8">
      <CardHeader className="border-b border-border/10 bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-black text-xl">Profile Picture</CardTitle>
            <CardDescription className="font-medium">This will be visible on the sidebar and portal.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 flex flex-col items-center">
        <div 
          onClick={handlePhotoClick}
          className="group relative w-48 h-48 rounded-full border-4 border-dashed border-border flex items-center justify-center transition-all overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-primary/5"
        >
          {photo ? (
            <div className="relative w-full h-full">
              <img 
                src={getPhotoUrl(photo)} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <UserIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="text-xs font-bold text-muted-foreground">Upload Photo</p>
            </div>
          )}
        </div>
        
        <p className="mt-4 text-xs font-medium text-muted-foreground text-center max-w-[200px]">
          JPG, GIF or PNG. Max size of 2MB.
        </p>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </CardContent>
    </Card>
  );
}
