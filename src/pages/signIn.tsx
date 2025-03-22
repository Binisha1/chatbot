import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useLogin } from "@/hooks/auth";

const SignIn = () => {
  const { login, error } = useLogin();
  const navigate = useNavigate();
  let err = "";

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return;

    try {
      await login({ username, password });
    } catch (err) {
      console.log(err);
    }
  };
  if (error) {
    err = "Invalid Credential";
  }

  return (
    <div className="flex flex-col justify-center gap-8 items-center min-h-screen">
      <h1 className="text-2xl font-bold">Chat With Gemini</h1>
      <Card className="w-80">
        <form onSubmit={handleSignIn}>
          <CardHeader>
            <CardTitle className="text-xl pb-2">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full">
              {"Sign In"}
            </Button>
            {err && <div className=" text-red-500">{err}</div>}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                type="button"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
