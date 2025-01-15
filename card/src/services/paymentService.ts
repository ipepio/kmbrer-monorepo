import { RedsysForm } from "@/types/props";
export const redirectToRedsys = (form: RedsysForm) => {
  const redsysForm = document.createElement("form");
  redsysForm.action = form.action; // URL de Redsys
  redsysForm.method = "POST";
  Object.entries({
    Ds_SignatureVersion: form.Ds_SignatureVersion,
    Ds_MerchantParameters: form.Ds_MerchantParameters,
    Ds_Signature: form.Ds_Signature,
  }).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    redsysForm.appendChild(input);
  });
  document.body.appendChild(redsysForm);
  redsysForm.submit();
};
