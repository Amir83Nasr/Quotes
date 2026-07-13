"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info, TriangleAlert, Terminal } from "lucide-react"

interface GalleryDemoProps {
  component: string
}

/**
 * Renders a named gallery demo component inside a framed container.
 * Usage in MDX:
 *   <GalleryDemo component="buttonVariants" />
 */
export function GalleryDemo({ component }: GalleryDemoProps) {
  return (
    <Card className="my-6">
      <CardHeader className="border-b bg-muted/50 py-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium capitalize">
            {component.replace(/([A-Z])/g, " $1").trim()}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            live demo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-[80px] items-center justify-center gap-4 p-6">
        <DemoRenderer name={component} />
      </CardContent>
    </Card>
  )
}

function DemoRenderer({ name }: { name: string }) {
  const demos: Record<string, React.ReactNode> = {
    buttonVariants: (
      <>
        <ButtonDemo variant="default">Default</ButtonDemo>
        <ButtonDemo variant="secondary">Secondary</ButtonDemo>
        <ButtonDemo variant="outline">Outline</ButtonDemo>
        <ButtonDemo variant="ghost">Ghost</ButtonDemo>
        <ButtonDemo variant="destructive">Destructive</ButtonDemo>
        <ButtonDemo variant="link">Link</ButtonDemo>
      </>
    ),
    buttonSizes: (
      <>
        <ButtonDemo size="sm">Small</ButtonDemo>
        <ButtonDemo size="default">Default</ButtonDemo>
        <ButtonDemo size="lg">Large</ButtonDemo>
        <ButtonDemo size="icon">
          <span className="h-4 w-4 font-bold">+</span>
        </ButtonDemo>
      </>
    ),
    buttonIcons: (
      <div className="flex items-center gap-2">
        <ButtonDemo size="icon" aria-label="Settings">
          ⚙
        </ButtonDemo>
        <ButtonDemo size="icon" aria-label="Search">
          🔍
        </ButtonDemo>
        <ButtonDemo size="icon" aria-label="Menu">
          ☰
        </ButtonDemo>
        <ButtonDemo size="icon" aria-label="Close">
          ✕
        </ButtonDemo>
      </div>
    ),
    cardBasic: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Welcome to the platform. Start by choosing a category.
          </p>
        </CardContent>
      </Card>
    ),
    cardWithImage: (
      <Card className="w-full max-w-sm overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500" />
        <CardHeader>
          <CardTitle>React Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Learn useState, useEffect, and custom hooks.
          </p>
        </CardContent>
      </Card>
    ),
    cardInteractive: <InteractiveCard />,
    formInputs: (
      <div className="w-full max-w-sm space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>
    ),
    formLayout: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              placeholder="Your message..."
            />
          </div>
        </CardContent>
      </Card>
    ),
    alertVariants: (
      <div className="w-full max-w-sm space-y-3">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>A standard informational alert.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Destructive</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Here is some info for you.</AlertDescription>
        </Alert>
      </div>
    ),
    badgeVariants: (
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    ),
    tabsExample: (
      <Tabs defaultValue="tab1" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="tab1">Account</TabsTrigger>
          <TabsTrigger value="tab2">Password</TabsTrigger>
          <TabsTrigger value="tab3">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="p-4 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </TabsContent>
        <TabsContent value="tab2" className="p-4 text-sm text-muted-foreground">
          Change your password and security settings.
        </TabsContent>
        <TabsContent value="tab3" className="p-4 text-sm text-muted-foreground">
          Configure your notification preferences.
        </TabsContent>
      </Tabs>
    ),
    accordionExample: (
      <Accordion type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is React?</AccordionTrigger>
          <AccordionContent>
            React is a JavaScript library for building user interfaces.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What are hooks?</AccordionTrigger>
          <AccordionContent>
            Hooks let you use state and other React features without writing a
            class.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What is JSX?</AccordionTrigger>
          <AccordionContent>
            JSX is a syntax extension that lets you write HTML-like markup in
            JavaScript.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    dialogExample: (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed with this action? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    ),
  }

  return (
    <>
      {demos[name] ?? (
        <p className="text-sm text-muted-foreground">Demo not found: {name}</p>
      )}
    </>
  )
}

/* Inline helpers to avoid circular deps with shadcn button */
import { Button } from "@/components/ui/button"

function ButtonDemo({
  variant = "default",
  size = "default",
  children,
  ...props
}: {
  variant?:
    "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  [key: string]: unknown
}) {
  return (
    <Button variant={variant} size={size} {...props}>
      {children}
    </Button>
  )
}

function InteractiveCard() {
  const primaryAction = () => null
  const secondaryAction = () => null

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Cards can have interactive elements like buttons and links.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={primaryAction}>
            Primary
          </Button>
          <Button size="sm" variant="outline" onClick={secondaryAction}>
            Secondary
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
