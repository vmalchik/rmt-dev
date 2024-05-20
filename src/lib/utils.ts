import toast from "react-hot-toast";

export const handleError = (error: unknown) => {
  // Version 4 of react-query library still types it as unknown. Later versions use Error.
  let message = "An unknown error occurred";
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }
  toast.error(message);
};
