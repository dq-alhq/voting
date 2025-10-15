import { IconLoader2 } from "@tabler/icons-react";
import type * as React from "react";
import { Button } from "./button";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
}

export function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? (
        <>
          <IconLoader2 className="size-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
