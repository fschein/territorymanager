"use client";
import ButtonMotivation from "@/components/custom/ButtonMotivation";
import { InputWithLabel } from "@/components/custom/FormInput";
import { InstallButton } from "@/components/custom/InstallButton";
import MainComponent from "@/components/custom/MainComponent";
import { useAuthStore } from "@/context/auth-store";
import { normalizePhoneNumber } from "@/helpers/mask";
import { useUsers } from "@/hooks/useUsers";
import { KeyIcon, User } from "lucide-react";

export default function Cadastros() {
  const { mutate: updateUser } = useUsers().update();
  const user = useAuthStore().user;

  return (
    <MainComponent>
      <section className="gap-2 flex flex-col max-w-lg mx-auto">
        <div className="flex justify-center items-center bg-secondary h-28 w-28 rounded-full mx-auto mt-8 border border-slate-300 ">
          <User size={70} className="opacity-60" />
        </div>
        <InputWithLabel label="Nome" value={user?.name || ""} readOnly className="min-w-72" />
        <InputWithLabel label="Email" value={user?.email || ""} readOnly className="min-w-72" />
        <InputWithLabel
          label="Telefone"
          value={normalizePhoneNumber(user?.phone_number || "")}
          readOnly
          className="min-w-72"
        />
        <ButtonMotivation
          variant={"secondary"}
          action={(password) => updateUser({ id: user?._id || "", data: { ...user, password } })}
          inputType="password"
          placeholder="*****"
          headerTitle="Digite a nova senha"
          minLength={5}
        >
          <KeyIcon size={16} className="me-2" />
          Atualizar senha
        </ButtonMotivation>
        <InstallButton />
      </section>
    </MainComponent>
  );
}
