import { useEffect } from "react";
import { MESSAGE } from "../Helper/contant";
import { useDispatch } from "react-redux";
import { setLogout } from "../Store/auth.slice";
import { logoutUser } from "../Helper/browser-storage";

export default function useMessage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const messageListener = (event) => {
      if (event?.data?.target === MESSAGE._TARGET_) {
        const { type } = event.data;
        switch (type) {
          case MESSAGE.LOGOUT:
            logoutUser();
            dispatch(setLogout(true));
            break;
          default:
            console.warn("Invalid message type:", type);
            break;
        }
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);
}
