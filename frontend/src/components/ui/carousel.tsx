import * as React from "react"
import { cn } from "@/lib/utils"

interface CarouselContextType {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  itemsLength: number
}

const CarouselContext = React.createContext<CarouselContextType | undefined>(undefined)

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemsLength, setItemsLength] = React.useState(0)

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, itemsLength }}>
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(CarouselContext)
  
  React.useEffect(() => {
    if (context && React.Children.count(children) !== context.itemsLength) {
      context.setCurrentIndex(0)
    }
  }, [children, context])

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ 
          transform: `translateX(-${(context?.currentIndex || 0) * 100}%)` 
        }}
      >
        {children}
      </div>
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(CarouselContext)
  
  const handleClick = () => {
    if (context) {
      const newIndex = context.currentIndex > 0 ? context.currentIndex - 1 : context.itemsLength - 1
      context.setCurrentIndex(newIndex)
    }
  }

  return (
    <button
      ref={ref}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-background p-2 shadow-md",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      ←
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(CarouselContext)
  
  const handleClick = () => {
    if (context) {
      const newIndex = context.currentIndex < context.itemsLength - 1 ? context.currentIndex + 1 : 0
      context.setCurrentIndex(newIndex)
    }
  }

  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-background p-2 shadow-md",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      →
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
