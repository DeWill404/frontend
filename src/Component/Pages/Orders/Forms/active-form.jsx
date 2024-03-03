import { ORDER_FORM_STEPPER } from "../../../../assets/data/order-data";

export default function ActiveForm({
  activeIndex,
  formState,
  formData,
  setValidator,
  isAdmin,
  resetDefault,
}) {
  return ORDER_FORM_STEPPER[activeIndex][2](
    formState,
    formData,
    setValidator,
    isAdmin,
    resetDefault
  );
}
