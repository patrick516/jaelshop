"use client"; // needs the login and loads data in the browser

import type { Profile } from "@/types";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useLoad } from "@/hooks/useLoad";
import LoadState from "@/components/shared/LoadState";
import ProfileCard from "./ProfileCard";
import AccountMenu from "./AccountMenu";

// Only puts the account pieces together
export default function AccountHome() {
  const allowed = useRequireLogin();
  const { data, loading, error, setData } = useLoad<Profile>("/customers/me");

  if (!allowed || !data) return <LoadState loading={loading || !allowed} error={error} />;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <ProfileCard profile={data} onSaved={setData} />
      <AccountMenu />
    </div>
  );
}
