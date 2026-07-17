import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/hotels/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/hotels/"!</div>
}
