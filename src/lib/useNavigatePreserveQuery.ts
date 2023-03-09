import { NavigateOptions, To, useLocation, useNavigate } from "react-router-dom";
export function useNavigatePreserveQuery() {
  const location = useLocation();
  const navigate = useNavigate();

  return (to: To, options?: NavigateOptions) => {
    if (typeof to === "string") {
      navigate(
        {
          pathname: to,
          search: location.search,
          hash: location.hash,
        },
        options,
      );
    } else {
      navigate(to, options);
    }
  };
}
