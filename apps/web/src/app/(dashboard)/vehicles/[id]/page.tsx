/**
 * Halaman detail kendaraan.
 *
 * @location apps/web/src/app/(dashboard)/vehicles/[id]/page.tsx
 * TODO: Fetch data kendaraan berdasarkan params.id, tampilkan detail + riwayat rute
 */
type Props = { params: Promise<{ id: string }> }

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Vehicle Detail</h1>
      <p className="text-sm text-gray-400">ID: {id} — coming soon</p>
    </div>
  )
}
