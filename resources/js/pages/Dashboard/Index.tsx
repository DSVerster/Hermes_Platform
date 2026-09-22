import * as React from 'react'
import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

type Props = { title: string }

export default function Index({ title }: Props) {
  return (
    <>
      <Head title={title} />
      <main className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open {title} Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  This dialog belongs to the {title} page.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </header>
      </main>
    </>
  )
}