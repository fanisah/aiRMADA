'use client'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-screen-lg space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">User Profile</h1>
        <p className="text-sm text-slate-500">Manage your account information and preferences</p>
      </div>

      {/* Card */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Top Profile */}
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-xl font-semibold text-white">
            AN
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">Andi Wijaya</h2>
            <p className="text-sm text-slate-500">Manager</p>
          </div>

          <button className="ml-auto rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">
            Change Avatar
          </button>
        </div>

        <hr />

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input defaultValue="Andi Wijaya" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          {/* Short Name */}
          <div>
            <label className="text-sm text-slate-600">Short Name</label>
            <input defaultValue="ANDI" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-slate-600">Email Address</label>
            <input
              defaultValue="andi@airmada.id"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-slate-600">Role</label>
            <select className="mt-1 w-full rounded-lg border px-3 py-2">
              <option>Manager</option>
              <option>Driver</option>
              <option>Dispatcher</option>
            </select>
          </div>

          {/* Phone */}
          <div className="col-span-2">
            <label className="text-sm text-slate-600">Cell Phone</label>
            <input
              defaultValue="+62-821-5544-7788"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border px-4 py-2">Cancel</button>
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-white">Save Changes</button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-600">
        <p className="mb-2 font-semibold">Profile Tips</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Short Name is used for driver identification</li>
          <li>Phone must include country code</li>
          <li>Role determines access level</li>
        </ul>
      </div>
    </div>
  )
}
