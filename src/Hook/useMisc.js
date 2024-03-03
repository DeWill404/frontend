import { useDispatch } from "react-redux";
import {
  logoutUser,
  setUserInfo,
  setUserToken,
} from "../Helper/browser-storage";
import { setLogin, setLogout } from "../Store/auth.slice";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../Helper/contant";

export default function useMisc() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const setUserLogin = (data, dontLogin = false) => {
    const { accessToken, ...user } = data;
    setUserInfo(user);
    setUserToken(accessToken);
    dispatch(setLogin({ user, accessToken, dontLogin }));
    if (!dontLogin) {
      navigate(ROUTE.USER.route);
    }
  };

  const setUserLogout = () => {
    logoutUser();
    dispatch(setLogout());
    navigate(ROUTE.LOGIN.route);
  };

  return { setUserLogin, setUserLogout };
}
