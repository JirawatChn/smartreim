import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { UserDashboardPage } from "./pages/user/dashboard";
import { AdminDashboardPage } from "./pages/admin/dashboard";
import { ProtectedRoute } from "./component/protectroutes";
import { useRole } from "./hook/userole";
import "./App.css";
import { UserSendRequestPage } from "./pages/user/sendRequest";
import { UserMyRequestsPage } from "./pages/user/request";
import { AdminRequestsPage } from "./pages/admin/requests";
import { SetRolesPage } from "./pages/setRoles";
import { AdminRequestDetailPage } from "./pages/admin/requestDetaill";

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    setAddress(accounts[0]);
    setIsConnected(true);
  } catch (err) {
    console.error("User rejected wallet connection", err);
  }
};


  const { role, isLoading } = useRole(isConnected ? address : null);

  return (
    <BrowserRouter basename="smartreim">
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onConnect={connectWallet}
              address={address}
              role={role}
            />
          }
        />
        <Route
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={[0, 1]}
              isLoading={isLoading}
            />
          }
        >
          <Route
            path="/user/dashboard"
            element={<UserDashboardPage role={role} address={address} />}
          />
          <Route
            path="/user/send"
            element={<UserSendRequestPage role={role} address={address} />}
          />
          <Route
            path="/user/requests"
            element={<UserMyRequestsPage role={role} address={address} />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={[2]}
              isLoading={isLoading}
            />
          }
        >
          <Route
            path="/admin/dashboard"
            element={<AdminDashboardPage role={role} address={address} />}
          />
          <Route
            path="/admin/requests"
            element={<AdminRequestsPage role={role} address={address} />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute
              role={role}
              allowedRoles={[0, 1, 2]}
              isLoading={isLoading}
            />
          }
        >
          <Route
            path="/admin/requests/:requestId"
            element={<AdminRequestDetailPage role={role} address={address} />}
          />
          <Route
            path="/set-roles"
            element={<SetRolesPage role={role} address={address} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
