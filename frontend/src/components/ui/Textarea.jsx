import { forwardRef } from "react";

export const Textarea = forwardRef((props, ref, rows = 1) => (
  <textarea
    {...props}
    ref={ref}
    className="w-full text-style px-4 py-2 rounded-md"
    rows={rows}
  />
));