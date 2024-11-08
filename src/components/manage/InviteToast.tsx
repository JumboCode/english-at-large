import React from "react";

interface InviteToastProps {
  success: boolean | null;
}

const InviteToast = (props: InviteToastProps) => {
  const { success } = props;
  console.log(success);

  if (success == null) {
    <div />;
  } else if (success) {
    return <div>Succeeded</div>;
  } else {
    return <div>Failed</div>;
  }
};

export default InviteToast;
