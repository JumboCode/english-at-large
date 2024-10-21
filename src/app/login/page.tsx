"use client";
import CommonButton from "@/components/common/button/CommonButton";
import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <LoginForm />
      <CommonButton
        onClick={() => {}}
        label="Login"
        altTextStyle="text-white"
        altStyle="bg-dark-blue"
      />
    </div>
  );
};

export default Login;
