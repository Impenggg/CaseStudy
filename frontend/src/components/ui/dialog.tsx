import * as React from "react"
import ReactDOM from "react-dom"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children, open: controlledOpen, onOpenChange }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }
  
  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  
  return (
    <button
      ref={ref}
      className={className}
      onClick={() => context?.onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  
  if (!context?.open) return null
  
  return ReactDOM.createPortal(
    <>
      {/* Modern Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-heritage-900/40 backdrop-blur-md modal-overlay animate-fade-in"
        onClick={() => context.onOpenChange(false)}
      />

      {/* Centered container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div
          ref={ref}
          className={cn(
            `relative grid w-full max-w-lg gap-4 
            border border-heritage-300
            bg-white
            p-6 shadow-2xl duration-200 rounded-2xl`,
            className
          )}
          {...props}
        >
          {children}

          {/* Clean Close button */}
          <button
            className="absolute right-4 top-4 rounded-lg p-1.5
              text-heritage-600 hover:text-heritage-900
              hover:bg-heritage-100
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-heritage-500"
            onClick={() => context.onOpenChange(false)}
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>,
    document.body
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold text-heritage-900 font-display",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
