import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/umrah/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/umrah/"!</div>
}
