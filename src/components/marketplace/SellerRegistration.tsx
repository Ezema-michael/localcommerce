import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ImageIcon, Loader2, UploadIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SellerRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (sellerId: string) => void;
}

export default function SellerRegistration({
  open = false,
  onOpenChange,
  onSuccess,
}: SellerRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    location: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to Supabase Storage
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `seller-profiles/${fileName}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from("marketplace")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100,
            );
            setUploadProgress(percent);
          },
        });

      if (error) throw error;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("marketplace").getPublicUrl(filePath);

      // Update profile image URL
      setProfileImage(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Error uploading image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to register as a seller.",
          variant: "destructive",
        });
        return;
      }

      // Create seller in database
      const { data, error } = await supabase
        .from("sellers")
        .insert({
          name: formData.name,
          description: formData.description,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          location: formData.location,
          profile_image: profileImage,
          rating: 5.0, // Default rating for new sellers
          user_id: user.id, // Link to auth user
        })
        .select("id")
        .single();

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Your seller account has been created successfully.",
      });

      // Call onSuccess callback with the new seller ID
      if (onSuccess && data) {
        onSuccess(data.id);
      }

      // Close the dialog
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        location: "",
      });
      setPreviewUrl(null);
      setProfileImage("");
      setUploadProgress(0);
    } catch (error) {
      console.error("Error registering seller:", error);
      toast({
        title: "Registration failed",
        description:
          "There was a problem creating your seller account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Register as a Seller</DialogTitle>
            <DialogDescription>
              Fill in your details to create a seller account and start listing
              products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Business Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Tell buyers about your business"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactEmail" className="text-right">
                Email
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPhone" className="text-right">
                Phone
              </Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profileImage" className="text-right">
                Profile Image
              </Label>
              <div className="col-span-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading... {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <UploadIcon className="h-4 w-4" />
                          Upload Logo
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {profileImage && (
                      <span className="text-sm text-green-600">
                        Image uploaded successfully
                      </span>
                    )}
                  </div>

                  {previewUrl && (
                    <div className="relative w-full max-w-[200px] aspect-square rounded-md overflow-hidden border border-border">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!previewUrl && profileImage && (
                    <div className="relative w-full max-w-[200px] aspect-square rounded-md overflow-hidden border border-border">
                      <img
                        src={profileImage}
                        alt="Profile image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!previewUrl && !profileImage && (
                    <div className="flex items-center justify-center w-full max-w-[200px] aspect-square rounded-md border border-dashed border-border bg-muted/50">
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as Seller"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
