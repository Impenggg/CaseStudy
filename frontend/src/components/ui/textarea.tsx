import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[120px] w-full rounded-lg 
          border border-heritage-300
          bg-white
          px-4 py-3 text-base
          text-heritage-900
          placeholder:text-heritage-400
          focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-heritage-500
          focus-visible:border-heritage-500
          hover:border-heritage-400
          disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-heritage-50
          transition-all duration-200
          shadow-sm focus-visible:shadow-md
          resize-y`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
