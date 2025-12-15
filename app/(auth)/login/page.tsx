import LoginUI from "@/modules/auth/components/login-ui";
import { requireUnAuth } from "@/modules/auth/utils/auth-utils";
import React from "react";

const page = async () => {
  await requireUnAuth();
  return <LoginUI />;
};

export default page;
