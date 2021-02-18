import React from "react";
import { Provider, useDispatch } from "react-redux";
import { Switch } from "react-router";
import { ConnectedRouter, push } from "connected-react-router";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import NavBar from "./components/Common/NavBar";
import { configureStore, history } from "./store/configureStore";

const ThemeProvider = ({ theme: themeUI, children }) => {
  return <StyledThemeProvider theme={themeUI}>{children}</StyledThemeProvider>;
};

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

export default function Root() {
  const dispatch = useDispatch();

  const init = () => {
    dispatch(push("/home"));
  };
  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  const { store, persistor } = configureStore();

  window.__store = store;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <MainContainer>
              <Wrapper>
                <NavBar />
                {/* <Switch>
                  {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} /> // eslint-disable-line
                  ))}
                </Switch> */}
                CIAO
              </Wrapper>
            </MainContainer>
          </ConnectedRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
