import { lazy, Suspense } from "react";
import AsyncComponent from "../../../common/components/AsyncComponent";

const Home = lazy(() => import("../views/Home"));

function AsyncComponent(MyComponent) {
  return (props) => (
    <Suspense fallback={null}>
      <MyComponent {...props} />
    </Suspense>
  );
}

const routes = [
  {
    path: "/",
    exact: true,
    component: AsyncComponent(Home),
  },
];

export default routes;
