import PageHeader from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetch } from "@/hooks/useFetch";
import RolesTab from "./RolesTab";
import StaffTab from "./StaffTab";
import type { Role } from "./types";

// Staff users and their roles (Administrators only)
export default function StaffPage() {
  const roles = useFetch<Role[]>("/staff/roles");

  return (
    <>
      <PageHeader title="Staff Users" subtitle="Who can log in to this admin panel, and what they can do." />
      {roles.error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{roles.error}</p>
      ) : (
        <Tabs defaultValue="staff">
          <TabsList className="mb-4">
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>
          <TabsContent value="staff">
            <StaffTab roles={roles.data ?? []} />
          </TabsContent>
          <TabsContent value="roles">
            <RolesTab roles={roles.data ?? []} loading={roles.loading} onChanged={roles.reload} />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
