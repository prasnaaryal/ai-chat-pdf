'use client';

import UploadFile from "@/components/UploadFile";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { isSignedIn, userId } = useAuth();
  const { user, isLoaded } = useUser();
  const isAuth = !!userId;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = useCallback((file: File | null) => {
    setSelectedFile(file);
    // You can add more logic here if needed, for example, upload the file to the server
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="flex gap-4 items-center">
            <h1 className="text-5xl font-semibold">Chat with any PDF</h1>
            {isLoaded ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
          </div>

          <div className="flex mt-2">
            <Link href="/chat">
              <Button>Go to Chats</Button>
            </Link>
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchers, and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <UploadFile
                onFileSelected={handleFileSelected}
                initialFile={null}
              />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
