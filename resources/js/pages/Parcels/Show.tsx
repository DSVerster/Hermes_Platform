import * as React from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

type Parcel = {
  id: number
  tracking_number: string
  status: 'received' | 'ready_for_collection' | 'collected'
  received_at: string
}

type Props = {
  title: string
  parcel: Parcel
}

export default function Show({ title, parcel }: Props) {
  return (
    <>
      <Head title={title} />
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open {title} Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </header>

        <section className="rounded-xl border p-4 space-y-4">
          <div>
            <strong>Tracking Number:</strong> {parcel.tracking_number}
          </div>
          <div>
            <strong>Status:</strong> {parcel.status}
          </div>
          <div>
            <strong>Received:</strong> {parcel.received_at}
          </div>
          
          <Link href="/parcels" className="text-blue-600 underline">
            ? Back to Parcels
          </Link>
        </section>
      </div>
    </>
  )
}