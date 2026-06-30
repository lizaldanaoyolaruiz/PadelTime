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
  province: "",
  courts: "",
  observations: "",
};

export function useComplexForm(initialValues = {}) {
  return useForm({
    resolver: zodResolver(complexSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
      courts: String(initialValues.courts || ""),
    },
  });
}
