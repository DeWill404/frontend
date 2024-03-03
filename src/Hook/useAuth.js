import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getRouteFromPath } from "../Helper/misc";
import { toast } from "react-toastify";
import { ROUTE } from "../Helper/contant";
import { getUserInfo, getUserToken } from "../Helper/browser-storage";
import { clearRedirected, setLSChecked, setLogin } from "../Store/auth.slice";

export default function useAuth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isLogined, isLSChecked, isRedirected } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let LSLogin = false;
    if (!isLogined && !isLSChecked) {
      const accessToken = getUserToken();
      if (accessToken) {
        const user = getUserInfo();
        dispatch(setLogin({ user, accessToken }));
        LSLogin = true;
      } else {
        dispatch(setLSChecked(true));
      }
    }

    const route = getRouteFromPath(pathname);
    if (route) {
      if (route.isProtected && !(isLogined || LSLogin)) {
        if (isRedirected) {
          toast.error("You session has expired, please login again.");
          dispatch(clearRedirected());
        } else {
          toast.error("Please login to access this page.");
        }
        navigate(ROUTE.LOGIN.route);
      } else if (route === ROUTE.RESET_PASSWORD) {
        // skip redirect for reset password page
      } else if (route === ROUTE.ROOT) {
        if (isLogined || LSLogin) {
          navigate(ROUTE.USER.route);
        } else {
          navigate(ROUTE.LOGIN.route);
        }
      }
    }
  }, [pathname, isLogined]);

  return { isLogined };
}
