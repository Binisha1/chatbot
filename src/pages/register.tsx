import React, { useState } from "react";
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
import { useRegister } from "@/hooks/auth";
import { useNavigate } from "react-router";

const Register = () => {
  const { register } = useRegister();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Ensure correct field names
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return;

    try {
      await register({ username, password });
      setError(null);
    } catch (err) {
      setError(err.message);
      // Error is handled in the hook.
    }
  };

  return (
    <div className="flex flex-col justify-center gap-8 items-center min-h-screen">
      <h1 className="text-2xl font-bold">Chat With Gemini</h1>
      <Card className="w-80">
        <form onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className="text-xl pb-2">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <Input id="signup-username" name="username" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full">
              {"Sign Up"}
            </Button>
            {error && <div className=" text-red-500">{error}</div>}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                type="button"
                onClick={() => navigate("/")}
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
