import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { complexSchema } from "../schemas/complexSchema";

const DEFAULT_VALUES = {
  name: "",
  owner: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "Tucumán",
  courts: "",
  openTime: "",
  closeTime: "",
  observations: "",
};

export function useComplexForm(initialValues = {}) {
  const owner =
    typeof initialValues.owner === "object"
      ? initialValues.owner?.name || ""
      : initialValues.owner || "";
  const email =
    typeof initialValues.owner === "object"
      ? initialValues.owner?.email || ""
      : initialValues.email || "";
  const address = initialValues.address || initialValues.location || "";

  return useForm({
    resolver: zodResolver(complexSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
      owner,
      email,
      address,
      courts: String(initialValues.courts || ""),
    },
  });
}
