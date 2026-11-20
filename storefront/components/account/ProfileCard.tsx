"use client"; // switches between the card and the edit form

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Profile } from "@/types";
import ProfileForm from "./ProfileForm";

// The navy profile summary at the top of the account page
export default function ProfileCard({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileForm
        profile={profile}
        onSaved={(p) => {
          onSaved(p);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-navy p-5 text-white">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xl font-extrabold">
        {profile.firstName.charAt(0)}
        {profile.lastName.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-extrabold">
          {profile.firstName} {profile.lastName}
        </p>
        <p className="truncate text-sm text-white/80">{profile.email}</p>
        {profile.phone && <p className="text-sm text-white/80">{profile.phone}</p>}
      </div>
      <button aria-label="Edit profile" onClick={() => setEditing(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Pencil size={18} />
      </button>
    </div>
  );
}
