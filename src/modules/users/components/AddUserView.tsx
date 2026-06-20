import { PageContainer } from "@/components/ui";
import { AddUserForm } from "@/modules/users/forms/AddUserForm";

export function AddUserView() {
  return (
    <PageContainer
      title="Add User"
      description="Register a new user in the system."
    >
      <AddUserForm />
    </PageContainer>
  );
}
